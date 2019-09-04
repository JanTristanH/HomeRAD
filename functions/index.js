// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {color}) => {
    const luckyNumber = color.length;
    // Respond with the user's lucky number and end the conversation.
    conv.close('Your lucky number is ' + luckyNumber);
});

app.intent('bike available', async (conv) => {
    return new Promise((resolve, reject) =>{
        const fetch = require('node-fetch');
        const parser = require('fast-xml-parser');
        const url = 'https://geodienste.hamburg.de/HH_WFS_Stadtrad?service=WFS&request=GetFeature&VERSION=1.1.0&typename=stadtrad_stationen';

        fetch(url)
            .then((response) => {
                return response.text();
            })
            .then((res) => {
                let tObj = parser.getTraversalObj(res);
                let jsonObj = parser.convertToJson(tObj);
                // eslint-disable-next-line max-len
                let bikeCount = jsonObj[`wfs:FeatureCollection`][`gml:featureMember`].filter( (e) => {
                    // eslint-disable-next-line max-len
                    // returns an array with only desired stations, for testing purposes only Sievekingsallee / Sievekingdamm
                    // eslint-disable-next-line max-len
                    return e[`app:stadtrad_stationen`][`app:uid`] == '3CB6C09F1CF83370E57148D538F04E530AC4041D';
                })[0][`app:stadtrad_stationen`][`app:anzahl_raeder`];
                // Respond with the bike count  and end the conversation.
                console.log(bikeCount);
                // eslint-disable-next-line max-len
                if(bikeCount){
                    if(bikeCount = 1){
                        conv.close(`Momentan ist ${bikeCount} Rad bei Sievekingalle verfügbar".`);
                    } else{
                    conv.close(`Momentan sind ${bikeCount} Räder bei Sievekingalle verfügbar".`);
                    }
                } else {
                    conv.close('Leider sind gerade keine Räder bei Sievekingsallee verfügbar.');
                }

                resolve();
            })
            .catch( (error) => {
                // eslint-disable-next-line max-len
                conv.close(`Irgendwas lief schief beim Verbinden mit den Stadtrad Servern. Bitte probier es später nochmal.`);
                resolve();
            } );
    });
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);