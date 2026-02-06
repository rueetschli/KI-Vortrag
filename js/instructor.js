/**
 * KI-AKADEMIE - Instructor Module
 * Handles instructor login, presenter view, and clear answers
 */

(function () {
    // Fallback password (used if PHP backend is unavailable)
    const FALLBACK_PASSWORD = 'dozent2026';

    let isInstructor = false;
    let presenterWindow = null;
    let instructorPassword = '';

    function checkInstructorSession() {
        return sessionStorage.getItem('ki-instructor') === 'true';
    }

    function setInstructorSession(value) {
        if (value) {
            sessionStorage.setItem('ki-instructor', 'true');
        } else {
            sessionStorage.removeItem('ki-instructor');
        }
    }

    function activateInstructorMode() {
        isInstructor = true;
        setInstructorSession(true);
        window.isInstructor = true;

        // Show instructor UI elements
        const badge = document.getElementById('instructor-badge');
        const presenterBtn = document.getElementById('open-presenter');
        const clearBtn = document.getElementById('clear-answers');
        const dashBtn = document.getElementById('open-dashboard');
        const editorBtn = document.getElementById('open-editor');

        if (badge) badge.classList.remove('hidden');
        if (presenterBtn) presenterBtn.classList.remove('hidden');
        if (clearBtn) clearBtn.classList.remove('hidden');
        if (dashBtn) dashBtn.classList.remove('hidden');
        if (editorBtn) editorBtn.classList.remove('hidden');

        // Hide student points display for instructor
        const pointsEl = document.getElementById('student-points');
        if (pointsEl) pointsEl.classList.add('hidden');

        // Initialize editor module with password
        if (window.editorModule) {
            window.editorModule.init(instructorPassword || FALLBACK_PASSWORD);
        }

        // Set instructor name
        const user = window.storage.setUser('Dozent');
        window.app?.showApp(user);

        // Enter fullscreen
        requestFullscreen();
    }

    function requestFullscreen() {
        setTimeout(() => {
            document.documentElement.requestFullscreen().catch(() => {});
        }, 500);
    }

    function openPresenterView() {
        if (presenterWindow && !presenterWindow.closed) {
            presenterWindow.focus();
            return;
        }

        const width = 800;
        const height = 600;
        const left = window.screen.width - width;
        const top = 0;

        presenterWindow = window.open(
            '',
            'presenter',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        if (!presenterWindow) {
            window.app?.showNotification('Popup wurde blockiert. Bitte erlauben Sie Popups.', 'warning');
            return;
        }

        initPresenterWindow();
        updatePresenterView();
    }

    function initPresenterWindow() {
        if (!presenterWindow) return;

        const doc = presenterWindow.document;
        doc.open();
        doc.write(`<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Referentenansicht - KI-Akademie</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Exo+2:wght@400;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Exo 2', sans-serif;
            background: #0a1628;
            color: #fff;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .presenter-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px;
            background: rgba(26, 54, 93, 0.6);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .presenter-header h1 {
            font-family: 'Orbitron', sans-serif;
            font-size: 0.9rem;
            color: #f59e0b;
            letter-spacing: 0.1em;
        }
        .presenter-info {
            display: flex; align-items: center; gap: 20px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.85rem;
            color: #94a3b8;
        }
        .presenter-info .slide-num { color: #f59e0b; font-weight: 600; }
        .presenter-timer { color: #fbbf24; font-size: 1.1rem; font-weight: 700; }
        .presenter-body {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto 1fr;
            gap: 12px;
            padding: 12px;
            overflow: hidden;
        }
        .current-slide-preview {
            grid-column: 1;
            background: rgba(26, 54, 93, 0.4);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            overflow-y: auto;
            padding: 20px;
        }
        .current-slide-preview h3 {
            font-family: 'Orbitron', sans-serif;
            font-size: 0.7rem;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 10px;
        }
        .next-slide-preview {
            grid-column: 2;
            background: rgba(26, 54, 93, 0.25);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            overflow-y: auto;
            padding: 20px;
            opacity: 0.7;
        }
        .next-slide-preview h3 {
            font-family: 'Orbitron', sans-serif;
            font-size: 0.7rem;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 10px;
        }
        .notes-section {
            grid-column: 1 / -1;
            background: rgba(245, 158, 11, 0.08);
            border: 1px solid rgba(245, 158, 11, 0.25);
            border-radius: 12px;
            padding: 16px 20px;
            overflow-y: auto;
            min-height: 120px;
        }
        .notes-section h3 {
            font-family: 'Orbitron', sans-serif;
            font-size: 0.7rem;
            color: #f59e0b;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 10px;
        }
        .notes-content {
            font-size: 1rem;
            line-height: 1.7;
            color: #e2e8f0;
        }
        .notes-content p { margin-bottom: 8px; }
        .notes-content strong { color: #f59e0b; }
        .notes-content ul, .notes-content ol { padding-left: 20px; margin-bottom: 8px; }
        .notes-content li { margin-bottom: 4px; }
        .slide-html {
            font-size: 0.75rem;
            line-height: 1.5;
            color: #cbd5e1;
        }
        .slide-html h1 { font-size: 1.2rem; color: #f59e0b; margin-bottom: 8px; }
        .slide-html h2 { font-size: 1rem; color: #f59e0b; margin-bottom: 6px; }
        .slide-html h3 { font-size: 0.9rem; color: #fff; margin-bottom: 4px; }
        .slide-html p { margin-bottom: 4px; }
        .slide-html strong { color: #f59e0b; }
        .slide-html ul, .slide-html ol { padding-left: 16px; margin-bottom: 4px; }
        .slide-html li { margin-bottom: 2px; }
        .presenter-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 10px;
            background: rgba(26, 54, 93, 0.6);
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .presenter-btn {
            padding: 8px 20px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.2);
            background: rgba(255,255,255,0.08);
            color: #fff;
            font-family: 'Exo 2', sans-serif;
            cursor: pointer;
            font-size: 0.85rem;
        }
        .presenter-btn:hover { background: rgba(255,255,255,0.15); }
        .presenter-btn.primary {
            background: linear-gradient(135deg, #f59e0b, #ff6b35);
            color: #0a1628;
            border: none;
            font-weight: 600;
        }
        .no-notes { color: #64748b; font-style: italic; }
    </style>
</head>
<body>
    <div class="presenter-header">
        <h1>REFERENTENANSICHT</h1>
        <div class="presenter-info">
            <span>Folie <span class="slide-num" id="p-slide-num">1</span> / <span id="p-slide-total">1</span></span>
            <span class="presenter-timer" id="p-timer">00:00</span>
        </div>
    </div>
    <div class="presenter-body">
        <div class="current-slide-preview">
            <h3>Aktuelle Folie</h3>
            <div class="slide-html" id="p-current-slide"></div>
        </div>
        <div class="next-slide-preview">
            <h3>Nächste Folie</h3>
            <div class="slide-html" id="p-next-slide"></div>
        </div>
        <div class="notes-section">
            <h3>Notizen</h3>
            <div class="notes-content" id="p-notes"></div>
        </div>
    </div>
    <div class="presenter-controls">
        <button class="presenter-btn" onclick="window.opener.app.prevSlide()">← Zurück</button>
        <button class="presenter-btn primary" onclick="window.opener.app.nextSlide()">Weiter →</button>
    </div>
    <script>
        // Keep timer in sync
        setInterval(() => {
            const mainTimer = window.opener?.document?.getElementById('dock-timer-display');
            const pTimer = document.getElementById('p-timer');
            if (mainTimer && pTimer) pTimer.textContent = mainTimer.textContent;
        }, 1000);
    </script>
</body>
</html>`);
        doc.close();
    }

    function updatePresenterView() {
        if (!presenterWindow || presenterWindow.closed) return;

        const app = window.app;
        if (!app || !app.modules.length) return;

        const doc = presenterWindow.document;
        const mod = app.modules[app.currentModuleIndex];
        if (!mod) return;

        const slide = mod.slides[app.currentSlideIndex];
        if (!slide) return;

        // Update slide number
        const flatIdx = app.getCurrentFlatIndex();
        const numEl = doc.getElementById('p-slide-num');
        const totalEl = doc.getElementById('p-slide-total');
        if (numEl) numEl.textContent = flatIdx + 1;
        if (totalEl) totalEl.textContent = app.totalSlides;

        // Update current slide content
        const currentEl = doc.getElementById('p-current-slide');
        if (currentEl) currentEl.innerHTML = slide.content;

        // Update next slide preview
        const nextEl = doc.getElementById('p-next-slide');
        if (nextEl) {
            const nextSlide = getNextSlide(app);
            if (nextSlide) {
                nextEl.innerHTML = nextSlide.content;
            } else {
                nextEl.innerHTML = '<p class="no-notes">Letzte Folie</p>';
            }
        }

        // Update notes
        const notesEl = doc.getElementById('p-notes');
        if (notesEl) {
            if (slide.notes) {
                notesEl.innerHTML = marked.parse(slide.notes);
            } else {
                notesEl.innerHTML = '<p class="no-notes">Keine Notizen für diese Folie</p>';
            }
        }
    }

    function getNextSlide(app) {
        const mod = app.modules[app.currentModuleIndex];
        if (!mod) return null;

        if (app.currentSlideIndex < mod.slides.length - 1) {
            return mod.slides[app.currentSlideIndex + 1];
        } else if (app.currentModuleIndex < app.modules.length - 1) {
            const nextMod = app.modules[app.currentModuleIndex + 1];
            return nextMod.slides[0] || null;
        }
        return null;
    }

    function clearAllAnswers() {
        // Clear task submissions (API + localStorage)
        if (window.taskSubmissions?.clearAllSubmissions) {
            window.taskSubmissions.clearAllSubmissions();
        } else {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('ki-task-')) keys.push(key);
            }
            keys.forEach(k => localStorage.removeItem(k));
        }

        // Clear exercise results
        if (window.storage) {
            window.storage.data.exercises = {};
            window.storage.data.completedSlides = [];
            window.storage.save();
        }

        // Reset exercise handler
        if (window.exerciseHandler) {
            window.exerciseHandler.reset();
        }

        // Clear sync data (scores + slide state)
        try {
            fetch('api/sync.php?action=scores', { method: 'DELETE' }).catch(() => {});
        } catch { /* ignore */ }

        window.app?.showNotification('Alle Antworten wurden gelöscht.', 'success');
        window.app?.renderCurrentSlide();
    }

    async function loadSiteSettings() {
        try {
            const res = await fetch('api/editor.php?action=config', {
                headers: { 'X-Instructor-Auth': 'public-read' }
            });
            // This will fail with 401 - that's expected for unauthenticated reads
            // We need a public config endpoint. Instead, load from a generated JS config.
        } catch { /* ignore */ }

        // Try loading config via a lightweight PHP endpoint
        try {
            const res = await fetch('api/site-config.php');
            if (res.ok) {
                const site = await res.json();
                applySettings(site);
            }
        } catch { /* PHP unavailable, use HTML defaults */ }
    }

    function applySettings(site) {
        if (!site) return;
        const map = {
            'site-title': site.title,
            'site-subtitle': site.subtitle,
            'site-course-name': site.course_name,
            'site-course-badge': site.course_badge,
            'site-course-desc': site.course_desc,
            'site-stat-modules': site.stat_modules,
            'site-stat-exercises': site.stat_exercises,
            'site-stat-duration': site.stat_duration,
        };
        for (const [id, value] of Object.entries(map)) {
            if (value) {
                const el = document.getElementById(id);
                if (el) el.textContent = value;
            }
        }
        // Update page title
        if (site.title && site.institution) {
            document.title = `${site.course_name || site.title} | ${site.institution}`;
        }
    }

    function bind() {
        // Toggle instructor login form
        const toggleBtn = document.getElementById('instructor-login-toggle');
        const instructorForm = document.getElementById('instructor-login-form');
        if (toggleBtn && instructorForm) {
            toggleBtn.addEventListener('click', () => {
                instructorForm.classList.toggle('hidden');
                toggleBtn.classList.toggle('active');
            });
        }

        // Handle instructor login
        if (instructorForm) {
            instructorForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const passwordInput = document.getElementById('instructor-password');
                const password = passwordInput?.value || '';

                try {
                    // Try server-side auth first (uses config.php password)
                    const res = await fetch('api/editor.php?action=auth', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password })
                    });
                    if (res.ok) {
                        instructorPassword = password;
                        activateInstructorMode();
                        return;
                    }
                } catch {
                    // Backend unavailable - fall back to hardcoded password
                }

                // Fallback: check against hardcoded password
                if (password === FALLBACK_PASSWORD) {
                    instructorPassword = password;
                    activateInstructorMode();
                } else {
                    window.app?.showNotification('Falsches Passwort', 'error');
                }
            });
        }

        // Load site settings from config.php (non-blocking)
        loadSiteSettings();

        // Check existing instructor session
        if (checkInstructorSession()) {
            // Wait for app init
            setTimeout(() => {
                activateInstructorMode();
            }, 100);
        }

        // Open presenter view
        const presenterBtn = document.getElementById('open-presenter');
        if (presenterBtn) {
            presenterBtn.addEventListener('click', openPresenterView);
        }

        // Clear answers
        const clearBtn = document.getElementById('clear-answers');
        const clearModal = document.getElementById('clear-confirm-modal');
        const cancelClear = document.getElementById('cancel-clear');
        const closeClearConfirm = document.getElementById('close-clear-confirm');
        const confirmClear = document.getElementById('confirm-clear');

        if (clearBtn && clearModal) {
            clearBtn.addEventListener('click', () => clearModal.classList.remove('hidden'));
        }
        if (cancelClear && clearModal) {
            cancelClear.addEventListener('click', () => clearModal.classList.add('hidden'));
        }
        if (closeClearConfirm && clearModal) {
            closeClearConfirm.addEventListener('click', () => clearModal.classList.add('hidden'));
        }
        if (confirmClear && clearModal) {
            confirmClear.addEventListener('click', () => {
                clearAllAnswers();
                clearModal.classList.add('hidden');
            });
        }

        // Update presenter view on slide change (hook into app)
        const origRender = KIAkademie.prototype.renderCurrentSlide;
        if (origRender) {
            const origFn = origRender;
            KIAkademie.prototype.renderCurrentSlide = function () {
                origFn.call(this);
                updatePresenterView();
            };
        }
    }

    // Expose functions
    window.instructorModule = {
        isInstructor: () => isInstructor,
        openPresenterView,
        updatePresenterView,
        clearAllAnswers,
        activateInstructorMode
    };

    document.addEventListener('DOMContentLoaded', bind);
})();
