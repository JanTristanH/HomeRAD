const parser = require('fast-xml-parser');
const fetch = require('node-fetch');

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
                console.log (bikeCount);
            });