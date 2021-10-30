const fs = require("fs");

const json = require("./sample1.json");

const tmp = {};
json.resultJsondata.forEach( p => {
  
  const c = {};
  
  //整理に必要な情報
  c.photoNumber = p.photoNumber; 
  c.referenceNumber = p.referenceNumber;
  c.courseNumber = p.courseNumber;
  [c.lng, c.lat] = p.center.split("_");
  
  //最終的に欲しい情報
  c.specificationId = p.specificationId;
  c.scale = p.scale;
  c.searchDate = p.searchDate;
  c.colorTypeId = p.colorTypeId;
  
  if(!tmp[c.referenceNumber]) tmp[c.referenceNumber] = {};
  if(!tmp[c.referenceNumber][c.courseNumber]){
    tmp[c.referenceNumber][c.courseNumber] = {
      "properties": {
        //"specificationId" : c.specificationId,
        "scale" : c.scale,
        "searchDate" : c.searchDate,
        "colorTypeId" : c.colorTypeId
      },
      "vertex" : {}
    };
  }
  
  tmp[c.referenceNumber][c.courseNumber].vertex[c.photoNumber] = [c.lng, c.lat];
  
});



const geojson = {
  "type": "FeatureCollection",
  "features": []
};

for(reference in tmp){
  const r = tmp[reference];
  for(course in r){
    const c = r[course];
    const vertex = c.vertex;
    const prop = c.properties;
    
    const g = {
      "type": "Feature",
      "properties": prop,
      "geometry": {
        "type": "LineString",
        "coordinates": []
      }
    };
    
    const photoNumList = Object.keys(vertex).sort();
    photoNumList.forEach( v => {
      g.geometry.coordinates.push(vertex[v]);
    });
    
    g.properties.referenceNumber = reference;
    g.properties.courseNumber = course;
    
    //書き出し
    geojson.features.push(g);
      // or
    const res = JSON.stringify(g) + "\n";
    try {
      fs.appendFileSync("sample.ndjson", res);
    }catch (e) {
      console.log(e);
    }
    
  }
}

fs.writeFileSync("sample.geojson", JSON.stringify(geojson));


