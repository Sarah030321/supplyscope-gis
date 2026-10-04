<script>
  import { onMount, onDestroy } from 'svelte';
  import * as maplibregl from 'maplibre-gl';
  import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
  import {
    basemaps,
    MVT_TILES,
    MVT_SOURCE_LAYER,
    MAP_CENTER,
    MAP_ZOOM,
    SUPPLIER_FOCUS_BOUNDS
  } from './config.js';

  export let basemap = 'street';
  export let suppliersVisible = false;

  let container;
  let map;
  let appliedBasemap = basemap;
  let popup;
  let appliedSupplierVisibility = suppliersVisible;
  let hasFittedSuppliers = false;

  const SOURCE_ID = 'suppliers';
  const LAYER_ID = 'suppliers-circles';

  maplibregl.setWorkerUrl(maplibreWorkerUrl);

  const circlePaint = {
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 2.5, 9, 4.5, 13, 7.5],
    'circle-color': '#18b783',
    'circle-opacity': 0.9,
    'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 5, 0.8, 12, 1.4],
    'circle-stroke-color': '#f7fffb'
  };

  function escapeHtml(value) {
    return String(value ?? '—')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  function onSupplierClick(event) {
    const props = event.features?.[0]?.properties;
    if (!props) return;
    const area = props.plotareaha ?? '-';
    popup
      .setLngLat(event.lngLat)
      .setHTML(renderPopup(props, area))
      .addTo(map);
  }

  function renderPopup(props, area) {
    return `
      <section class="supplier-popup">
        <p class="supplier-popup__eyebrow">Atribut supplier</p>
        <h2>${escapeHtml(props.entityname)}</h2>
        <dl>
          <div>
            <dt>Negara</dt>
            <dd>${escapeHtml(props.countryname)}</dd>
          </div>
          <div>
            <dt>FID</dt>
            <dd>${escapeHtml(props.FID)}</dd>
          </div>
          <div>
            <dt>Luas plot</dt>
            <dd>${escapeHtml(area)} ha</dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>${escapeHtml(props.regionlabel)}</dd>
          </div>
        </dl>
      </section>
    `;
  }

  function onPointer() {
    map.getCanvas().style.cursor = 'pointer';
  }

  function onPointerOut() {
    map.getCanvas().style.cursor = '';
  }

  function unbindClicks() {
    if (!map?.getLayer(LAYER_ID)) return;
    map.off('click', LAYER_ID, onSupplierClick);
    map.off('mouseenter', LAYER_ID, onPointer);
    map.off('mouseleave', LAYER_ID, onPointerOut);
  }

  function clearSupplierLayer() {
    if (!map.getStyle()) return;
    if (map.getLayer(LAYER_ID)) {
      unbindClicks();
      map.removeLayer(LAYER_ID);
    }
    if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
  }

  function bindClicks() {
    map.on('click', LAYER_ID, onSupplierClick);
    map.on('mouseenter', LAYER_ID, onPointer);
    map.on('mouseleave', LAYER_ID, onPointerOut);
  }

  function fitToSuppliers() {
    if (!map) return;
    map.fitBounds(SUPPLIER_FOCUS_BOUNDS, {
      padding: { top: 58, right: 58, bottom: 58, left: 58 },
      duration: 700,
      maxZoom: 8.5
    });
  }

  export { fitToSuppliers };

  function scheduleLayerSync() {
    if (!map) return;
    if (!map.getStyle()) {
      map.once('style.load', syncSupplierLayer);
      return;
    }
    syncSupplierLayer();
  }

  function syncSupplierLayer() {
    if (!map || !map.getStyle()) return;
    popup?.remove();

    if (!suppliersVisible) {
      clearSupplierLayer();
      return;
    }

    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: 'vector',
        tiles: [MVT_TILES],
        minzoom: 0,
        maxzoom: 14
      });
    }

    if (!map.getLayer(LAYER_ID)) {
      map.addLayer({
        id: LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        'source-layer': MVT_SOURCE_LAYER,
        paint: circlePaint
      });
      bindClicks();
    }

    if (!hasFittedSuppliers) {
      hasFittedSuppliers = true;
      fitToSuppliers();
    }
  }

  onMount(() => {
    popup = new maplibregl.Popup({ closeButton: true, closeOnClick: true });
    map = new maplibregl.Map({
      container,
      style: basemaps[basemap],
      center: MAP_CENTER,
      zoom: MAP_ZOOM
    });
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.on('load', scheduleLayerSync);
    map.on('style.load', scheduleLayerSync);
  });

  $: if (map && basemap !== appliedBasemap) {
    appliedBasemap = basemap;
    popup?.remove();
    map.setStyle(basemaps[basemap], { diff: false });
  }

  $: if (map && suppliersVisible !== appliedSupplierVisibility) {
    appliedSupplierVisibility = suppliersVisible;
    scheduleLayerSync();
  }

  onDestroy(() => {
    popup?.remove();
    map?.remove();
  });
</script>

<div class="map" bind:this={container}></div>

<style>
  .map {
    flex: 1;
    width: 100%;
    min-width: 0;
    height: 100%;
    min-height: 400px;
    background: #dbeaf0;
  }

  :global(.maplibregl-popup-content) {
    min-width: 280px;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 18px 38px rgb(17 31 24 / 0.22);
  }

  :global(.maplibregl-popup-close-button) {
    width: 28px;
    height: 28px;
    color: #5b6b62;
    font-size: 20px;
    line-height: 28px;
  }

  :global(.supplier-popup) {
    padding: 16px 18px 18px;
    color: #17211c;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  :global(.supplier-popup__eyebrow) {
    margin: 0 0 5px;
    color: #10845a;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  :global(.supplier-popup h2) {
    margin: 0;
    max-width: 260px;
    color: #17211c;
    font-size: 17px;
    line-height: 1.3;
    font-weight: 700;
  }

  :global(.supplier-popup dl) {
    display: grid;
    gap: 8px;
    margin: 14px 0 0;
  }

  :global(.supplier-popup dl div) {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 8px;
    border-top: 1px solid #e3e9e5;
  }

  :global(.supplier-popup dt) {
    color: #64746b;
    font-size: 12px;
    font-weight: 600;
  }

  :global(.supplier-popup dd) {
    margin: 0;
    max-width: 165px;
    color: #17211c;
    font-size: 12px;
    font-weight: 650;
    text-align: right;
    overflow-wrap: anywhere;
  }

  @media (max-width: 760px) {
    .map {
      min-height: 520px;
    }
  }
</style>
