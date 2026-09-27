# Methodology

## Area of Interest

The mining Area of Interest was manually digitized through visual
interpretation of Esri World Imagery.

The objective was to delineate the visually identifiable mining
landscape rather than reproduce a legal mining concession boundary.

The resulting polygon is used as a fixed Area of Interest for
multi-temporal satellite analysis from 1990–2026.

This approach allows the project to evaluate how land contained within
the contemporary mining footprint changed through time.

The AOI may include identifiable mining-related features such as:

- Open pits
- Exposed mine surfaces
- Waste or overburden areas
- Mine-related water bodies
- Major haul roads
- Mining infrastructure
- Reclamation areas

The resulting boundary is an interpreted mining footprint and does
not represent an official concession, permit, or cadastral boundary.

## Satellite Data

The analysis uses Landsat Collection 2 Level-2 Surface Reflectance
imagery.

Satellite generations used include:

- Landsat 5 TM
- Landsat 7 ETM+
- Landsat 8 OLI
- Landsat 9 OLI-2

All Landsat datasets are standardized to common spectral band names:

- Blue
- Green
- Red
- NIR
- SWIR1
- SWIR2

## Preprocessing

Satellite preprocessing includes:

- Spatial filtering using the mining AOI
- Cloud masking
- Cloud-shadow masking
- Saturated-pixel masking
- Surface-reflectance scaling
- Band-name standardization
- Annual median compositing

## Spectral Indices

The following indices are calculated:

### NDVI
Vegetation condition and density.

### NDWI
Water-related spectral response.

### MNDWI
Enhanced identification of open-water features.

### BSI
Bare and exposed surface conditions.

### NBR
Vegetation disturbance and recovery signal.

## Time-Series Analysis

Annual Landsat composites are generated for each year from 1990–2026.

Mean spectral-index values are calculated within the fixed mining AOI
to produce a long-term environmental time series.

The exported annual statistics are subsequently analyzed using Python.