# 🚀 GenieACS Multi-Vendor Complete (Docker Edition)

Solusi lengkap **GenieACS (TR-069 Auto Configuration Server)** dengan dukungan otomatis multi-vendor modem/ONT, dashboard terintegrasi multi-tab, kustomisasi logo, dan skrip instalasi siap pakai untuk **Windows** dan **Linux (Ubuntu/Debian)**.

---

## ✨ Fitur Utama

- **Dukungan Multi-Vendor Otomatis**: Huawei, FiberHome, ZTE, CData, GGCLink, VSOL, MikroTik, dan vendor lainnya.
- **Dashboard Multi-Tab Terintegrasi**: Akses web dashboard, CWMP, NBI, dan GenieACS UI langsung dalam satu antarmuka terpadu.
- **Otomatisasi Database (Mongorestore)**: Konfigurasi preset, provisions, dan virtual parameters langsung terpasang saat instalasi.
- **Kustomisasi Brand/Logo**: Mudah mengganti logo dashboard dan logo web UI GenieACS.
- **Dukungan Container Docker**: Seluruh layanan (MongoDB, GenieACS, Nginx) terisolasi dan stabil.

---

## 🌐 Alamat Port & Akun Akses Default

Setelah instalasi selesai, layanan dapat diakses melalui browser:

| Layanan | URL Akses | Keterangan |
| :--- | :--- | :--- |
| **Dashboard Multi-Tab** | `http://localhost:8080` | Halaman portal utama & multi-tab |
| **GenieACS Web UI** | `http://localhost:3000` | Antarmuka manajemen perangkat |
| **CWMP (TR-069 Inform)**| `http://localhost:7547` | URL untuk dimasukkan ke modem/ONT |
| **NBI (REST API)** | `http://localhost:7557` | API untuk integrasi sistem/billing |
| **File Server** | `http://localhost:7567` | Server penyimpanan firmware/konfigurasi |

### Akun Login Default Web UI:
- **Username**: `admin`
- **Password**: `admin`
*(Atau akun Superadmin dari database: `dsbilling` / `ds271015`)*

---

## 💻 Panduan Instalasi di Windows

### 1. Prasyarat: Pasang Docker Desktop
1. Download installer **Docker Desktop for Windows**: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Jalankan file instalasi dan pastikan opsi **"Use WSL 2 instead of Hyper-V"** tercentang.
3. Setelah instalasi selesai, lakukan restart komputer jika diminta.
4. Buka aplikasi **Docker Desktop** dari Start Menu dan tunggu hingga status di pojok kiri bawah berwarna hijau (**Running**).

### 2. Jalankan Instalasi
1. Buka **PowerShell sebagai Administrator**:
   - Klik menu **Start** > ketik `PowerShell`.
   - Klik kanan pada **Windows PowerShell** > pilih **"Run as administrator"**.
2. Masuk ke direktori proyek ini:
   ```powershell
   cd D:\genieacs
   ```
3. Jalankan skrip instalasi:
   ```powershell
   .\install.ps1
   ```
4. Skrip akan mendownload image Docker, menjalankan container, dan melakukan restore database konfigurasi secara otomatis.

---

## 🐧 Panduan Instalasi di Linux / VPS (Ubuntu / Debian)

### 1. Pasang Docker & Docker Compose
Buka terminal SSH server Anda, lalu jalankan perintah berikut:
```bash
# Update repository
sudo apt update && sudo apt upgrade -y

# Pasang Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Pasang Docker Compose Plugin
sudo apt install -y docker-compose-plugin git
```

### 2. Clone Repositori & Jalankan Instalasi
```bash
# Clone proyek dari GitHub
cd ~
git clone https://github.com/dhedyds9-ops/genieacs.git
cd genieacs

# Berikan izin eksekusi skrip
chmod +x *.sh

# Jalankan instalasi otomatis
./install.sh
```

---

## 📡 Konfigurasi TR-069 pada Modem / ONT / CPE

Agar modem pelanggan dapat terhubung otomatis ke GenieACS:
1. Buka browser dan login ke web admin modem/ONT (misal: `192.168.1.1`).
2. Masuk ke menu **Network** > **TR-069** / **CWMP**.
3. Atur parameter berikut:
   - **Enable TR-069**: Centang / Enable
   - **ACS URL**: `http://IP-SERVER-GENIEACS:7547/` *(Ganti dengan IP server/komputer Anda)*
   - **Periodic Inform Enable**: Enable
   - **Periodic Inform Interval**: `300` (atau sesuai kebutuhan, misal 60-300 detik)
   - **ACS Username & Password**: Dikosongkan (kecuali jika Anda mengaktifkan autentikasi CWMP)
4. Klik **Apply / Save**. Modem akan langsung muncul di tab **Devices** pada GenieACS UI.

---

## 🛠️ Manajemen & Perintah Operasional

Semua perintah dijalankan di dalam folder `genieacs`:

- **Mengecek Status Container**:
  ```bash
  docker ps
  ```
- **Mematikan Layanan**:
  ```bash
  docker compose down
  ```
- **Menyalakan Kembali Layanan**:
  ```bash
  docker compose up -d
  ```
- **Restore Ulang Konfigurasi Multi-Vendor Secara Manual**:
  - Di Windows: `.\restore-config.ps1`
  - Di Linux: `./restore-config.sh`
- **Melihat Log GenieACS (Troubleshooting)**:
  ```bash
  docker logs -f genieacs
  ```

---

## 🎨 Mengganti Logo Kustom

1. Siapkan file logo Anda dalam format `.svg` atau `.png`.
2. Simpan file logo ke dalam folder `logos/` dengan nama `logo.svg` atau `logo.png`.
3. Restart layanan Nginx untuk memperbarui tampilan:
   ```bash
   docker restart genieacs-nginx
   ```

---

## 📋 Daftar Vendor yang Didukung

- **Huawei Technologies Co., Ltd**
- **FiberHome**
- **ZTE**
- **CData** (CTCOM, MONU)
- **GGCLink** (XCU, XCMCC)
- **VSOL**
- **MikroTik**
- **ALCL / TDTC / ZIONCOM** dan modem berbasis TR-069 lainnya.
