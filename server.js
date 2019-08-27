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
