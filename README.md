# photoPoint2courseLine
写真の位置からコースのラインを復元する

https://mghs15.github.io/photoPoint2courseLine/

(東京付近のみ、中身はサンプルなので注意)

## 基本的な使い方
1. 写真情報の元データをCSVとして格納（`_sample.csv`）
2. CSVの写真情報から、写真位置データ（`_photo.ndjson`）と、コースごとにまとめたデータ（`_course.ndjson`）を作成。
```
node bundleCourseStream.js
```
4. ndjsonをtippecanoeを用いてベクトルタイルへ変換。（各種設定は、jsファイルにハードコード。）
```
node tilingCourseLineAndPhotoPoint.js
```
## メモ
* 整理番号、コース番号、写真番号から復活させる。
* 大体一直線なので、ベクトルタイル化の際に、tippecanoeの`--simplificaiton`がかなり効いてきそう。

## 出典
* 写真のデータ等々：地図・空中写真閲覧サービス
* サンプルサイトの背景地図：地理院地図Vector
