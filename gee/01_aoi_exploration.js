// ============================================================
// Project: Sangatta Mining Environmental Monitoring
// Script : 01_aoi_exploration.js
// Purpose: Define and inspect the Area of Interest (AOI)
// ============================================================


// ------------------------------------------------------------
// 1. AOI
// ------------------------------------------------------------

var aoiGeometry = aoi.geometry();

Map.centerObject(aoi, 9);

Map.addLayer(
  aoi,
  {color: 'red'},
  'Study Area'
);


// ------------------------------------------------------------
// 2. AOI Information
// ------------------------------------------------------------

var areaHa = aoiGeometry
  .area()
  .divide(1e4);

print('AOI FeatureCollection:', aoi);
print('AOI area (Hectares):', areaHa);