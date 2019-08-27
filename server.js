console.log('hi');
const fetch = require('node-fetch');
const https = require('https');
const url = "https://geodienste.hamburg.de/HH_WFS_Stadtrad?service=WFS&request=GetFeature&VERSION=1.1.0&typename=stadtrad_stationen";





fetch(url)
    .then( response => response.text())
    .then( res => {
        //console.log(res);
        const fs = require('fs');
        fs.writeFile("/tmp/cityBikes", res, function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });

    });

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
                'Content-Type': 'application/xml',
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

//bikeData().then( res => console.log(res));