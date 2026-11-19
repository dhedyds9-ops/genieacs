# ==============================================================================
# GenieACS Windows Update Script
# Jalankan skrip ini untuk menarik pembaruan terbaru dari GitHub di Windows
# ==============================================================================

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  GenieACS Windows Update & Sync Script     " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Pull latest commits from GitHub
Write-Host "[1/2] Menarik update terbaru dari GitHub..." -ForegroundColor Yellow
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR - Gagal menarik update dari git!" -ForegroundColor Red
    exit 1
}
Write-Host "OK - Berhasil update kode dari GitHub" -ForegroundColor Green
Write-Host ""

# 2. Status message
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  UPDATE SELESAI & BERHASIL!                " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "File tema dan konfigurasi UI modern sudah siap di folder custom-ui/:" -ForegroundColor White
Write-Host "  - custom-ui/genieacs-modern-ui.user.js" -ForegroundColor Cyan
Write-Host "  - custom-ui/index_page_devices.yaml" -ForegroundColor Cyan
Write-Host ""
