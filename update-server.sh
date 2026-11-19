#!/bin/bash
# ==============================================================================
# GenieACS Server Update Script
# Jalankan skrip ini di server untuk menarik pembaruan terbaru dari GitHub
# ==============================================================================

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}  GenieACS Server Update & Sync Script      ${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# 1. Pull latest commits from GitHub
echo -e "${YELLOW}[1/3] Menarik update terbaru dari GitHub...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Gagal menarik update dari git. Periksa koneksi internet atau konflik file.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Berhasil update kode dari GitHub${NC}"
echo ""

# 2. Reload Docker containers
echo -e "${YELLOW}[2/3] Memperbarui dan mereload container Docker...${NC}"
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --remove-orphans
elif docker compose version &> /dev/null; then
    docker compose up -d --remove-orphans
else
    docker restart genieacs genieacs-nginx 2>/dev/null
fi
echo -e "${GREEN}✓ Container Docker berhasil direload${NC}"
echo ""

# 3. Native install check (if running without Docker)
if [ -d "/usr/lib/node_modules/genieacs/public" ]; then
    echo -e "${YELLOW}Terdeteksi instalasi native GenieACS, memperbarui public asset...${NC}"
    cp -f custom-ui/app.css /usr/lib/node_modules/genieacs/public/app.css
    cp -f custom-ui/app.js /usr/lib/node_modules/genieacs/public/app.js
    systemctl restart genieacs-ui 2>/dev/null || true
    echo -e "${GREEN}✓ File UI native berhasil diperbarui${NC}"
fi

# 4. Permissions
echo -e "${YELLOW}[3/3] Menyesuaikan izin eksekusi skrip...${NC}"
chmod +x *.sh custom-ui/*.sh 2>/dev/null || true
echo -e "${GREEN}✓ Izin eksekusi diperbarui${NC}"
echo ""

echo -e "${CYAN}============================================${NC}"
echo -e "${GREEN}  UPDATE SERVER SELESAI & BERHASIL!         ${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo -e "${NC}Mode Gelap & UI Modern sudah OTOMATIS AKTIF di server!${NC}"
echo -e "${CYAN}  • URL Akses: http://IP-SERVER:3000 atau http://IP-SERVER:8080${NC}"
echo ""
echo -e "${YELLOW}Untuk memunculkan kolom tabel lengkap (PPPoE, RX dBm, Klien, dll):${NC}"
echo -e "1. Buka GenieACS UI -> Masuk ke menu: Admin -> Config"
echo -e "2. Klik 'Edit index page' (bagian devices)"
echo -e "3. Salin isi file: custom-ui/index_page_devices.yaml lalu klik Commit"
echo -e "4. Tekan Ctrl+F5 di browser Anda. Selesai!"
echo ""
