// ============================================================
// PROJECT
// Sangatta Mining Environmental Monitoring
//
// SCRIPT
// 03_spectral_indices.js
//
// PURPOSE
// Calculate spectral indices from preprocessed imagery
// to identify vegetation condition, surface water, bare land, and
// mining-related land disturbance across the study area.
//
// Main indices:
// - NDVI  : Vegetation condition
// - NDWI  : Surface water detection
// - NDBI  : Built-up / exposed surface indication
// - BSI   : Bare soil and disturbed land detection
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
// 8. VISUALIZATION
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

// ------------------------------------------------------------
// 8. SPECTRAL INDICES
// ------------------------------------------------------------

function addSpectralIndices(image) {

  // NDVI - Normalized Difference Vegetation Index
  var ndvi = image
    .normalizedDifference(['nir', 'red'])
    .rename('NDVI');


  // NDWI - Normalized Difference Water Index
  var ndwi = image
    .normalizedDifference(['green', 'nir'])
    .rename('NDWI');


  // MNDWI - Modified Normalized Difference Water Index
  var mndwi = image
    .normalizedDifference(['green', 'swir1'])
    .rename('MNDWI');


  // BSI - Bare Soil Index
  var bsi = image.expression(
    '((SWIR1 + RED) - (NIR + BLUE)) / ' +
    '((SWIR1 + RED) + (NIR + BLUE))',
    {
      'SWIR1': image.select('swir1'),
      'RED': image.select('red'),
      'NIR': image.select('nir'),
      'BLUE': image.select('blue')
    }
  ).rename('BSI');


  // NBR - Normalized Burn Ratio
  var nbr = image
    .normalizedDifference(['nir', 'swir2'])
    .rename('NBR');


  return image.addBands([
    ndvi,
    ndwi,
    mndwi,
    bsi,
    nbr
  ]);
}

// ------------------------------------------------------------
// 9. APPLY SPECTRAL INDICES
// ------------------------------------------------------------

var indices1990 = addSpectralIndices(
  composite1990
);

var indices2000 = addSpectralIndices(
  composite2000
);

var indices2010 = addSpectralIndices(
  composite2010
);

var indices2020 = addSpectralIndices(
  composite2020
);

var indices2026 = addSpectralIndices(
  composite2026
);

print('1990 spectral bands: ', 
indices1990.bandNames()
)

// ------------------------------------------------------------
// 10. NDVI VISUALIZATION
// ------------------------------------------------------------

var ndviVis = {
  min: -0.2,
  max: 0.8,
  palette: [
    'brown',
    'yellow',
    'lightgreen',
    'green',
    'darkgreen'
  ]
};

Map.addLayer(
  indices1990.select('NDVI'),
  ndviVis,
  'NDVI 1990-1992',
  false
);

Map.addLayer(
  indices2000.select('NDVI'),
  ndviVis,
  'NDVI 1995-2000',
  false
);

Map.addLayer(
  indices2010.select('NDVI'),
  ndviVis,
  'NDVI 2005-2010',
  false
);

Map.addLayer(
  indices2020.select('NDVI'),
  ndviVis,
  'NDVI 2015-2020',
  false
);

Map.addLayer(
  indices2026.select('NDVI'),
  ndviVis,
  'NDVI 2022-2026',
  true
);

// ------------------------------------------------------------
// 11. MNDWI VISUALIZATION
// ------------------------------------------------------------

var mndwiVis = {
  min: -0.5,
  max: 0.5,
  palette: [
    'brown',
    'white',
    'lightblue',
    'blue',
    'darkblue'
  ]
};

Map.addLayer(
  indices1990.select('MNDWI'),
  mndwiVis,
  'MNDWI 1990-1992',
  false
);

Map.addLayer(
  indices2026.select('MNDWI'),
  mndwiVis,
  'MNDWI 2022-2026',
  false
);

// ------------------------------------------------------------
// 12. BSI VISUALIZATION
// ------------------------------------------------------------

var bsiVis = {
  min: -0.5,
  max: 0.5,
  palette: [
    'darkgreen',
    'green',
    'yellow',
    'orange',
    'brown'
  ]
};
Map.addLayer(
  indices1990.select('BSI'),
  bsiVis,
  'BSI 1990-1992',
  false
);

