<script>
  import MapView from './lib/MapView.svelte';
  import { DEFAULT_BASEMAP, HAS_MAPID_KEY } from './lib/config.js';

  let basemap = DEFAULT_BASEMAP;
  let suppliersVisible = true;
  let mapView;

  $: status = suppliersVisible
    ? 'Layer supplier aktif. Tile MVT dimuat sesuai area peta.'
    : 'Layer supplier nonaktif. Aktifkan untuk melihat titik supplier.';

  function fitSuppliers() {
    mapView?.fitToSuppliers();
  }

  const options = [
    { id: 'street', label: 'MAPID Street 2D', requiresMapid: true },
    { id: 'light', label: 'MAPID Light', requiresMapid: true },
    { id: 'satellite', label: 'MAPID Satellite', requiresMapid: true },
    { id: 'carto', label: 'CARTO Light' },
    { id: 'demo', label: 'MapLibre Demo (fallback)' }
  ];
</script>

<div class="app">
  <aside>
    <div class="panel-heading">
      <div class="brand-row">
        <p class="kicker">MAPID x BINUS</p>
        <span class="chip">Sarah Fadillah</span>
      </div>
      <h1>SupplyScope GIS</h1>
      <p class="description">Peta distribusi supplier Pantai Gading berbasis MapLibre dan vector tile.</p>
      <div class="metrics" aria-label="Dataset summary">
        <span><strong>50K</strong> supplier points</span>
        <span><strong>MVT</strong> local tiles</span>
      </div>
    </div>

    <div class="panel-section">
      <div class="control-group">
        <label for="basemap">Basemap</label>
        <select id="basemap" bind:value={basemap}>
          {#each options as option}
            <option value={option.id} disabled={option.requiresMapid && !HAS_MAPID_KEY}>
              {option.label}
            </option>
          {/each}
        </select>
      </div>

      <div class="control-group">
        <span class="label-text">Layer data</span>
        <label class="toggle-row" for="supplier-toggle">
          <span>
            <strong>Supplier points</strong>
            <small>Disajikan dari MBTiles lokal</small>
          </span>
          <input id="supplier-toggle" type="checkbox" bind:checked={suppliersVisible} />
        </label>
      </div>

      <button class="action-button" type="button" on:click={fitSuppliers}>Zoom ke area supplier</button>
      <p class:active={suppliersVisible} class="status">{status}</p>
    </div>

    <div class="data-card">
      <span class="data-label">Dataset</span>
      <strong>farm-location-50k.csv</strong>
      <p>50.000 titik supplier di Pantai Gading, dikonversi ke MVT agar peta tetap ringan.</p>
      <p class="credit">Dibuat oleh Sarah Fadillah.</p>
    </div>
  </aside>

  <main class="map-shell">
    <div class="map-header">
      <div>
        <span class="map-eyebrow">Tampilan peta</span>
        <strong>Distribusi supplier Pantai Gading</strong>
      </div>
      <span class:muted={!suppliersVisible} class="map-pill">
        {suppliersVisible ? 'Layer aktif' : 'Layer nonaktif'}
      </span>
    </div>
    <MapView bind:this={mapView} {basemap} {suppliersVisible} />
  </main>
</div>

<style>
  .app {
    display: flex;
    height: 100%;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    background: #edf2ef;
  }

  aside {
    width: 388px;
    min-width: 0;
    flex-shrink: 0;
    padding: 18px;
    background: #e8efeb;
    border-right: 1px solid #cfdcd5;
    box-sizing: border-box;
    color: #17211c;
    overflow-y: auto;
  }

  .panel-heading {
    padding: 22px;
    background: #10251b;
    border: 1px solid #1f3a2c;
    border-radius: 14px;
    color: #f7fbf8;
    box-shadow: 0 18px 38px rgb(16 37 27 / 0.14);
  }

  .brand-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .kicker {
    margin: 0;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #a9bbb1;
  }

  .chip {
    flex: 0 0 auto;
    padding: 5px 8px;
    border: 1px solid rgb(255 255 255 / 0.16);
    border-radius: 999px;
    color: #d9e8df;
    font-size: 11px;
    font-weight: 700;
  }

  h1 {
    margin: 18px 0 0;
    font-size: 34px;
    line-height: 1.08;
    font-weight: 800;
    letter-spacing: 0;
  }

  .description {
    margin: 12px 0 0;
    font-size: 15px;
    line-height: 1.5;
    color: #c9d8d0;
    overflow-wrap: anywhere;
  }

  .metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 18px;
  }

  .metrics span {
    min-height: 62px;
    padding: 10px 12px;
    background: rgb(255 255 255 / 0.08);
    border: 1px solid rgb(255 255 255 / 0.12);
    border-radius: 10px;
    color: #c9d8d0;
    font-size: 12px;
    line-height: 1.35;
  }

  .metrics strong {
    display: block;
    color: #ffffff;
    font-size: 20px;
    line-height: 1.1;
  }

  .panel-section,
  .data-card {
    margin-top: 14px;
    padding: 18px;
    background: #f8faf9;
    border: 1px solid #d3dfd8;
    border-radius: 14px;
    box-shadow: 0 10px 24px rgb(28 44 34 / 0.08);
  }

  .control-group {
    margin-top: 18px;
  }

  .control-group:first-child {
    margin-top: 0;
  }

  label,
  .label-text {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 760;
    color: #26342d;
  }

  select {
    width: 100%;
    min-height: 46px;
    padding: 9px 13px;
    font: inherit;
    background: #fff;
    border: 1px solid #bfccc4;
    border-radius: 10px;
    color: #17211c;
  }

  select:focus-visible {
    outline: 2px solid #2f7bc0;
    outline-offset: 2px;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    width: 100%;
    min-height: 72px;
    margin: 0;
    padding: 14px;
    background: #fff;
    border: 1px solid #bfccc4;
    border-radius: 10px;
    cursor: pointer;
  }

  .toggle-row span {
    display: grid;
    gap: 3px;
    min-width: 0;
  }

  .toggle-row strong {
    font-size: 15px;
    line-height: 1.25;
    color: #17211c;
  }

  .toggle-row small {
    font-size: 12px;
    line-height: 1.35;
    color: #64746b;
  }

  input[type='checkbox'] {
    width: 46px;
    height: 26px;
    flex: 0 0 auto;
    appearance: none;
    position: relative;
    background: #d9e0dc;
    border: 1px solid #b5c0ba;
    border-radius: 999px;
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease;
  }

  input[type='checkbox']::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgb(31 37 32 / 0.25);
    transition: transform 150ms ease;
  }

  input[type='checkbox']:checked {
    background: #10845a;
    border-color: #10845a;
  }

  input[type='checkbox']:checked::after {
    transform: translateX(20px);
  }

  input[type='checkbox']:focus-visible {
    outline: 2px solid #2676c9;
    outline-offset: 2px;
  }

  .action-button {
    width: 100%;
    min-height: 46px;
    margin-top: 14px;
    padding: 10px 14px;
    border: 1px solid #10251b;
    border-radius: 10px;
    background: #10251b;
    color: #ffffff;
    font: inherit;
    font-weight: 760;
    cursor: pointer;
    box-shadow: 0 10px 18px rgb(16 37 27 / 0.16);
  }

  .action-button:hover {
    background: #0f3424;
  }

  .status,
  .data-card p {
    margin: 16px 0 0;
    font-size: 14px;
    line-height: 1.45;
    color: #45554c;
    overflow-wrap: anywhere;
  }

  .status {
    padding: 12px 14px;
    background: #eef2ef;
    border-left: 3px solid #8d9b92;
    border-radius: 8px;
  }

  .status.active {
    background: #e7f4ed;
    border-left-color: #0f7a4f;
    color: #1f553b;
  }

  .data-card {
    color: #4c5f55;
  }

  .data-card strong {
    display: block;
    margin-top: 4px;
    color: #17211c;
    font-size: 15px;
  }

  .credit {
    padding-top: 12px;
    border-top: 1px solid #dde7e1;
    font-weight: 700;
    color: #183f2d;
  }

  .data-label {
    color: #687a70;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .map-shell {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
    min-height: 100vh;
  }

  .map-header {
    position: absolute;
    z-index: 2;
    top: 18px;
    left: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    min-width: 330px;
    padding: 12px 14px;
    background: rgb(248 250 249 / 0.92);
    border: 1px solid rgb(199 211 204 / 0.92);
    border-radius: 12px;
    box-shadow: 0 14px 28px rgb(17 33 25 / 0.14);
    backdrop-filter: blur(10px);
  }

  .map-eyebrow {
    display: block;
    color: #6c7d73;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .map-header strong {
    display: block;
    margin-top: 2px;
    color: #17211c;
    font-size: 15px;
  }

  .map-pill {
    flex: 0 0 auto;
    padding: 6px 9px;
    border-radius: 999px;
    background: #e3f5eb;
    color: #0d6b49;
    font-size: 12px;
    font-weight: 800;
  }

  .map-pill.muted {
    background: #eef1ef;
    color: #687a70;
  }

  @media (max-width: 760px) {
    .app {
      width: 100vw;
      max-width: 100vw;
      min-height: 100vh;
      flex-direction: column;
    }

    aside {
      width: 100%;
      max-width: 100vw;
      border-right: 0;
      border-bottom: 1px solid #d8d4ca;
    }

    .map-shell {
      min-height: 540px;
    }

    .map-header {
      right: 14px;
      left: 14px;
      min-width: 0;
    }

    select,
    .toggle-row {
      max-width: 100%;
    }
  }
</style>
