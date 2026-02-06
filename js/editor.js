/**
 * KI-AKADEMIE - Instructor Content Editor
 * Provides Markdown file editing, file management, site settings, and password change
 */

(function () {
    const API_BASE = 'api/editor.php';
    let currentPassword = '';
    let currentFile = null;
    let fileList = [];
    let unsavedChanges = false;

    function authHeader() {
        return { 'Content-Type': 'application/json', 'X-Instructor-Auth': currentPassword };
    }

    async function apiCall(action, method = 'GET', body = null, params = '') {
        const url = `${API_BASE}?action=${action}${params}`;
        const opts = { method, headers: authHeader() };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(url, opts);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'API error');
        return data;
    }

    // ---- Initialize Editor ----
    function initEditor(password) {
        currentPassword = password;
        bindEditorEvents();
    }

    function bindEditorEvents() {
        // Open editor button
        const editorBtn = document.getElementById('open-editor');
        if (editorBtn) {
            editorBtn.addEventListener('click', openEditor);
        }

        // Close editor
        const closeBtn = document.getElementById('close-editor');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeEditor);
        }

        // Editor overlay click to close
        const modal = document.getElementById('editor-modal');
        if (modal) {
            const overlay = modal.querySelector('.modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    if (unsavedChanges) {
                        if (!confirm('Ungesicherte Änderungen verwerfen?')) return;
                    }
                    closeEditor();
                });
            }
        }

        // Tab navigation
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });

        // File actions
        document.getElementById('editor-new-file')?.addEventListener('click', newFile);
        document.getElementById('editor-save-file')?.addEventListener('click', saveCurrentFile);
        document.getElementById('editor-delete-file')?.addEventListener('click', deleteCurrentFile);
        document.getElementById('editor-rename-file')?.addEventListener('click', renameCurrentFile);

        // Settings save
        document.getElementById('editor-save-settings')?.addEventListener('click', saveSettings);

        // Password change
        document.getElementById('editor-save-password')?.addEventListener('click', changePassword);

        // Module order save
        document.getElementById('editor-save-order')?.addEventListener('click', saveModuleOrder);

        // Track unsaved changes
        const textarea = document.getElementById('editor-textarea');
        if (textarea) {
            textarea.addEventListener('input', () => { unsavedChanges = true; updateSaveIndicator(); });
        }
    }

    function updateSaveIndicator() {
        const indicator = document.getElementById('editor-unsaved');
        if (indicator) {
            indicator.classList.toggle('hidden', !unsavedChanges);
        }
    }

    // ---- Tab Navigation ----
    function switchTab(tabName) {
        document.querySelectorAll('.editor-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
        document.querySelectorAll('.editor-tab-content').forEach(c => c.classList.toggle('hidden', c.id !== `editor-tab-${tabName}`));

        if (tabName === 'files') loadFileList();
        if (tabName === 'settings') loadSettings();
        if (tabName === 'order') loadModuleOrder();
    }

    // ---- Open/Close Editor ----
    async function openEditor() {
        const modal = document.getElementById('editor-modal');
        if (modal) {
            modal.classList.remove('hidden');
            switchTab('files');
        }
    }

    function closeEditor() {
        unsavedChanges = false;
        updateSaveIndicator();
        const modal = document.getElementById('editor-modal');
        if (modal) modal.classList.add('hidden');
    }

    // ---- File Management ----
    async function loadFileList() {
        try {
            fileList = await apiCall('files');
            renderFileList();
        } catch (e) {
            window.app?.showNotification('Fehler beim Laden der Dateien: ' + e.message, 'error');
        }
    }

    function renderFileList() {
        const list = document.getElementById('editor-file-list');
        if (!list) return;

        list.innerHTML = fileList.map(f => `
            <div class="editor-file-item ${currentFile === f.name ? 'active' : ''}" data-name="${f.name}">
                <div class="editor-file-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div class="editor-file-info">
                    <span class="editor-file-name">${f.name}</span>
                    <span class="editor-file-meta">${formatFileSize(f.size)}</span>
                </div>
            </div>
        `).join('');

        list.querySelectorAll('.editor-file-item').forEach(item => {
            item.addEventListener('click', () => loadFile(item.dataset.name));
        });
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        return (bytes / 1024).toFixed(1) + ' KB';
    }

    async function loadFile(name) {
        if (unsavedChanges) {
            if (!confirm('Ungesicherte Änderungen verwerfen?')) return;
        }
        try {
            const data = await apiCall('file', 'GET', null, `&name=${encodeURIComponent(name)}`);
            currentFile = data.name;
            const textarea = document.getElementById('editor-textarea');
            if (textarea) textarea.value = data.content;
            const nameDisplay = document.getElementById('editor-current-filename');
            if (nameDisplay) nameDisplay.textContent = data.name;
            unsavedChanges = false;
            updateSaveIndicator();
            renderFileList();
            // Show editor panel
            document.getElementById('editor-file-panel')?.classList.remove('hidden');
        } catch (e) {
            window.app?.showNotification('Fehler beim Laden: ' + e.message, 'error');
        }
    }

    async function saveCurrentFile() {
        const textarea = document.getElementById('editor-textarea');
        if (!textarea || !currentFile) return;

        try {
            await apiCall('file', 'POST', { name: currentFile, content: textarea.value });
            unsavedChanges = false;
            updateSaveIndicator();
            window.app?.showNotification('Datei gespeichert: ' + currentFile, 'success');
            loadFileList();
        } catch (e) {
            window.app?.showNotification('Fehler beim Speichern: ' + e.message, 'error');
        }
    }

    function newFile() {
        const name = prompt('Dateiname (z.B. 11-neues-thema.md):');
        if (!name) return;

        let filename = name.trim();
        if (!filename.endsWith('.md')) filename += '.md';
        filename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '');

        const template = `:::module{id="${filename.replace('.md', '')}" title="Neues Modul" duration="30"}

:::title-slide
# Neues Modul
Beschreibung hier eingeben

---slide---

## Erste Folie

Inhalt hier...

:::endmodule
`;

        currentFile = filename;
        const textarea = document.getElementById('editor-textarea');
        if (textarea) textarea.value = template;
        const nameDisplay = document.getElementById('editor-current-filename');
        if (nameDisplay) nameDisplay.textContent = filename;
        unsavedChanges = true;
        updateSaveIndicator();
        document.getElementById('editor-file-panel')?.classList.remove('hidden');
    }

    async function deleteCurrentFile() {
        if (!currentFile) return;
        if (!confirm(`Datei "${currentFile}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) return;

        try {
            await apiCall('file', 'DELETE', null, `&name=${encodeURIComponent(currentFile)}`);
            window.app?.showNotification('Datei gelöscht: ' + currentFile, 'success');
            currentFile = null;
            const textarea = document.getElementById('editor-textarea');
            if (textarea) textarea.value = '';
            document.getElementById('editor-file-panel')?.classList.add('hidden');
            unsavedChanges = false;
            updateSaveIndicator();
            loadFileList();
        } catch (e) {
            window.app?.showNotification('Fehler beim Löschen: ' + e.message, 'error');
        }
    }

    async function renameCurrentFile() {
        if (!currentFile) return;
        const newName = prompt('Neuer Dateiname:', currentFile);
        if (!newName || newName === currentFile) return;

        let filename = newName.trim();
        if (!filename.endsWith('.md')) filename += '.md';
        filename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '');

        try {
            // Read current content
            const textarea = document.getElementById('editor-textarea');
            const content = textarea ? textarea.value : '';

            // Save as new file
            await apiCall('file', 'POST', { name: filename, content });

            // Delete old file
            await apiCall('file', 'DELETE', null, `&name=${encodeURIComponent(currentFile)}`);

            currentFile = filename;
            const nameDisplay = document.getElementById('editor-current-filename');
            if (nameDisplay) nameDisplay.textContent = filename;
            unsavedChanges = false;
            updateSaveIndicator();
            window.app?.showNotification('Datei umbenannt zu: ' + filename, 'success');
            loadFileList();
        } catch (e) {
            window.app?.showNotification('Fehler beim Umbenennen: ' + e.message, 'error');
        }
    }

    // ---- Module Order ----
    async function loadModuleOrder() {
        try {
            const data = await apiCall('modules');
            renderModuleOrder(data.modules || []);
        } catch (e) {
            window.app?.showNotification('Fehler beim Laden der Module: ' + e.message, 'error');
        }
    }

    function renderModuleOrder(modules) {
        const container = document.getElementById('editor-module-order');
        if (!container) return;

        container.innerHTML = modules.map((m, i) => `
            <div class="editor-order-item" data-index="${i}" draggable="true">
                <span class="editor-order-handle">☰</span>
                <span class="editor-order-num">${i + 1}</span>
                <span class="editor-order-name">${m}</span>
                <button class="editor-order-up" title="Nach oben" ${i === 0 ? 'disabled' : ''}>▲</button>
                <button class="editor-order-down" title="Nach unten" ${i === modules.length - 1 ? 'disabled' : ''}>▼</button>
                <button class="editor-order-remove" title="Aus Liste entfernen">✕</button>
            </div>
        `).join('');

        // Bind up/down/remove
        container.querySelectorAll('.editor-order-up').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.editor-order-item');
                const idx = parseInt(item.dataset.index);
                if (idx > 0) {
                    [modules[idx - 1], modules[idx]] = [modules[idx], modules[idx - 1]];
                    renderModuleOrder(modules);
                }
            });
        });

        container.querySelectorAll('.editor-order-down').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.editor-order-item');
                const idx = parseInt(item.dataset.index);
                if (idx < modules.length - 1) {
                    [modules[idx], modules[idx + 1]] = [modules[idx + 1], modules[idx]];
                    renderModuleOrder(modules);
                }
            });
        });

        container.querySelectorAll('.editor-order-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.editor-order-item');
                const idx = parseInt(item.dataset.index);
                modules.splice(idx, 1);
                renderModuleOrder(modules);
            });
        });

        // Enable drag-and-drop
        enableDragReorder(container, modules);

        // Store modules reference for saving
        container._modules = modules;
    }

    function enableDragReorder(container, modules) {
        let dragIdx = null;

        container.querySelectorAll('.editor-order-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                dragIdx = parseInt(item.dataset.index);
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                dragIdx = null;
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                item.classList.add('drag-over');
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                const dropIdx = parseInt(item.dataset.index);
                if (dragIdx !== null && dragIdx !== dropIdx) {
                    const moved = modules.splice(dragIdx, 1)[0];
                    modules.splice(dropIdx, 0, moved);
                    renderModuleOrder(modules);
                }
            });
        });
    }

    async function saveModuleOrder() {
        const container = document.getElementById('editor-module-order');
        if (!container || !container._modules) return;

        try {
            // Read current modules.json to preserve metadata
            const current = await apiCall('modules');
            current.modules = container._modules;
            await apiCall('modules', 'POST', current);
            window.app?.showNotification('Modulreihenfolge gespeichert', 'success');
        } catch (e) {
            window.app?.showNotification('Fehler beim Speichern: ' + e.message, 'error');
        }
    }

    // ---- Site Settings ----
    async function loadSettings() {
        try {
            const data = await apiCall('config');
            const site = data.site || {};
            setField('editor-site-title', site.title || '');
            setField('editor-site-subtitle', site.subtitle || '');
            setField('editor-site-course-name', site.course_name || '');
            setField('editor-site-course-badge', site.course_badge || '');
            setField('editor-site-course-desc', site.course_desc || '');
            setField('editor-site-dozent', site.dozent || '');
            setField('editor-site-institution', site.institution || '');
            setField('editor-site-stat-modules', site.stat_modules || '');
            setField('editor-site-stat-exercises', site.stat_exercises || '');
            setField('editor-site-stat-duration', site.stat_duration || '');
        } catch (e) {
            window.app?.showNotification('Fehler beim Laden der Einstellungen: ' + e.message, 'error');
        }
    }

    function setField(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }

    function getField(id) {
        const el = document.getElementById(id);
        return el ? el.value : '';
    }

    async function saveSettings() {
        const site = {
            title: getField('editor-site-title'),
            subtitle: getField('editor-site-subtitle'),
            course_name: getField('editor-site-course-name'),
            course_badge: getField('editor-site-course-badge'),
            course_desc: getField('editor-site-course-desc'),
            dozent: getField('editor-site-dozent'),
            institution: getField('editor-site-institution'),
            stat_modules: getField('editor-site-stat-modules'),
            stat_exercises: getField('editor-site-stat-exercises'),
            stat_duration: getField('editor-site-stat-duration'),
        };

        try {
            await apiCall('config', 'POST', { site });
            window.app?.showNotification('Einstellungen gespeichert. Seite neu laden für Änderungen.', 'success');
        } catch (e) {
            window.app?.showNotification('Fehler beim Speichern: ' + e.message, 'error');
        }
    }

    // ---- Password Change ----
    async function changePassword() {
        const oldPw = getField('editor-old-password');
        const newPw = getField('editor-new-password');
        const confirmPw = getField('editor-confirm-password');

        if (!oldPw || !newPw) {
            window.app?.showNotification('Bitte alle Felder ausfüllen', 'warning');
            return;
        }

        if (newPw !== confirmPw) {
            window.app?.showNotification('Neue Passwörter stimmen nicht überein', 'error');
            return;
        }

        if (newPw.length < 4) {
            window.app?.showNotification('Passwort muss mindestens 4 Zeichen lang sein', 'error');
            return;
        }

        try {
            await apiCall('change-password', 'POST', { oldPassword: oldPw, newPassword: newPw });
            currentPassword = newPw;
            // Clear fields
            setField('editor-old-password', '');
            setField('editor-new-password', '');
            setField('editor-confirm-password', '');
            window.app?.showNotification('Passwort erfolgreich geändert', 'success');
        } catch (e) {
            window.app?.showNotification('Fehler: ' + e.message, 'error');
        }
    }

    // ---- Expose ----
    window.editorModule = {
        init: initEditor,
        open: openEditor,
        close: closeEditor
    };
})();
