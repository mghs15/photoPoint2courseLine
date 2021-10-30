const fs = require("fs");

const json = require("./sample1.json");

json.resultJsondata.forEach( p => {
  let info = "";
  for(name in p){
    info = info + `${name}:${p[name]}, `;
  }
  console.log(info);
});



