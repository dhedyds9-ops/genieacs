# 🚀 GenieACS Multi-Vendor Complete Guide & Installation

Solusi lengkap **GenieACS (TR-069 Auto Configuration Server)** dengan dukungan multi-vendor modem/ONT (ZTE, Huawei, FiberHome, CData, VSOL, Mikrotik, dll.), terintegrasi dashboard, kustomisasi logo, dan panduan instalasi lengkap untuk **Ubuntu Linux** dan **Windows**.

---

## 📌 Informasi Login & Port Akses Default

Setelah instalasi selesai, layanan dapat diakses melalui browser:

| Layanan | URL Akses | Keterangan |
| :--- | :--- | :--- |
| **GenieACS Web UI** | `http://IP-SERVER:3000` | Tampilan admin & manajemen perangkat |
| **Dashboard Multi-Tab** | `http://IP-SERVER:8080` | Portal dashboard terpadu (khusus Docker) |
| **CWMP (TR-069 Inform)**| `http://IP-SERVER:7547` | URL ACS untuk disetting di Modem/ONT |
| **NBI (REST API)** | `http://IP-SERVER:7557` | API untuk integrasi sistem/billing |
| **File Server (FS)** | `http://IP-SERVER:7567` | Server firmware & file download |

### 🔑 Kredensial Login Default:
* **Username**: `dsbilling` *(Superadmin)* atau `admin`
* **Password**: `ds271015` (untuk dsbilling) atau `admin` (untuk admin)

---

## 🐧 PANDUAN INSTALASI DI UBUNTU LINUX

Tersedia 2 metode instalasi. **Metode 1 (Docker)** sangat disarankan karena paling cepat dan konfigurasi multi-vendor otomatis terpasang.

---

### METODE 1: Menggunakan Docker (Rekomendasi - Cepat & Praktis)

Cocok untuk server baru maupun yang sudah berjalan.

#### 1. Persiapan Server & Install Docker
Jalankan di terminal server Ubuntu Anda:
```bash
# Update paket sistem
sudo apt update && sudo apt upgrade -y

# Install dependensi (curl & git)
sudo apt install -y curl git

# Install Docker otomatis
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Pasang Docker Compose Plugin
sudo apt install -y docker-compose-plugin
```

#### 2. Clone Repositori Ini
```bash
cd ~
git clone https://github.com/dhedyds9-ops/genieacs.git
cd genieacs
```

#### 3. Jalankan Skrip Instalasi Otomatis
```bash
# Berikan izin eksekusi
chmod +x *.sh

# Jalankan instalasi
./install.sh
```

#### 4. Restore Database Multi-Vendor (Jika Diperlukan)
Jika saat instalasi restore database gagal atau ingin me-restore ulang:
```bash
# Hapus file non-database di container
docker exec genieacs-mongodb rm -f "/tmp/genieacs-db/multitab device.txt" /tmp/genieacs-db/prelude.json

# Restore data konfigurasi multi-vendor
docker exec genieacs-mongodb mongorestore --noIndexRestore --db genieacs --drop /tmp/genieacs-db

# Aktifkan kredensial default
docker exec genieacs-mongodb mongo genieacs --eval '
  db.users.deleteOne({_id: "alijayanet"});
  db.users.updateOne({_id: "dsbilling"}, {$set: {roles: "admin"}});
  db.users.updateOne({_id: "admin"}, {$set: {roles: "admin"}});
'

# Restart GenieACS
docker restart genieacs
```

---

### METODE 2: Instalasi Native di Ubuntu (Tanpa Docker / Node.js & Systemd)

Gunakan metode ini jika server memiliki spesifikasi RAM sangat terbatas dan ingin menjalankan GenieACS murni sebagai service OS:

