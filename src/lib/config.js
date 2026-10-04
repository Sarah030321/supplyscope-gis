
const MAPID_KEY = import.meta.env.VITE_MAPID_KEY;
const CARTO_BASEMAP_KEY = import.meta.env.VITE_CARTO_BASEMAP_KEY;
export const HAS_MAPID_KEY = Boolean(MAPID_KEY?.trim());
export const HAS_CARTO_BASEMAP_KEY = Boolean(CARTO_BASEMAP_KEY?.trim());
const CARTO_KEY_QUERY = HAS_CARTO_BASEMAP_KEY ? `?key=${encodeURIComponent(CARTO_BASEMAP_KEY)}` : '';

const cartoLightStyle = {
  version: 8,
  sources: {
    carto: {
      type: 'raster',
      tiles: [`https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png${CARTO_KEY_QUERY}`],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors © CARTO'
    }
  },
  layers: [
    {
      id: 'carto-light',
      type: 'raster',
      source: 'carto'
    }
  ]
};

export const basemaps = {
  street: `https://basemap.mapid.io/styles/street-2d-building/style.json?key=${MAPID_KEY}`,
  light: `https://basemap.mapid.io/styles/light/style.json?key=${MAPID_KEY}`,
  satellite: `https://basemap.mapid.io/styles/satellite/style.json?key=${MAPID_KEY}`,
  carto: cartoLightStyle,
  demo: 'https://demotiles.maplibre.org/style.json'
};

export const DEFAULT_BASEMAP = HAS_MAPID_KEY ? 'street' : 'carto';
export const MVT_TILES = 'http://127.0.0.1:8080/suppliers/{z}/{x}/{y}.mvt';
export const MVT_SOURCE_LAYER = 'suppliers';
export const MAP_CENTER = [-5.55, 6.35];
export const MAP_ZOOM = 7;
export const SUPPLIER_FOCUS_BOUNDS = [
  [-8.25, 4.7],
  [-2.8, 7.9]
];
