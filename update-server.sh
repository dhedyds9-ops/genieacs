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

# 3. Permissions
echo -e "${YELLOW}[3/3] Menyesuaikan izin eksekusi skrip...${NC}"
chmod +x *.sh custom-ui/*.sh 2>/dev/null || true
echo -e "${GREEN}✓ Izin eksekusi diperbarui${NC}"
echo ""

echo -e "${CYAN}============================================${NC}"
echo -e "${GREEN}  UPDATE SERVER SELESAI & BERHASIL!         ${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo -e "${NC}File tema dan konfigurasi UI modern sudah siap:${NC}"
echo -e "${CYAN}  • custom-ui/genieacs-modern-ui.user.js${NC}"
echo -e "${CYAN}  • custom-ui/index_page_devices.yaml${NC}"
echo ""
echo -e "${YELLOW}Cara menerapkan tampilan:${NC}"
echo -e "1. Buka GenieACS UI (port 3000) -> Admin -> Config -> Edit index page"
echo -e "2. Salin isi file: custom-ui/index_page_devices.yaml lalu klik Commit"
echo -e "3. Pasang Tampermonkey di browser dan instal script dari:"
echo -e "   http://IP-SERVER:8080/custom-ui/genieacs-modern-ui.user.js"
echo ""
