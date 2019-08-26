console.log('hi');
const https = require('https');
const url = "https://geodienste.hamburg.de/HH_WFS_Stadtrad?service=WFS&request=GetFeature&VERSION=1.1.0&typename=stadtrad_stationen";




/*
fetch(url, {method: 'GET'})
    .then( response => {
        if (response.ok){
            return response.json();
        }
    }).then(jsonResponse => {
    JSON.stringify(jsonResponse);
        //console.log(jsonResponse);
});
*/
let bikeData = () => {
    return new Promise((resolve, reject) => {
        const host = "geodienste.hamburg.de";
        const  path = "HH_WFS_Stadtrad";//?service=WFS&request=GetFeature&VERSION=1.1.0&typename=stadtrad_stationen";
        const options = {
            host,
            port: 443,
            path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'service' : 'WFS',
                'request':'GetFeature',
                'VERSION': '1.1.0',
                'typename' : 'stadtrad_stationen'
            }
        };

        let json = '';
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => json += chunk);
            res.on('end', () => {
                console.log(`Request to API successful`);
                resolve(json);//JSON.parse(json));
            });
        });
        req.on('error', (e) => {
                console.error(`Request to API failed with ${e}`);
                reject(json);
            }
        );
        //req.write(body);
        req.end();
    })
};

bikeData().then( res => console.log(res));