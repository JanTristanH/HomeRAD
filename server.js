const fetch = require('node-fetch');
const parser = require('fast-xml-parser');
const fs = require('fs');
const url = "https://geodienste.hamburg.de/HH_WFS_Stadtrad?service=WFS&request=GetFeature&VERSION=1.1.0&typename=stadtrad_stationen";

fetch(url)
    .then( response => response.text())
    .then( res => {
        //console.log(res);

        let tObj = parser.getTraversalObj(res);
        let jsonObj = parser.convertToJson(tObj);
        console.log(jsonObj[`wfs:FeatureCollection`][`gml:featureMember`].filter( e => {
            //returns an array with only desired station, for testing purposes only Sievekingsallee / Sievekingdamm
            return  e[`app:stadtrad_stationen`][`app:uid`] == "3CB6C09F1CF83370E57148D538F04E530AC4041D";
        })[0][`app:stadtrad_stationen`][`app:anzahl_raeder`]);
        console.log("Bikes are currently available at Sievekingsallee / Sievekingdamm");
        fs.writeFile("/tmp/allCityBikes", res, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
    });

    });