Map.addLayer(
  indices2026.select('BSI'),
  bsiVis,
  'BSI 2022-2026',
  false
);

// ------------------------------------------------------------
// 13. NBR VISUALIZATION
// ------------------------------------------------------------

var nbrVis = {
  min: -0.5,
  max: 0.8,
  palette: [
    'brown',
    'yellow',
    'lightgreen',
    'green',
    'darkgreen'
  ]
};
Map.addLayer(
  indices1990.select('NBR'),
  nbrVis,
  'NBR 1990-1992',
  false
);

Map.addLayer(
  indices2026.select('NBR'),
  nbrVis,
  'NBR 2022-2026',
  false
);

// ------------------------------------------------------------
// 14. AOI SUMMARY STATISTICS
// ------------------------------------------------------------

function calculateMeanIndices(image, period) {

  var statistics = image
    .select([
      'NDVI',
      'NDWI',
      'MNDWI',
      'BSI',
      'NBR'
    ])
    .reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: aoiGeometry,
      scale: 30,
      maxPixels: 1e9
    });

  print(
    period + ' Mean Spectral Indices:',
    statistics
  );
}

calculateMeanIndices(
  indices1990,
  '1990-1992'
);

calculateMeanIndices(
  indices2000,
  '1995-2000'
);

calculateMeanIndices(
  indices2010,
  '2005-2010'
);

calculateMeanIndices(
  indices2020,
  '2015-2020'
);

calculateMeanIndices(
  indices2026,
  '2022-2026'
);

// ------------------------------------------------------------
// 15. MAP LEGENDS
// ------------------------------------------------------------

// Main legend panel
var legendPanel = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 12px',
    width: '260px'
  }
});

legendPanel.add(
  ui.Label({
    value: 'Spectral Index Legends',
    style: {
      fontWeight: 'bold',
      fontSize: '16px',
      margin: '0 0 8px 0'
    }
  })
);


// Function to create continuous color bar
function createColorBar(title, visParams) {

  // Index title
  var titleLabel = ui.Label({
    value: title,
    style: {
      fontWeight: 'bold',
      margin: '6px 0 2px 0'
    }
  });

  // Create gradient image
  var longitude = ee.Image
    .pixelLonLat()
    .select('longitude');

  var gradient = longitude
    .multiply(visParams.max - visParams.min)
    .add(visParams.min);

  // Convert gradient into visualization
  var colorBar = ui.Thumbnail({
    image: gradient.visualize(visParams),

    params: {
      bbox: [0, 0, 1, 0.1],
      dimensions: '220x20'
    },

    style: {
      stretch: 'horizontal',
      margin: '0px 8px'
    }
  });


  // Minimum label
  var minLabel = ui.Label({
    value: (visParams.min).toFixed(2),
    style: {
      margin: '2px 8px'
    }
  });


  // Middle value
  var middleValue =
    (visParams.min + visParams.max) / 2;

  var middleLabel = ui.Label({
    value: middleValue.toFixed(2),
    style: {
      textAlign: 'center',
      stretch: 'horizontal',
      margin: '2px 8px'
    }
  });


  // Maximum label
  var maxLabel = ui.Label({
    value: (visParams.max).toFixed(2),
    style: {
      margin: '2px 8px'
    }
  });


  // Arrange values horizontally
  var labels = ui.Panel({
    widgets: [
      minLabel,
      middleLabel,
      maxLabel
    ],

    layout:
      ui.Panel.Layout.flow('horizontal')
  });


// Add everything to main legend
  legendPanel.add(titleLabel);
  legendPanel.add(colorBar);
  legendPanel.add(labels);
}


//Connect the function to the visualization parameters
createColorBar(
  'NDVI — Vegetation',
  ndviVis
);

createColorBar(
  'MNDWI — Surface Water',
  mndwiVis
);

createColorBar(
  'BSI — Bare Surface',
  bsiVis
);

createColorBar(
  'NBR — Vegetation Disturbance',
  nbrVis
);


// Add legend to map
Map.add(legendPanel);