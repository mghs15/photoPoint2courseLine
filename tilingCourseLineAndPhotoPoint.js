const child_process = require('child_process');
const fs = require('fs');

//コースライン
(() => {
  const tippCourseLineOption = [
    'tippecanoe',
    '-o', '_course.mbtiles',
    '_course.ndjson',
    '--force', 
    '--no-tile-size-limit', 
    '--no-tile-compression',
    '--no-feature-limit',
    '--minimum-zoom=' + 6,
    '--maximum-zoom=' + 10,
    '--base-zoom=' + 10,
    '--simplification=' + 5,
    '-l', 'courseline'
  ];

  let tippCourseLine = '';
  tippCourseLineOption.forEach( op => {
    tippCourseLine = tippCourseLine + " " + op;
  });
  console.log(tippCourseLine);
  child_process.execSync(`${tippCourseLine}`);
})();

//写真のポイント
(() => {
  const tippPhotoPointOption = [
    'tippecanoe',
    '-o', '_photo.mbtiles',
    '_photo.ndjson',
    '--force', 
    '--no-tile-size-limit', 
    '--no-tile-compression',
    '--no-feature-limit',
    '--minimum-zoom=' + 11,
    '--maximum-zoom=' + 11,
    '--base-zoom=' + 11,
    '--simplification=' + 2,
    '-l', 'single'
  ];

  let tippPhotoPoint = '';
  tippPhotoPointOption.forEach( op => {
    tippPhotoPoint = tippPhotoPoint + " " + op;
  });
  console.log(tippPhotoPoint);
  child_process.execSync(`${tippPhotoPoint}`);
})();

//統合と出力
(() => {
  const tippOption = [
    'tile-join',
    '-e', 'photo',
    '_course.mbtiles', '_photo.mbtiles', 
    '--force', 
    '--no-tile-size-limit', 
    '--no-tile-compression'
  ];

  let tipp = '';
  tippOption.forEach( op => {
    tipp = tipp + " " + op;
  });
  console.log(tipp);
  child_process.execSync(`${tipp}`);
})();


