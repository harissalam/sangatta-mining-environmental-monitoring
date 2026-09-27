# Sangatta Mining Environmental Monitoring

A multi-temporal remote sensing and GIS project analyzing environmental
change within an interpreted mining area in the Sangatta landscape,
East Kalimantan, Indonesia.

The project uses Landsat imagery from 1990–2026 to investigate
long-term changes in vegetation, exposed surfaces, surface water,
and landscape disturbance.

## Project Objectives

- Analyze environmental change from 1990–2026
- Monitor vegetation conditions using NDVI
- Analyze surface water using NDWI and MNDWI
- Identify exposed and disturbed surfaces using BSI
- Evaluate vegetation disturbance and recovery using NBR
- Generate annual spectral-index time series
- Perform change detection and mining disturbance analysis
- Analyze results using Google Earth Engine, Python, and QGIS

## Area of Interest

The Area of Interest represents the observable mining landscape in
Sangatta.

The boundary was manually digitized through visual interpretation of
Esri World Imagery.

The AOI is used as a fixed analysis boundary throughout the
1990–2026 time-series analysis.

The boundary is an interpreted mining footprint and does not represent
an official mining concession or cadastral boundary.

## Study Period

1990–2026

## Data

Primary satellite datasets:

- Landsat 5 TM
- Landsat 7 ETM+
- Landsat 8 OLI
- Landsat 9 OLI-2

Sentinel-2 may be used as supplementary high-resolution imagery for
recent-condition interpretation.

## Technologies

- Google Earth Engine
- Python
- Pandas
- NumPy
- Matplotlib
- QGIS
- Git
- GitHub

## Analysis Workflow

1. Mining AOI interpretation and digitization
2. Landsat preprocessing
3. Cloud and shadow masking
4. Multi-sensor band standardization
5. Spectral-index calculation
6. Annual 1990–2026 time-series analysis
7. Land-cover analysis
8. Change detection
9. Mining disturbance assessment
10. Python statistical analysis
11. QGIS cartography
12. Portfolio documentation

## Project Status

🚧 In development

Current stage: Annual spectral-index time-series analysis.