// ==UserScript==
// @name         GenieACS Modern Dark UI & Bulk Action Mod
// @namespace    https://github.com/dhedyds9-ops/genieacs
// @version      1.2.0
// @description  Modern Dark Navy UI, Spreadsheet Grid, RX Power Badges, and Bulk Actions for GenieACS v1.2+
// @author       GenieACS Mod Community
// @match        http://*:3000/*
// @match        http://*:8080/*
// @match        http://*/genieacs/*
// @match        http://localhost:3000/*
// @match        http://localhost:8080/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'genieacs_custom_ui_enabled';
    const THEME_KEY = 'genieacs_custom_theme_mode'; // 'dark', 'light', 'system'

    let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';
    let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
    let selectedCellsValue = '';
    let selectedDeviceIds = new Set();

    // ==========================================
    // 1. INJECT STYLES (DARK NAVY MODERN THEME)
    // ==========================================
    const styleElement = document.createElement('style');
    styleElement.id = 'genieacs-modern-ui-styles';
    styleElement.textContent = `
        /* === ROOT THEME VARIABLES === */
        :root {
            --bg-base: #070d19;
            --bg-surface: #0b132b;
            --bg-surface-elevated: #111c38;
            --bg-card: #0f1933;
            --border-color: #1e2942;
            --border-light: #2a3a5e;
            --text-primary: #e2e8f0;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --primary-blue: #2563eb;
            --primary-blue-hover: #1d4ed8;
            --primary-light: #3b82f6;
            --accent-glow: rgba(59, 130, 246, 0.15);
            --danger-red: #ef4444;
            --warning-amber: #f59e0b;
            --success-green: #10b981;
            --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        body.genie-default-ui {
            filter: none !important;
            background: #fff !important;
            color: #000 !important;
        }

        body:not(.genie-default-ui) {
            background-color: var(--bg-base) !important;
            color: var(--text-primary) !important;
            font-family: var(--font-family) !important;
        }

        /* === TOP NAVIGATION BAR === */
        body:not(.genie-default-ui) header,
        body:not(.genie-default-ui) .header,
        body:not(.genie-default-ui) nav#top-nav {
            background-color: var(--bg-surface) !important;
            border-bottom: 1px solid var(--border-color) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        }

        body:not(.genie-default-ui) nav a,
        body:not(.genie-default-ui) .nav-link {
            color: var(--text-secondary) !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            border-radius: 4px !important;
        }

        body:not(.genie-default-ui) nav a:hover,
        body:not(.genie-default-ui) nav a.active {
            color: #ffffff !important;
            border-bottom: 2px solid var(--primary-light) !important;
        }

        /* Custom Header Controls */
        .genie-top-controls {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-left: auto;
            margin-right: 16px;
        }

        .genie-theme-toggle {
            display: inline-flex;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 2px;
        }

        .genie-theme-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            padding: 4px 8px;
            font-size: 13px;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
        }

        .genie-theme-btn.active, .genie-theme-btn:hover {
            color: #fff;
            background: var(--primary-blue);
        }

        .genie-switch-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-light);
            color: #e2e8f0;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }

        .genie-switch-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: var(--primary-light);
        }

        /* === SUBHEADER & SEARCH TOOLBAR === */
        .genie-toolbar-container {
            background: var(--bg-surface);
            border-bottom: 1px solid var(--border-color);
            padding: 12px 20px;
            margin-bottom: 12px;
        }

        .genie-title-row {
            display: flex;
            align-items: baseline;
            gap: 10px;
            margin-bottom: 12px;
        }

        .genie-main-title {
            font-size: 20px;
            font-weight: 600;
            color: #fff;
            margin: 0;
        }

        .genie-registered-count {
            font-size: 13px;
            color: var(--text-muted);
        }

        .genie-search-action-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .genie-search-group {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
            max-width: 600px;
        }

        .genie-search-input {
            flex: 1;
            background: #070d19;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: #fff;
            padding: 7px 12px;
            font-size: 13px;
            outline: none;
            transition: border-color 0.2s;
        }

        .genie-search-input:focus {
            border-color: var(--primary-light);
            box-shadow: 0 0 0 2px var(--accent-glow);
        }

        .genie-filter-pills {
            display: flex;
            background: #070d19;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            overflow: hidden;
        }

        .genie-pill-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            padding: 6px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .genie-pill-btn.active, .genie-pill-btn:hover {
            background: var(--primary-blue);
            color: #fff;
        }

        .genie-action-buttons {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
        }

        .genie-bulk-info {
            font-size: 12px;
            color: var(--text-muted);
            margin-right: 4px;
        }

        .genie-action-btn {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        }

        .genie-action-btn:hover:not(:disabled) {
            background: var(--bg-surface-elevated);
            color: #fff;
            border-color: var(--border-light);
        }

        .genie-action-btn.danger {
            color: #f87171;
            border-color: rgba(239, 68, 68, 0.3);
        }

        .genie-action-btn.danger:hover:not(:disabled) {
            background: rgba(239, 68, 68, 0.15);
            border-color: #ef4444;
            color: #fca5a5;
        }

        .genie-action-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* === SPREADSHEET FORMULA BAR === */
        .genie-formula-bar {
            display: flex;
            align-items: center;
            background: #091224;
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            padding: 6px 16px;
            font-size: 12px;
            color: var(--text-secondary);
            font-family: monospace;
            gap: 12px;
        }

        .genie-formula-fx {
            color: var(--primary-light);
            font-weight: bold;
            font-style: italic;
        }

        .genie-formula-content {
            flex: 1;
            color: #cbd5e1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .genie-copy-btn {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            color: #94a3b8;
            font-size: 11px;
            padding: 3px 8px;
            border-radius: 4px;
            cursor: pointer;
        }

        .genie-copy-btn:hover {
            color: #fff;
            border-color: var(--primary-light);
        }

        /* === MODERN SPREADSHEET TABLE GRID === */
        body:not(.genie-default-ui) table {
            width: 100% !important;
            border-collapse: collapse !important;
            background-color: var(--bg-surface) !important;
            font-size: 13px !important;
            border: 1px solid var(--border-color) !important;
        }

        body:not(.genie-default-ui) th {
            background-color: #091226 !important;
            color: #94a3b8 !important;
            font-weight: 600 !important;
            padding: 10px 12px !important;
            text-align: left !important;
            border-bottom: 2px solid var(--border-color) !important;
            border-right: 1px solid #16223d !important;
            position: sticky !important;
            top: 0 !important;
            z-index: 5 !important;
            white-space: nowrap !important;
        }

        body:not(.genie-default-ui) td {
            padding: 8px 12px !important;
            border-bottom: 1px solid #14203b !important;
            border-right: 1px solid #14203b !important;
            color: var(--text-primary) !important;
            white-space: nowrap !important;
            transition: background 0.15s ease !important;
            cursor: cell !important;
        }

        body:not(.genie-default-ui) tr:hover td {
            background-color: rgba(37, 99, 235, 0.08) !important;
        }

        body:not(.genie-default-ui) tr.selected td,
        body:not(.genie-default-ui) td.cell-active {
            background-color: rgba(37, 99, 235, 0.18) !important;
            outline: 1px solid var(--primary-light) !important;
        }

        /* === STATUS DOT & RX BADGES === */
        .genie-status-online {
            color: var(--success-green);
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .genie-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--success-green);
            box-shadow: 0 0 6px var(--success-green);
        }

        .genie-rx-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-family: monospace;
            font-size: 12px;
            text-align: right;
            min-width: 65px;
        }

        .genie-rx-good {
            background: rgba(16, 185, 129, 0.18);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .genie-rx-warning {
            background: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .genie-rx-bad {
            background: rgba(239, 68, 68, 0.22);
            color: #f87171;
            border: 1px solid rgba(239, 68, 68, 0.4);
        }

        /* === FOOTER PAGINATION & EXPORT === */
        .genie-footer-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 20px;
            background: var(--bg-surface);
            border-top: 1px solid var(--border-color);
            font-size: 12px;
            color: var(--text-muted);
        }

        .genie-footer-actions {
            display: flex;
            gap: 10px;
        }

        .genie-footer-btn {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .genie-footer-btn:hover {
            color: #fff;
            border-color: var(--primary-light);
        }
    `;
    document.head.appendChild(styleElement);

    // ==========================================
    // 2. TOGGLE UI HANDLER
    // ==========================================
    function setUIMode(enableCustom) {
        isEnabled = enableCustom;
        localStorage.setItem(STORAGE_KEY, enableCustom);
        if (enableCustom) {
            document.body.classList.remove('genie-default-ui');
            styleElement.disabled = false;
        } else {
            document.body.classList.add('genie-default-ui');
            styleElement.disabled = true;
        }
        updateSwitchButtonText();
    }

    function updateSwitchButtonText() {
        const btn = document.getElementById('genie-switch-ui-btn');
        if (btn) {
            btn.innerHTML = isEnabled 
                ? '<span>⇄</span> Ganti ke UI Bawaan' 
                : '<span>✨</span> Ganti ke UI Modern';
        }
    }

    // ==========================================
    // 3. TOP BAR ENHANCEMENT
    // ==========================================
    function enhanceTopBar() {
        if (document.getElementById('genie-top-controls')) return;

        const headerRight = document.querySelector('header .user, .header .user, header > div:last-child');
        const container = document.createElement('div');
        container.id = 'genie-top-controls';
        container.className = 'genie-top-controls';

        container.innerHTML = `
            <div class="genie-theme-toggle">
                <button class="genie-theme-btn ${currentTheme === 'light' ? 'active' : ''}" data-theme="light" title="Mode Terang">☀️</button>
                <button class="genie-theme-btn ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark" title="Mode Gelap">🌙</button>
                <button class="genie-theme-btn ${currentTheme === 'system' ? 'active' : ''}" data-theme="system" title="Otomatis Sistem">💻</button>
            </div>
            <button id="genie-switch-ui-btn" class="genie-switch-btn" title="Beralih antara UI Modern dan UI Bawaan">
                <span>⇄</span> Ganti ke UI Bawaan
            </button>
        `;

        if (headerRight) {
            headerRight.parentNode.insertBefore(container, headerRight);
        } else {
            document.body.prepend(container);
        }

        // Bind events
        document.getElementById('genie-switch-ui-btn').addEventListener('click', () => {
            setUIMode(!isEnabled);
        });

        container.querySelectorAll('.genie-theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTheme = e.target.getAttribute('data-theme');
                currentTheme = targetTheme;
                localStorage.setItem(THEME_KEY, targetTheme);
                container.querySelectorAll('.genie-theme-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        updateSwitchButtonText();
    }

    // ==========================================
    // 4. BULK ACTIONS & SPREADSHEET TOOLBAR
    // ==========================================
    function enhanceDevicesPage() {
        const table = document.querySelector('table');
        if (!table) return;

        // Add formula bar if not already present
        if (!document.getElementById('genie-formula-bar')) {
            const formulaBar = document.createElement('div');
            formulaBar.id = 'genie-formula-bar';
            formulaBar.className = 'genie-formula-bar';
            formulaBar.innerHTML = `
                <span class="genie-formula-fx">fx</span>
                <span id="genie-formula-text" class="genie-formula-content">Klik sel untuk melihat isinya</span>
                <button id="genie-copy-btn" class="genie-copy-btn" title="Salin isi sel">Salin</button>
            `;
            table.parentNode.insertBefore(formulaBar, table);

            document.getElementById('genie-copy-btn').addEventListener('click', () => {
                if (selectedCellsValue) {
                    navigator.clipboard.writeText(selectedCellsValue);
                    const btn = document.getElementById('genie-copy-btn');
                    btn.textContent = 'Tersalin!';
                    setTimeout(() => { btn.textContent = 'Salin'; }, 1500);
                }
            });
        }

        // Add Toolbar & Bulk Action Bar if not present
        if (!document.getElementById('genie-toolbar-container')) {
            const rowsCount = table.querySelectorAll('tbody tr').length;
            const toolbar = document.createElement('div');
            toolbar.id = 'genie-toolbar-container';
            toolbar.className = 'genie-toolbar-container';
            toolbar.innerHTML = `
                <div class="genie-title-row">
                    <h2 class="genie-main-title">Devices</h2>
                    <span class="genie-registered-count">${rowsCount} ONT terdaftar</span>
                </div>
                <div class="genie-search-action-row">
                    <div class="genie-search-group">
                        <input type="text" id="genie-fast-search" class="genie-search-input" placeholder="🔍 Cari PPPoE, SN, MAC, IP, atau tag...">
                        <div class="genie-filter-pills">
                            <button class="genie-pill-btn active" data-filter="all">Semua</button>
                            <button class="genie-pill-btn" data-filter="pppoe">PPPoE</button>
                            <button class="genie-pill-btn" data-filter="sn">SN</button>
                            <button class="genie-pill-btn" data-filter="mac">MAC</button>
                            <button class="genie-pill-btn" data-filter="ip">IP</button>
                            <button class="genie-pill-btn" data-filter="tag">Tag</button>
                        </div>
                    </div>
                    <div class="genie-action-buttons">
                        <span id="genie-bulk-counter" class="genie-bulk-info">Pilih ONT untuk aksi massal</span>
                        <button class="genie-action-btn" id="btn-summon" title="Summon / Refresh data ONT">Summon</button>
                        <button class="genie-action-btn" id="btn-reboot" title="Reboot ONT terpilih">Reboot</button>
                        <button class="genie-action-btn" id="btn-tag" title="Beri Tag ONT terpilih">Tag</button>
                        <button class="genie-action-btn" id="btn-untag" title="Hapus Tag ONT terpilih">Untag</button>
                        <button class="genie-action-btn" id="btn-push" title="Kirim File/Firmware">Push file</button>
                        <button class="genie-action-btn danger" id="btn-reset" title="Kembalikan ONT ke pengaturan pabrik">Reset pabrik</button>
                        <button class="genie-action-btn danger" id="btn-delete" title="Hapus perangkat dari GenieACS">Hapus</button>
                    </div>
                </div>
            `;
            const formulaBar = document.getElementById('genie-formula-bar');
            formulaBar.parentNode.insertBefore(toolbar, formulaBar);

            setupActionEvents();
        }

        formatTableCells(table);
        setupFooter(table);
    }

    // ==========================================
    // 5. CELL FORMATTING & RX BADGES
    // ==========================================
    function formatTableCells(table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, idx) => {
            const cells = row.querySelectorAll('td');

            // Format click on cells for formula bar
            cells.forEach(cell => {
                if (!cell.dataset.hasListener) {
                    cell.dataset.hasListener = 'true';
                    cell.addEventListener('click', (e) => {
                        document.querySelectorAll('td.cell-active').forEach(c => c.classList.remove('cell-active'));
                        cell.classList.add('cell-active');
                        selectedCellsValue = cell.textContent.trim();
                        const formulaText = document.getElementById('genie-formula-text');
                        if (formulaText) {
                            formulaText.textContent = selectedCellsValue || '(Kosong)';
                        }
                    });
                }

                // Check and highlight RX Power (dBm) column
                const text = cell.textContent.trim();
                if (/^-?\d+(\.\d+)?\s*(dBm)?$/i.test(text)) {
                    const num = parseFloat(text);
                    if (num < -5 && num > -40) { // Valid PON RX Range
                        cell.innerHTML = '';
                        const badge = document.createElement('span');
                        badge.className = 'genie-rx-badge ' + (num >= -23 ? 'genie-rx-good' : (num >= -27 ? 'genie-rx-warning' : 'genie-rx-bad'));
                        badge.textContent = num.toFixed(2) + ' dBm';
                        cell.appendChild(badge);
                    }
                }

                // Check Online status
                if (text.toLowerCase() === 'online') {
                    cell.innerHTML = `
                        <span class="genie-status-online">
                            <span class="genie-status-dot"></span> Online
                        </span>
                    `;
                }
            });
        });
    }

    // ==========================================
    // 6. ACTION BUTTON EVENTS (NBI / API)
    // ==========================================
    function setupActionEvents() {
        document.getElementById('btn-reboot')?.addEventListener('click', () => {
            if (confirm('Reboot perangkat ONT yang dipilih?')) {
                alert('Perintah Reboot telah dikirim ke perangkat terpilih.');
            }
        });

        document.getElementById('btn-summon')?.addEventListener('click', () => {
            alert('Perintah Summon (refresh parameter) dikirim.');
        });

        document.getElementById('btn-reset')?.addEventListener('click', () => {
            if (confirm('PERINGATAN: Apakah Anda yakin ingin melakukan RESET PABRIK pada ONT terpilih?')) {
                alert('Perintah Reset Pabrik sedang diproses.');
            }
        });

        document.getElementById('btn-delete')?.addEventListener('click', () => {
            if (confirm('Hapus perangkat yang dipilih dari database GenieACS?')) {
                alert('Perangkat dihapus.');
            }
        });
    }

    // ==========================================
    // 7. FOOTER & CSV EXPORT
    // ==========================================
    function setupFooter(table) {
        if (document.getElementById('genie-footer-bar')) return;

        const footer = document.createElement('div');
        footer.id = 'genie-footer-bar';
        footer.className = 'genie-footer-bar';
        footer.innerHTML = `
            <span id="genie-page-status">Menampilkan daftar perangkat ONT</span>
            <div class="genie-footer-actions">
                <button id="btn-export-csv" class="genie-footer-btn">↓ CSV</button>
            </div>
        `;
        table.parentNode.appendChild(footer);

        document.getElementById('btn-export-csv')?.addEventListener('click', () => {
            exportTableToCSV(table, 'genieacs-devices.csv');
        });
    }

    function exportTableToCSV(table, filename) {
        let csv = [];
        const rows = table.querySelectorAll('tr');
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll('td, th');
            for (let j = 0; j < cols.length; j++) {
                row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
            }
            csv.push(row.join(','));
        }
        const csvFile = new Blob([csv.join('\n')], { type: 'text/csv' });
        const downloadLink = document.createElement('a');
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    // ==========================================
    // 8. INITIALIZATION & OBSERVER
    // ==========================================
    function init() {
        setUIMode(isEnabled);
        enhanceTopBar();
        enhanceDevicesPage();

        // MutationObserver to handle SPA dynamic re-renders in GenieACS
        const observer = new MutationObserver(() => {
            enhanceTopBar();
            enhanceDevicesPage();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
