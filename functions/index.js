'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'bike available'.
app.intent('bike available', async (conv) => {
    return new Promise((resolve, reject) =>{
        const fetch = require('node-fetch');
        const parser = require('fast-xml-parser');
        const url = 'https://geodienste.hamburg.de/HH_WFS_Stadtrad?service=WFS&request=GetFeature&VERSION=1.1.0&typename=stadtrad_stationen';
        const stationId = 'e93a5c34-df7f-4cde-b3e4-36f81f8d5726';
        fetch(url)
            .then((response) => {
                return response.text();
            })
            .then((res) => {
                let jsonObj = parser.parse(res);
                let bikeCount = jsonObj[`wfs:FeatureCollection`][`gml:featureMember`].filter( (e) => {
                    // returns an array with only desired stations, for testing purposes only Sievekingsallee / Sievekingdamm
                    return e[`de.hh.up:stadtrad_stationen`][`de.hh.up:uid`] == stationId;
                })[0][`de.hh.up:stadtrad_stationen`][`de.hh.up:anzahl_raeder`];
                // Respond with the bike count and end the conversation.
                if(bikeCount){
                    if(bikeCount === 1){
                        conv.close(`Momentan ist ${bikeCount} Rad bei Sievekingallee verfügbar.`);
                    } else{
                        conv.close(`Momentan sind ${bikeCount} Räder bei Sievekingallee verfügbar.`);
                    }
                } else {
                    conv.close('Leider sind gerade keine Räder bei Sievekingsallee verfügbar.');
                }
                resolve();
            })
            .catch( (error) => {
                console.log(error);
                conv.close(`Irgendwas lief schief beim Verbinden mit den Stadtrad Servern. Bitte probier es später nochmal.`);
                resolve();
            } );
    });
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.region('europe-west1').https.onRequest(app);
