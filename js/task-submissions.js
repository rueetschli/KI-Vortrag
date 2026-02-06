/**
 * KI-AKADEMIE - Task Submissions Module
 * Handles interactive task exercises where students submit text answers
 * via QR code / URL, with results displayed on the following slide.
 */

(function () {
    const STORAGE_PREFIX = 'ki-task-';

    /**
     * Get all submissions for a task
     */
    function getSubmissions(taskId) {
        try {
            const data = localStorage.getItem(STORAGE_PREFIX + taskId);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    /**
     * Save a submission for a task
     */
    function saveSubmission(taskId, submission) {
        const submissions = getSubmissions(taskId);
        // Check if user already submitted (update instead)
        const existingIdx = submissions.findIndex(s => s.name === submission.name && s.group === submission.group);
        if (existingIdx >= 0) {
            submissions[existingIdx] = submission;
        } else {
            submissions.push(submission);
        }
        localStorage.setItem(STORAGE_PREFIX + taskId, JSON.stringify(submissions));
    }

    /**
     * Clear all submissions for a task
     */
    function clearSubmissions(taskId) {
        localStorage.removeItem(STORAGE_PREFIX + taskId);
    }

    /**
     * Generate the task submission URL
     */
    function getTaskUrl(taskId, title) {
        const baseUrl = window.location.href.split('?')[0].split('#')[0];
        // Use the same page with a task parameter
        return `${baseUrl}?task=${encodeURIComponent(taskId)}&title=${encodeURIComponent(title)}`;
    }

    /**
     * Generate QR code image URL
     */
    function getQrUrl(url) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    }

    /**
     * Create the task slide HTML (the slide with QR code and URL)
     */
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

    /**
     * Create the results slide HTML
     */
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

    /**
     * Render results into the results container
     */
    function renderResults(taskId) {
        const container = document.getElementById(`results-${taskId}`);
        if (!container) return;

        const submissions = getSubmissions(taskId);

        if (submissions.length === 0) {
            container.innerHTML = '<div class="task-no-results">Noch keine Einreichungen vorhanden.</div>';
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
            // Show the latest submission from the group
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

        container.innerHTML = html;
    }

    /**
     * Update live submission count
     */
    function updateTaskCount(taskId) {
        const countEl = document.getElementById(`task-count-${taskId}`);
        if (!countEl) return;

        const submissions = getSubmissions(taskId);
        const numberEl = countEl.querySelector('.count-number');
        if (numberEl) numberEl.textContent = submissions.length;
    }

    /**
     * Start polling for new submissions (for the task slide)
     */
    let pollInterval = null;

    function startPolling(taskId) {
        stopPolling();
        updateTaskCount(taskId);
        pollInterval = setInterval(() => {
            updateTaskCount(taskId);
            // Also update results if visible
            renderResults(taskId);
        }, 2000);
    }

    function stopPolling() {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
    }

    /**
     * Check if the current page is loaded as a task submission page
     */
    function checkTaskMode() {
        const params = new URLSearchParams(window.location.search);
        const taskId = params.get('task');
        const title = params.get('title') || 'Aufgabe';

        if (!taskId) return false;

        // This is a task submission page - render the submission UI
        renderSubmissionPage(taskId, title);
        return true;
    }

    /**
     * Render the mobile-optimized submission page
     */
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
            submitBtn.addEventListener('click', () => {
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

                // Save student info
                localStorage.setItem('ki-student-name', name);
                if (group) localStorage.setItem('ki-student-group', group);

                // Save submission
                saveSubmission(taskId, {
                    name,
                    group,
                    content,
                    timestamp: new Date().toISOString()
                });

                showStatus('Deine Antwort wurde eingereicht!', 'success');
                submitBtn.textContent = 'Aktualisieren';
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
        bold() {
            document.execCommand('bold', false, null);
        },
        italic() {
            document.execCommand('italic', false, null);
        },
        list() {
            document.execCommand('insertUnorderedList', false, null);
        },
        heading() {
            document.execCommand('formatBlock', false, 'h4');
        }
    };

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Hook into slide rendering to detect task/result slides
    function onSlideRendered() {
        // Check for task slides and start polling
        const taskSlide = document.querySelector('.task-slide');
        if (taskSlide) {
            const taskId = taskSlide.closest('[data-task-id]')?.dataset.taskId ||
                           taskSlide.querySelector('.task-qr-image')?.src?.match(/task=([^&]+)/)?.[1];
            // Extract taskId from the URL in the QR code
            const qrImg = taskSlide.querySelector('.task-qr-image');
            if (qrImg) {
                const qrSrc = decodeURIComponent(qrImg.src);
                const match = qrSrc.match(/task=([^&]+)/);
                if (match) startPolling(decodeURIComponent(match[1]));
            }
        }

        // Check for result slides
        document.querySelectorAll('.task-results-slide').forEach(el => {
            const taskId = el.dataset.taskId;
            if (taskId) {
                renderResults(taskId);
                startPolling(taskId);
            }
        });
    }

    // Expose module
    window.taskSubmissions = {
        getSubmissions,
        saveSubmission,
        clearSubmissions,
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
