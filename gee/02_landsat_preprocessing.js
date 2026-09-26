// ============================================================
// PROJECT
// Sangatta Mining Environmental Monitoring
//
// SCRIPT
// 02_landsat_preprocessing.js
//
// PURPOSE
// Prepare multi-temporal Landsat imagery for long-term
// mining and environmental change analysis.
//
// STUDY PERIOD
// 1990–2026
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
// 2. PREPROCESS LANDSAT 5 / LANDSAT 7
// ------------------------------------------------------------

function preprocessL57(image) {

  // Mask fill, dilated cloud, cloud and cloud shadow
  var qaMask = image
    .select('QA_PIXEL')
    .bitwiseAnd(parseInt('11111', 2))
    .eq(0);

  // Mask radiometrically saturated pixels
  var saturationMask = image
    .select('QA_RADSAT')
    .eq(0);

  // Apply Collection 2 surface reflectance scaling
  var optical = image
    .select([
      'SR_B1',
      'SR_B2',
      'SR_B3',
      'SR_B4',
      'SR_B5',
      'SR_B7'
    ])
    .multiply(0.0000275)
    .add(-0.2)
    .rename([
      'blue',
      'green',
      'red',
      'nir',
      'swir1',
      'swir2'
    ]);

  return optical
    .updateMask(qaMask)
    .updateMask(saturationMask)
    .copyProperties(
      image,
      ['system:time_start']
    );
}

// ------------------------------------------------------------
// 2. PREPROCESS LANDSAT 5 / LANDSAT 7
// ------------------------------------------------------------

function preprocessL57(image) {

  // Mask fill, dilated cloud, cloud and cloud shadow
  var qaMask = image
    .select('QA_PIXEL')
    .bitwiseAnd(parseInt('11111', 2))
    .eq(0);

  // Mask radiometrically saturated pixels
  var saturationMask = image
    .select('QA_RADSAT')
    .eq(0);

  // Apply Collection 2 surface reflectance scaling
  var optical = image
    .select([
      'SR_B1',
      'SR_B2',
      'SR_B3',
      'SR_B4',
      'SR_B5',
      'SR_B7'
    ])
    .multiply(0.0000275)
    .add(-0.2)
    .rename([
      'blue',
      'green',
      'red',
      'nir',
      'swir1',
      'swir2'
    ]);

  return optical
    .updateMask(qaMask)
    .updateMask(saturationMask)
    .copyProperties(
      image,
      ['system:time_start']
    );
}

// ------------------------------------------------------------
// 3. PREPROCESS LANDSAT 8 / LANDSAT 9
// ------------------------------------------------------------

function preprocessL89(image) {

  var qaMask = image
    .select('QA_PIXEL')
    .bitwiseAnd(parseInt('11111', 2))
    .eq(0);

  var saturationMask = image
    .select('QA_RADSAT')
    .eq(0);

  var optical = image
    .select([
      'SR_B2',
      'SR_B3',
      'SR_B4',
      'SR_B5',
      'SR_B6',
      'SR_B7'
    ])
    .multiply(0.0000275)
    .add(-0.2)
    .rename([
      'blue',
      'green',
      'red',
      'nir',
      'swir1',
      'swir2'
    ]);

  return optical
    .updateMask(qaMask)
    .updateMask(saturationMask)
    .copyProperties(
      image,
      ['system:time_start']
    );
}

// ------------------------------------------------------------
// 4. LOAD LANDSAT COLLECTIONS
// ------------------------------------------------------------

var landsat5 = ee.ImageCollection(
  'LANDSAT/LT05/C02/T1_L2'
)
.filterBounds(aoi)
.map(preprocessL57);


var landsat7 = ee.ImageCollection(
  'LANDSAT/LE07/C02/T1_L2'
)
.filterBounds(aoi)
.map(preprocessL57);


var landsat8 = ee.ImageCollection(
  'LANDSAT/LC08/C02/T1_L2'
)
.filterBounds(aoi)
.map(preprocessL89);


var landsat9 = ee.ImageCollection(
  'LANDSAT/LC09/C02/T1_L2'
)
.filterBounds(aoi)
.map(preprocessL89);

// ------------------------------------------------------------
// 5. TEMPORAL PHASES
// ------------------------------------------------------------

// Phase 1 — Pre/Early Mining Baseline
// 1990–1992

var phase1 = landsat5
  .filterDate(
    '1990-01-01',
    '1993-01-01'
  );

// Phase 2 — Early Expansion
// 1995–2000

var phase2L5 = landsat5
  .filterDate(
    '1995-01-01',
    '2001-01-01'
  );

var phase2L7 = landsat7
  .filterDate(
    '1999-01-01',
    '2001-01-01'
  );

var phase2 = phase2L5.merge(
  phase2L7
);
  
// Phase 3 — Expansion
// 2005–2010

var phase3L5 = landsat5
  .filterDate(
    '2005-01-01',
    '2011-01-01'
  );

var phase3L7 = landsat7
  .filterDate(
    '2005-01-01',
    '2011-01-01'
  );

var phase3 = phase3L5.merge(
  phase3L7
);

// Phase 4 — Modern Mining Landscape
// 2015–2020

var phase4 = landsat8
  .filterDate(
    '2015-01-01',
    '2021-01-01'
  );
  
// Phase 5 — Current Condition
// 2022–2026

var phase5L8 = landsat8
  .filterDate(
    '2022-01-01',
    '2027-01-01'
  );

var phase5L9 = landsat9
  .filterDate(
    '2022-01-01',
    '2027-01-01'
  );

var phase5 = phase5L8.merge(
  phase5L9
);

// ------------------------------------------------------------
// 6. COLLECTION INFORMATION
// ------------------------------------------------------------

print(
  'Phase 1 image count:',
  phase1.size()
);

print(
  'Phase 2 image count:',
  phase2.size()
);

print(
  'Phase 3 image count:',
  phase3.size()
);

print(
  'Phase 4 image count:',
  phase4.size()
);

print(
  'Phase 5 image count:',
  phase5.size()
);

// ------------------------------------------------------------
// 7. CREATE MEDIAN COMPOSITES
// ------------------------------------------------------------

var composite1990 = phase1
  .median()
  .clip(aoiGeometry);

var composite2000 = phase2
  .median()
  .clip(aoiGeometry);

var composite2010 = phase3
  .median()
  .clip(aoiGeometry);

var composite2020 = phase4
  .median()
  .clip(aoiGeometry);

var composite2026 = phase5
  .median()
  .clip(aoiGeometry);
  
// ------------------------------------------------------------
// 8. VISUALIZATION OF ALL BAND COMPOSITE
// ------------------------------------------------------------

var trueColorVis = {
  bands: [
    'red',
    'green',
    'blue'
  ],
  min: 0.0,
  max: 0.3
};


Map.addLayer(
  composite1990,
  trueColorVis,
  'Phase 1 - 1990-1992',
  false
);


Map.addLayer(
  composite2000,
  trueColorVis,
  'Phase 2 - 1995-2000',
  false
);


Map.addLayer(
  composite2010,
  trueColorVis,
  'Phase 3 - 2005-2010',
  false
);


Map.addLayer(
  composite2020,
  trueColorVis,
  'Phase 4 - 2015-2020',
  false
);


Map.addLayer(
  composite2026,
  trueColorVis,
  'Phase 5 - 2022-2026',
  true
);