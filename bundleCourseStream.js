const fs = require("fs");
const readline = require('readline');

const rs = fs.createReadStream('./_sample.csv');
const ws = fs.createWriteStream('./_photo.ndjson');
const rl = readline.createInterface({input: rs, output: ws});

const tmp = {};

rl.on('line', (line) => {

  if(!line || line=="") return;
  
  const csv = line.split(",");
  
  const c = {};
  
  //整理に必要な情報
  c.referenceNumber = csv[20]; //p.referenceNumber;
  c.courseNumber = csv[4]; // p.courseNumber;
  c.photoNumber = csv[19]; //p.photoNumber; 
  [c.lng, c.lat] =  csv[0].split("_"); //p.center.split("_");
  
  //最終的に欲しい情報
  c.specificationId = csv[30]; // p.specificationId;
  c.scale = csv[27];  //p.scale;
  c.searchDate = csv[28];  // p.searchDate;
  c.colorTypeId = csv[1]; // p.colorTypeId;
  
  console.log(c);
  
  //コースのライン用
  if(!tmp[c.referenceNumber]) tmp[c.referenceNumber] = {};
  if(!tmp[c.referenceNumber][c.courseNumber]){
    tmp[c.referenceNumber][c.courseNumber] = {
      "properties": {
        //"specificationId" : c.specificationId,
        /*
        "scale" : c.scale,
        "searchDate" : c.searchDate,
        "colorTypeId" : c.colorTypeId
        */
        "scale" : +c.scale,
        "date" : "2002-01-31", //c.searchDate,
        "color" : +c.colorTypeId
      },
      "vertex" : {}
    };
  }
  
  tmp[c.referenceNumber][c.courseNumber].vertex[c.photoNumber] = [+c.lng, +c.lat];
  
  //写真そのもののポイント用
  const pp = {
    "type": "Feature",
    "properties": {
      /*
      "specificationId" : c.specificationId,
      "scale" : c.scale,
      "searchDate" : c.searchDate,
      "colorTypeId" : c.colorTypeId
      */
      "ID" : c.specificationId,
      "scale" : +c.scale,
      "date" : "2002-01-31", //c.searchDate,
      "color" : +c.colorTypeId
    },
    "geometry": {
      "type": "Point",
      "coordinates": [+c.lng, +c.lat]
    }
  };
  const s = JSON.stringify(pp) + "\n";
  ws.write(s);
  
  
});

const geojson = {
  "type": "FeatureCollection",
  "features": []
};

let str = "";

rl.on('close', () => {

  console.log(tmp);
  
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
      str = str + JSON.stringify(g) + "\n";
        // or
      /*
      const res = JSON.stringify(g) + "\n";
      try {
        fs.appendFileSync("sample.ndjson", res);
      }catch (e) {
        console.log(e);
      }
      */
      
    }
  }

  fs.writeFileSync("_course.geojson", JSON.stringify(geojson));
  fs.writeFileSync("_course.ndjson", str);

});

