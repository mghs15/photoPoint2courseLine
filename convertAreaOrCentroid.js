const fs = require("fs");
const readline = require('readline');
const turf = require('@turf/turf');


const tmp = {};
const geojson = {
  "type": "FeatureCollection",
  "features": []
};


const json = require("./sample1.json");
json.resultJsondata.forEach( p => {
  let info = "";
  for(name in p){
    info = info + `${name}: ${p[name]},`;
  }
  //console.log(info);
  
  const pp = {
    "type": "Feature",
    "properties": p,
    "geometry": {
      "type": "Point",
      "coordinates": [+p.imageCenterLon, +p.imageCenterLat]
    }
  };
  
  geojson.features.push(pp);
  
  if(!tmp[p.adviceNumber]){
    tmp[p.adviceNumber] = {
      "type": "FeatureCollection",
      "features": []
    };
  }
  
  tmp[p.adviceNumber].features.push(pp);
  
});


for( name in tmp ){
  const fc = tmp[name];
  console.log(name);
  
  //領域
  //const poly = turf.concave(fc, {units: 'miles', maxEdge: 5});
  const poly = turf.convex(fc, {properties: fc.features[0].properties});
  if(poly) geojson.features.push(poly);
  
  //重心
  const centroid = turf.centroid(fc);
  if(centroid){ 
    centroid.properties = {
        "name": name,
        "_markerType": "Icon",
        "_iconUrl": "https://maps.gsi.go.jp/portal/sys/v4/symbols/081.png",
        "_iconSize": [
          30,
          30
        ],
        "_iconAnchor": [
          15,
          15
        ]
    },
    geojson.features.push(centroid);
  }
  
}

fs.writeFileSync("geojson.geojson", JSON.stringify(geojson, null, 2));  


