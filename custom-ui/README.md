# 🌟 GenieACS Modern Dark UI & Spreadsheet Table

Panduan lengkap untuk mengubah tampilan GenieACS v1.2+ menjadi antarmuka modern Dark Navy dengan tabel ala Spreadsheet, status warna redaman RX (dBm), filter cepat, serta tombol aksi massal (*bulk action*).

---

## 📋 Langkah 1: Pengaturan Kolom Tabel (Index Page)

Agar tabel GenieACS menampilkan kolom-kolom seperti di gambar (**No, PPPoE, Status, Serial number, MAC, Produk, WiFi SSID, Klien, RX dBm, IP PPPoE, IP TR-069, Uptime**):

1. Buka Web UI GenieACS Anda (`http://IP-SERVER:3000`).
2. Masuk ke menu **Admin** > **Config**.
3. Cari atau klik opsi **Edit index page** (bagian daftar perangkat / `devices`).
4. Salin isi dari file `custom-ui/index_page_devices.yaml` dan tempelkan ke form editor.
5. Klik **Commit** untuk menyimpan perubahan.

---

## 🚀 Langkah 2: Mengaktifkan Tampilan Modern (Pilih Salah Satu Metode)

### METODE A: Menggunakan Ekstensi Browser (Tampermonkey) - *Paling Cepat & Praktis*
Metode ini sangat disarankan untuk pengujian instan tanpa perlu restart server atau mengubah file Docker:

1. Pasang ekstensi **Tampermonkey** atau **Violentmonkey** di browser Anda (Chrome, Edge, Firefox, Brave).
2. Buka dashboard Tampermonkey > klik tab **Utilities** atau **Create a new script (+)**.
3. Buka file [genieacs-modern-ui.user.js](genieacs-modern-ui.user.js), salin seluruh isinya, lalu tempelkan ke editor Tampermonkey.
4. Pastikan baris `@match` di bagian atas skrip sudah mencakup IP/Domain server GenieACS Anda, contoh:
   ```javascript
   // @match http://192.168.1.100:3000/*
   // @match http://192.168.1.100:8080/*
   ```
5. Simpan skrip (Ctrl + S).
6. Buka kembali web GenieACS Anda, lalu tekan **F5 / Refresh**. Tampilan otomatis akan berubah menjadi modern dark theme!

---

### METODE B: Pemasangan Server-Side (Docker & Nginx)
Jika Anda ingin tampilan ini aktif secara otomatis di semua komputer atau HP tanpa perlu menginstal ekstensi di masing-masing browser:

1. Pastikan port Nginx (`8080`) aktif di `docker-compose.yml`.
2. Salin file script dan style dari folder `custom-ui/` ke direktori web server Nginx.
3. Konfigurasi Nginx untuk menginjeksi script ke halaman GenieACS secara otomatis.

---

## 🎯 Fitur yang Tersedia:
- **⇄ Ganti ke UI Bawaan:** Tombol di pojok kanan atas untuk beralih antara UI Modern dan UI Default bawaan GenieACS kapan saja.
- **Formula Bar (`fx`):** Klik sel mana saja pada tabel untuk melihat teks lengkap dan tombol cepat **Salin**.
- **Indikator Redaman Optik (RX Power):**
  - 🟢 **Hijau (-16 s/d -22 dBm):** Sinyal optik sangat bagus.
  - 🟡 **Kuning/Oranye (-23 s/d -27 dBm):** Sinyal redaman tinggi / peringatan.
  - 🔴 **Merah (< -27 dBm):** Redaman kritis / kabel dropcore bermasalah.
- **Aksi Massal:** Tombol pintas untuk Summon, Reboot, Tag, Untag, Push file, Reset pabrik, dan Hapus.
- **Ekspor CSV:** Tombol `↓ CSV` di bagian bawah untuk mengunduh daftar ONT ke spreadsheet Excel.
