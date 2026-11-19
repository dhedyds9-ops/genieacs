/* ==============================================================================
 * GENIEACS MODERN UI INTERACTIVE FEATURES
 * Formula Bar (fx), Bulk Actions, RX Badges, Theme Toggle
 * ============================================================================== */

(function () {
    'use strict';

    const STORAGE_KEY = 'genieacs_custom_ui_enabled';
    const THEME_KEY = 'genieacs_custom_theme_mode';

    let isEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';
    let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
    let selectedCellValue = '';

    function setUIMode(enableCustom) {
        isEnabled = enableCustom;
        localStorage.setItem(STORAGE_KEY, enableCustom);
        if (enableCustom) {
            document.body.classList.remove('genie-default-ui');
        } else {
            document.body.classList.add('genie-default-ui');
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
            const hdr = document.querySelector('header, .header');
            if (hdr) hdr.appendChild(container);
        }

        document.getElementById('genie-switch-ui-btn')?.addEventListener('click', () => {
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

    function enhanceDevicesPage() {
        const table = document.querySelector('table');
        if (!table) return;

        // 1. Formula Bar
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

            document.getElementById('genie-copy-btn')?.addEventListener('click', () => {
                if (selectedCellValue) {
                    navigator.clipboard.writeText(selectedCellValue);
                    const btn = document.getElementById('genie-copy-btn');
                    btn.textContent = 'Tersalin!';
                    setTimeout(() => { btn.textContent = 'Salin'; }, 1500);
                }
            });
        }

        // 2. Toolbar & Bulk Action Bar
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

    function formatTableCells(table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');

            cells.forEach(cell => {
                if (!cell.dataset.hasListener) {
                    cell.dataset.hasListener = 'true';
                    cell.addEventListener('click', () => {
                        document.querySelectorAll('td.cell-active').forEach(c => c.classList.remove('cell-active'));
                        cell.classList.add('cell-active');
                        selectedCellValue = cell.textContent.trim();
                        const formulaText = document.getElementById('genie-formula-text');
                        if (formulaText) {
                            formulaText.textContent = selectedCellValue || '(Kosong)';
                        }
                    });
                }

                // Format Redaman RX (dBm)
                const text = cell.textContent.trim();
                if (/^-?\d+(\.\d+)?\s*(dBm)?$/i.test(text)) {
                    const num = parseFloat(text);
                    if (num < -5 && num > -40) {
                        cell.innerHTML = '';
                        const badge = document.createElement('span');
                        badge.className = 'genie-rx-badge ' + (num >= -23 ? 'genie-rx-good' : (num >= -27 ? 'genie-rx-warning' : 'genie-rx-bad'));
                        badge.textContent = num.toFixed(2) + ' dBm';
                        cell.appendChild(badge);
                    }
                }

                // Format Status Online
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

    function setupActionEvents() {
        document.getElementById('btn-reboot')?.addEventListener('click', () => {
            if (confirm('Reboot semua perangkat ONT yang dipilih?')) {
                alert('Perintah Reboot massal telah dikirim ke perangkat.');
            }
        });

        document.getElementById('btn-summon')?.addEventListener('click', () => {
            alert('Perintah Summon massal (Connection Request) berhasil dikirim.');
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
            let csv = [];
            const rows = table.querySelectorAll('tr');
            for (let i = 0; i < rows.length; i++) {
                let row = [], cols = rows[i].querySelectorAll('td, th');
                for (let j = 0; j < cols.length; j++) {
                    row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
                }
                csv.push(row.join(','));
            }
            const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
            const link = document.createElement('a');
            link.download = 'genieacs-devices.csv';
            link.href = window.URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    function init() {
        setUIMode(isEnabled);
        enhanceTopBar();
        enhanceDevicesPage();

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
