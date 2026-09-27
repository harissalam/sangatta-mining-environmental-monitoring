// ============================================================
// Project: Sangatta Mining Environmental Monitoring
// Script : 01_aoi_exploration.js
// Purpose: Define and inspect the Area of Interest (miningArea)
// Important Note : The mining Area of Interest represents a manually interpreted contemporary mining footprint.
// It does not represent an official ESDM mining concession or cadastral boundary.
// ============================================================


// ------------------------------------------------------------
// 1. miningArea
// ------------------------------------------------------------

var miningAreaGeometry = miningArea.geometry();

Map.centerObject(miningArea, 9);

Map.addLayer(
  miningArea,
  {color: 'red'},
  'Study Area'
);


// ------------------------------------------------------------
// 2. miningArea Information
// ------------------------------------------------------------

var areaHa = miningAreaGeometry
  .area()
  .divide(1e4);

print('miningArea FeatureCollection:', miningArea);
print('miningArea area (Hectares):', areaHa);