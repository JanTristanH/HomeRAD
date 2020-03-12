const parser = require('./functions/fast-xml-parser');
const fetch = require('./functions/node-fetch');

const url = 'https://geodienste.hamburg.de/HH_WFS_Stadtrad?service=WFS&request=GetFeature&VERSION=1.1.0&typename=stadtrad_stationen';


fetch(url)
            .then((response) => {
                return response.text();
            })
            .then((res) => {
                let jsonObj = parser.parse(res);
                console.log(jsonObj[`wfs:FeatureCollection`][`gml:featureMember`]);
            });