# PWA CRUD IndexedDB Mahasiswa

Aplikasi web PWA CRUD dengan IndexedDB untuk mengelola data mahasiswa.

## Fitur

- ✅ CREATE: Menambahkan data mahasiswa baru
- ✅ READ: Menampilkan semua data mahasiswa
- ✅ UPDATE: Mengedit data mahasiswa yang ada
- ✅ DELETE: Menghapus data mahasiswa
- ✅ Pencarian mahasiswa berdasarkan nama
- ✅ Filter berdasarkan umur minimum
- ✅ Notifikasi toast untuk setiap aksi
- ✅ Ilustrasi ketika tidak ada data
- ✅ Animasi loading saat memuat data
- ✅ PWA-ready (dapat diinstal sebagai aplikasi)
- ✅ Bekerja offline setelah kunjungan pertama

## Cara Menjalankan di Lokal

1. Clone repository ini
2. Buka file `index.html` di browser, atau
3. Gunakan live server seperti VS Code Live Server

## Cara Deploy ke GitHub Pages

1. Buat repository baru di GitHub
2. Push kode ini ke repository tersebut
3. Di settings repository, pilih "Pages" di sidebar kiri
4. Di bagian "Source", pilih "Deploy from a branch"
5. Pilih branch `main` dan folder `root`
6. Klik "Save" dan tunggu beberapa saat sampai deployment selesai

## Struktur Project

```
.
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── manifest.json
│   └── service-worker.js
├── index.html
└── README.md
```

## Teknologi yang Digunakan

- HTML5
- CSS3 (dengan animasi dan efek glassmorphism)
- JavaScript ES6+ (dengan IndexedDB API)
- PWA (Progressive Web App)
- Service Worker untuk caching offline
- Manifest file untuk instalasi aplikasi

## Troubleshooting

Jika tampilan tidak muncul dengan benar saat di-hosting:

1. Pastikan semua path di file `index.html` menggunakan relative path (`./`)
2. Periksa console browser untuk error 404 pada file CSS/JS
3. Pastikan file CSS ada di path `./assets/css/style.css`