#### 1. Pasang Node.js LTS
```bash
sudo apt update
sudo apt install -y curl gnupg
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 2. Pasang MongoDB
```bash
sudo apt install -y mongodb
sudo systemctl enable --now mongodb
```

#### 3. Pasang GenieACS via NPM
```bash
sudo npm install -g genieacs@1.2.9
```

#### 4. Buat User & Konfigurasi Environment
```bash
sudo useradd --system --no-create-home --user-group genieacs
sudo mkdir -p /opt/genieacs /opt/genieacs/ext /var/log/genieacs
sudo chown -R genieacs:genieacs /opt/genieacs /var/log/genieacs
```

Buat file environment:
```bash
sudo nano /opt/genieacs/genieacs.env
```
Isi dengan:
```ini
GENIEACS_MONGODB_CONNECTION_URL=mongodb://127.0.0.1/genieacs
GENIEACS_CWMP_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-cwmp-access.log
GENIEACS_NBI_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-nbi-access.log
GENIEACS_FS_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-fs-access.log
GENIEACS_UI_ACCESS_LOG_FILE=/var/log/genieacs/genieacs-ui-access.log
GENIEACS_UI_JWT_SECRET=kunci-rahasia-acak-anda
```

#### 5. Buat Systemd Service
Buat service untuk ke-4 komponen GenieACS:

* **CWMP Service** (`sudo nano /etc/systemd/system/genieacs-cwmp.service`):
```ini
[Unit]
Description=GenieACS CWMP
After=network.target

[Service]
User=genieacs
EnvironmentFile=/opt/genieacs/genieacs.env
ExecStart=/usr/bin/genieacs-cwmp
Restart=always

[Install]
WantedBy=multi-user.target
```

* **NBI Service** (`sudo nano /etc/systemd/system/genieacs-nbi.service`):
```ini
[Unit]
Description=GenieACS NBI
After=network.target

[Service]
User=genieacs
EnvironmentFile=/opt/genieacs/genieacs.env
ExecStart=/usr/bin/genieacs-nbi
Restart=always

[Install]
WantedBy=multi-user.target
```

* **FS Service** (`sudo nano /etc/systemd/system/genieacs-fs.service`):
```ini
[Unit]
Description=GenieACS FS
After=network.target

[Service]
User=genieacs
EnvironmentFile=/opt/genieacs/genieacs.env
ExecStart=/usr/bin/genieacs-fs
Restart=always

[Install]
WantedBy=multi-user.target
```

* **UI Service** (`sudo nano /etc/systemd/system/genieacs-ui.service`):
```ini
[Unit]
Description=GenieACS UI
After=network.target

[Service]
User=genieacs
EnvironmentFile=/opt/genieacs/genieacs.env
ExecStart=/usr/bin/genieacs-ui
Restart=always

[Install]
WantedBy=multi-user.target
```

Aktifkan semua service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now genieacs-cwmp genieacs-nbi genieacs-fs genieacs-ui
```

---

## 💻 PANDUAN INSTALASI DI WINDOWS

1. Download dan pasang **[Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)**. Pastikan opsi WSL 2 tercentang.
2. Buka **PowerShell sebagai Administrator** (Klik kanan > *Run as Administrator*).
3. Masuk ke folder project:
   ```powershell
   cd D:\genieacs
   ```
4. Jalankan script instalasi:
   ```powershell
   .\install.ps1
   ```

---

## 📡 PANDUAN SETTING MODEM / ONT (TR-069)

Agar modem pelanggan (ZTE, Huawei, Fiberhome, VSOL, dll.) muncul di GenieACS:

1. Buka browser dan login ke web modem (misal `192.168.1.1`).
2. Masuk ke menu **Network** / **Management** > **TR-069** / **CWMP**.
3. Atur parameter:
   * **TR-069 Client**: Enable
   * **ACS URL**: `http://IP-SERVER-GENIEACS:7547/`
   * **Periodic Inform**: Enable
   * **Inform Interval**: `300` detik (atau 60–300 detik)
   * **ACS Username & Password**: Kosongkan (default)
4. Klik **Apply / Save**. Perangkat akan otomatis terdeteksi di tab **Devices** pada GenieACS UI.

---

## ⚙️ PERINTAH OPERASIONAL PENTING (DOCKER)

Semua perintah dijalankan di dalam folder `genieacs`:
* **Cek status container**: `docker ps`
* **Stop GenieACS**: `docker compose down`
* **Start GenieACS**: `docker compose up -d`
* **Lihat log error**: `docker logs -f genieacs`
* **Restart service**: `docker compose restart`
