/**
 * KI-AKADEMIE - Task Submissions Module
 * Handles interactive task exercises where students submit text answers
 * via QR code / URL, with results displayed on the following slide.
 *
 * Uses a server-side API (api/submissions.php) for cross-device storage,
 * with localStorage as fallback when the API is unavailable.
 */

(function () {
    const STORAGE_PREFIX = 'ki-task-';
    const API_BASE = 'api/submissions.php';

    // Cache: avoids unnecessary DOM updates when nothing changed
    let submissionsCache = {};
    let lastRenderedHash = {};
    let apiAvailable = null; // null = untested, true/false after first request

    // ----------------------------------------------------------------
    // Storage: API + localStorage fallback
    // ----------------------------------------------------------------

    /**
     * Fetch submissions from the server API.
     * Updates the local cache and returns the array.
     * Falls back to localStorage on network/server error.
     */
    async function fetchSubmissions(taskId) {
        try {
            const res = await fetch(`${API_BASE}?task=${encodeURIComponent(taskId)}`);
            if (res.ok) {
                apiAvailable = true;
                const data = await res.json();
                submissionsCache[taskId] = data;
                return data;
            }
        } catch { /* network error */ }

        if (apiAvailable === null) apiAvailable = false;
        return getSubmissionsLocal(taskId);
    }

    /**
     * Read submissions from localStorage (synchronous).
     */
    function getSubmissionsLocal(taskId) {
        try {
            const data = localStorage.getItem(STORAGE_PREFIX + taskId);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    /**
     * Synchronous getter – returns cached API data or falls back to localStorage.
     * Used by renderResults / updateTaskCount between async fetches.
     */
    function getSubmissions(taskId) {
        if (submissionsCache[taskId] !== undefined) return submissionsCache[taskId];
        return getSubmissionsLocal(taskId);
    }

    /**
     * Save a submission: POST to API + write to localStorage as backup.
     * Returns true if the API call succeeded.
     */
    async function saveSubmission(taskId, submission) {
        // Always persist locally as a safety net
        const local = getSubmissionsLocal(taskId);
        const idx = local.findIndex(s => s.name === submission.name && s.group === submission.group);
        if (idx >= 0) local[idx] = submission;
        else local.push(submission);
        localStorage.setItem(STORAGE_PREFIX + taskId, JSON.stringify(local));

        // POST to server
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskId, ...submission })
            });
            if (res.ok) {
                apiAvailable = true;
                return true;
            }
        } catch { /* network error */ }

        if (apiAvailable === null) apiAvailable = false;
        return false;
    }

    /**
     * Clear all submissions for a task (API + localStorage).
     */
    async function clearSubmissions(taskId) {
        localStorage.removeItem(STORAGE_PREFIX + taskId);
        delete submissionsCache[taskId];
        delete lastRenderedHash[taskId];
        try {
            await fetch(`${API_BASE}?task=${encodeURIComponent(taskId)}`, { method: 'DELETE' });
        } catch { /* ignore */ }
    }

    /**
     * Clear ALL task submissions (used by instructor "clear answers").
     */
    async function clearAllSubmissions() {
        // Clear all ki-task-* entries from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_PREFIX)) keysToRemove.push(key);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        submissionsCache = {};
        lastRenderedHash = {};
        try {
            await fetch(API_BASE, { method: 'DELETE' });
        } catch { /* ignore */ }
    }

    // ----------------------------------------------------------------
    // URL helpers
    // ----------------------------------------------------------------

    function getTaskUrl(taskId, title) {
        const baseUrl = window.location.href.split('?')[0].split('#')[0];
        return `${baseUrl}?task=${encodeURIComponent(taskId)}&title=${encodeURIComponent(title)}`;
    }

    function getQrUrl(url) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    }

    // ----------------------------------------------------------------
    // Slide HTML generators
    // ----------------------------------------------------------------

    function createTaskSlideHtml(taskId, title, description) {
        const taskUrl = getTaskUrl(taskId, title);
        const qrUrl = getQrUrl(taskUrl);

        return `
            <div class="task-slide">
                <div class="task-header">
                    <span class="task-badge">Gruppenaufgabe</span>
                    <h2 class="task-title">${title}</h2>
                </div>
                <div class="task-description">${description ? marked.parse(description) : ''}</div>
                <div class="task-access">
                    <div class="task-qr">
                        <img src="${qrUrl}" alt="QR-Code für Aufgabe" class="task-qr-image">
                        <p class="task-qr-label">QR-Code scannen</p>
                    </div>
                    <div class="task-or">oder</div>
                    <div class="task-url">
                        <p class="task-url-label">URL im Browser öffnen:</p>
                        <div class="task-url-box">${taskUrl}</div>
                    </div>
                </div>
                <div class="task-live-count" id="task-count-${taskId}">
                    <span class="count-number">0</span> Einreichungen
                </div>
            </div>
        `;
    }

    function createResultsSlideHtml(taskId, title) {
        return `
            <div class="task-results-slide" data-task-id="${taskId}">
                <h2 class="task-results-title">Ergebnisse: ${title}</h2>
                <div class="task-results-container" id="results-${taskId}">
                    <div class="task-results-loading">Antworten werden geladen...</div>
                </div>
            </div>
        `;
    }

    // ----------------------------------------------------------------
    // Results rendering (with flicker prevention)
    // ----------------------------------------------------------------

    function renderResults(taskId) {
        const container = document.getElementById(`results-${taskId}`);
        if (!container) return;

        const submissions = getSubmissions(taskId);

        if (submissions.length === 0) {
            const emptyHtml = '<div class="task-no-results">Noch keine Einreichungen vorhanden.</div>';
            if (container.innerHTML !== emptyHtml) {
                container.innerHTML = emptyHtml;
            }
            return;
        }

        // Group by group name
        const groups = {};
        const individuals = [];

        submissions.forEach(sub => {
            if (sub.group) {
                if (!groups[sub.group]) groups[sub.group] = [];
                groups[sub.group].push(sub);
            } else {
                individuals.push(sub);
            }
        });

        let html = '';

        // Render grouped submissions
        Object.entries(groups).forEach(([groupName, members]) => {
            const latest = members[members.length - 1];
            html += `
                <div class="task-result-card group">
                    <div class="task-result-header">
                        <span class="task-result-group">${escapeHtml(groupName)}</span>
                        <span class="task-result-members">${members.map(m => escapeHtml(m.name)).join(', ')}</span>
                    </div>
                    <div class="task-result-content">${latest.content}</div>
                </div>
            `;
        });

        // Render individual submissions
        individuals.forEach(sub => {
            html += `
                <div class="task-result-card">
                    <div class="task-result-header">
                        <span class="task-result-name">${escapeHtml(sub.name)}</span>
                        <span class="task-result-time">${new Date(sub.timestamp).toLocaleTimeString('de-CH')}</span>
                    </div>
                    <div class="task-result-content">${sub.content}</div>
                </div>
            `;
        });

        // Only update DOM if content actually changed (prevents flicker)
        const hash = simpleHash(html);
        if (lastRenderedHash[taskId] !== hash) {
            lastRenderedHash[taskId] = hash;
            container.innerHTML = html;
        }
    }

    /**
     * Fast string hash for change detection.
     */
    function simpleHash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        }
        return h;
    }

    // ----------------------------------------------------------------
    // Live submission count
    // ----------------------------------------------------------------

    function updateTaskCount(taskId) {
        const countEl = document.getElementById(`task-count-${taskId}`);
        if (!countEl) return;

        const submissions = getSubmissions(taskId);
        const numberEl = countEl.querySelector('.count-number');
        if (numberEl) {
            const newCount = String(submissions.length);
            if (numberEl.textContent !== newCount) {
                numberEl.textContent = newCount;
            }
        }
    }

    // ----------------------------------------------------------------
    // Polling (async-safe with setTimeout, not setInterval)
    // ----------------------------------------------------------------

    let pollTimeout = null;
    let currentPollTaskId = null;

    function startPolling(taskId) {
        stopPolling();
        currentPollTaskId = taskId;
        pollTick(taskId);
    }

    async function pollTick(taskId) {
        // Guard: stop if polling was cancelled or taskId changed
        if (currentPollTaskId !== taskId) return;

        await fetchSubmissions(taskId);
        updateTaskCount(taskId);
        renderResults(taskId);

        // Schedule next tick (only after current completes, prevents overlapping)
        if (currentPollTaskId === taskId) {
            pollTimeout = setTimeout(() => pollTick(taskId), 3000);
        }
    }

    function stopPolling() {
        currentPollTaskId = null;
        if (pollTimeout) {
            clearTimeout(pollTimeout);
            pollTimeout = null;
        }
    }

    // ----------------------------------------------------------------
    // Task submission page (mobile student view)
    // ----------------------------------------------------------------

    function checkTaskMode() {
        const params = new URLSearchParams(window.location.search);
        const taskId = params.get('task');
        const title = params.get('title') || 'Aufgabe';

        if (!taskId) return false;

        renderSubmissionPage(taskId, title);
        return true;
    }

    function renderSubmissionPage(taskId, title) {
        // Hide the normal app
        document.getElementById('login-screen')?.classList.add('hidden');
        document.getElementById('app')?.classList.add('hidden');
        document.getElementById('particles')?.remove();
        document.querySelector('.grid-overlay')?.remove();

        // Get saved student info
        const savedName = localStorage.getItem('ki-student-name') || '';
        const savedGroup = localStorage.getItem('ki-student-group') || '';

        const container = document.createElement('div');
        container.className = 'task-submission-page';
        container.innerHTML = `
            <div class="task-sub-header">
                <div class="task-sub-logo">KI-AKADEMIE</div>
                <div class="task-sub-badge">Aufgabe</div>
            </div>
            <div class="task-sub-body">
                <h1 class="task-sub-title">${escapeHtml(title)}</h1>

                <div class="task-sub-form">
                    <div class="task-sub-field">
                        <label>Dein Name</label>
                        <input type="text" id="task-name" value="${escapeHtml(savedName)}" placeholder="Vor- und Nachname" class="task-sub-input">
                    </div>
                    <div class="task-sub-field">
                        <label>Gruppenname <span class="optional">(optional)</span></label>
                        <input type="text" id="task-group" value="${escapeHtml(savedGroup)}" placeholder="z.B. Gruppe A" class="task-sub-input">
                    </div>

                    <div class="task-sub-field">
                        <label>Deine Antwort</label>
                        <div class="task-editor-toolbar">
                            <button type="button" onclick="taskEditor.bold()" title="Fett"><b>B</b></button>
                            <button type="button" onclick="taskEditor.italic()" title="Kursiv"><i>I</i></button>
                            <button type="button" onclick="taskEditor.list()" title="Liste">&#8226;</button>
                            <button type="button" onclick="taskEditor.heading()" title="Überschrift">H</button>
                        </div>
                        <div id="task-editor" class="task-editor" contenteditable="true" data-placeholder="Schreibe deine Antwort hier..."></div>
                    </div>

                    <button type="button" class="task-sub-submit" id="task-submit">
                        Antwort einreichen
                    </button>
                    <div id="task-sub-status" class="task-sub-status hidden"></div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        document.body.style.overflow = 'auto';
        document.body.style.background = '#0a1628';

        // Pre-fill title as heading
        const editor = container.querySelector('#task-editor');
        if (editor) {
            editor.innerHTML = `<h3>${escapeHtml(title)}</h3><p><br></p>`;
        }

        // Bind submit
        const submitBtn = container.querySelector('#task-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', async () => {
                const name = container.querySelector('#task-name').value.trim();
                const group = container.querySelector('#task-group').value.trim();
                const content = editor.innerHTML;

                if (!name) {
                    showStatus('Bitte gib deinen Namen ein.', 'error');
                    return;
                }

                if (!content || content === `<h3>${escapeHtml(title)}</h3><p><br></p>`) {
                    showStatus('Bitte schreibe eine Antwort.', 'error');
                    return;
                }

                // Disable button while saving
                submitBtn.disabled = true;
                submitBtn.textContent = 'Wird gesendet...';

                // Save student info
                localStorage.setItem('ki-student-name', name);
                if (group) localStorage.setItem('ki-student-group', group);

                // Save submission (API + localStorage)
                const apiOk = await saveSubmission(taskId, {
                    name,
                    group,
                    content,
                    timestamp: new Date().toISOString()
                });

                submitBtn.disabled = false;
                submitBtn.textContent = 'Aktualisieren';

                if (apiOk) {
                    showStatus('Deine Antwort wurde eingereicht!', 'success');
                } else {
                    showStatus('Antwort lokal gespeichert (Server nicht erreichbar).', 'warning');
                }
            });
        }

        function showStatus(msg, type) {
            const status = container.querySelector('#task-sub-status');
            if (!status) return;
            status.textContent = msg;
            status.className = `task-sub-status ${type}`;
            status.classList.remove('hidden');
            setTimeout(() => status.classList.add('hidden'), 4000);
        }
    }

    // Simple WYSIWYG editor commands
    window.taskEditor = {
        bold() { document.execCommand('bold', false, null); },
        italic() { document.execCommand('italic', false, null); },
        list() { document.execCommand('insertUnorderedList', false, null); },
        heading() { document.execCommand('formatBlock', false, 'h4'); }
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ----------------------------------------------------------------
    // Hook into slide rendering
    // ----------------------------------------------------------------

    function onSlideRendered() {
        // Check for task slides and start polling
        const taskSlide = document.querySelector('.task-slide');
        if (taskSlide) {
            const directId = taskSlide.dataset?.taskId;
            if (directId) {
                startPolling(directId);
                return;
            }
            const qrImg = taskSlide.querySelector('.task-qr-image');
            if (qrImg) {
                const qrSrc = decodeURIComponent(qrImg.src);
                const match = qrSrc.match(/task=([^&]+)/);
                if (match) startPolling(decodeURIComponent(match[1]));
            }
            return;
        }

        // Check for result slides
        const resultSlides = document.querySelectorAll('.task-results-slide');
        if (resultSlides.length > 0) {
            resultSlides.forEach(el => {
                const taskId = el.dataset.taskId;
                if (taskId) {
                    startPolling(taskId);
                }
            });
            return;
        }

        // No task or result slide visible → stop polling
        stopPolling();
    }

    // ----------------------------------------------------------------
    // Expose module
    // ----------------------------------------------------------------

    window.taskSubmissions = {
        getSubmissions,
        saveSubmission,
        clearSubmissions,
        clearAllSubmissions,
        createTaskSlideHtml,
        createResultsSlideHtml,
        renderResults,
        startPolling,
        stopPolling,
        checkTaskMode,
        onSlideRendered,
        getTaskUrl
    };

    // Check if we're in task submission mode
    document.addEventListener('DOMContentLoaded', () => {
        if (checkTaskMode()) return; // Stop normal app init
    });
})();
