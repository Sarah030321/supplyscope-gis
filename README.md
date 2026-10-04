# SupplyScope GIS

SupplyScope GIS adalah aplikasi WebGIS sederhana untuk menampilkan titik supplier di Pantai Gading. Aplikasi ini mengikuti alur mini certification: basemap MapLibre/MAPID, layer supplier berbasis MVT, popup atribut, dan toggle on/off layer.

Dibuat oleh Sarah Fadillah.

## Stack

- Svelte + Vite
- MapLibre GL JS
- Python tile server
- MBTiles vector tile: `data_mvt/suppliers.mbtiles`

## Menjalankan Aplikasi

Salin contoh environment:

```bash
cp .env.example .env
```

Isi key yang diperlukan:

```bash
VITE_MAPID_KEY=
VITE_CARTO_BASEMAP_KEY=
```

Jalankan tile server di terminal pertama:

```bash
python3 tiles/server.py
```

Jalankan aplikasi di terminal kedua:

```bash
npm install
npm run dev
```

Buka URL lokal dari Vite, biasanya:

```text
http://127.0.0.1:5173/
```

## Verifikasi

- Pilih basemap MAPID atau CARTO.
- Pastikan layer `Supplier points` aktif.
- Klik `Zoom ke area supplier`.
- Klik salah satu titik untuk melihat popup atribut.
- Di DevTools Network, request `.mvt` akan muncul dari `127.0.0.1:8080`.
