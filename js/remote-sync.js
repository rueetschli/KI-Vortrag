/**
 * KI-AKADEMIE - Remote Sync Module
 * Handles:
 *   1. Instructor slide broadcasting (remote control for students)
 *   2. Student score reporting to server
 *   3. Student points display in nav bar
 *   4. QR code overlay on exercise slides
 *   5. Instructor dashboard (scores + feedback)
 */

(function () {
    const SYNC_API = 'api/sync.php';
    let syncPollInterval = null;
    let lastKnownSlide = -1;
    let syncActive = false;

    // ----------------------------------------------------------------
    // 1. Instructor: Broadcast current slide
    // ----------------------------------------------------------------

    /**
     * Called by instructor's browser whenever the slide changes.
     * POSTs the current flat slide index to the server.
     */
    async function broadcastSlide() {
        if (!window.isInstructor) return;
        const app = window.app;
        if (!app || !app.modules.length) return;

        const flatIdx = app.getCurrentFlatIndex();
        try {
            await fetch(`${SYNC_API}?action=slide`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slide: flatIdx,
                    moduleIndex: app.currentModuleIndex,
                    slideIndex: app.currentSlideIndex
                })
            });
        } catch { /* ignore network errors */ }
    }

    // ----------------------------------------------------------------
    // 2. Student: Poll for instructor slide changes (remote control)
    // ----------------------------------------------------------------

    function startStudentSync() {
        if (syncActive || window.isInstructor) return;
        syncActive = true;
        pollInstructorSlide();
    }

    function stopStudentSync() {
        syncActive = false;
        if (syncPollInterval) {
            clearTimeout(syncPollInterval);
            syncPollInterval = null;
        }
    }

    async function pollInstructorSlide() {
        if (!syncActive) return;

        try {
            const res = await fetch(`${SYNC_API}?action=slide`);
            if (res.ok) {
                const data = await res.json();
                const serverSlide = data.slide;
                const serverTs = data.timestamp || 0;

                // Only sync if the instructor has set state recently (within last 2 hours)
                const now = Math.floor(Date.now() / 1000);
                if (serverTs > 0 && (now - serverTs) < 7200) {
                    const app = window.app;
                    if (app && app.flatSlides && serverSlide !== lastKnownSlide) {
                        lastKnownSlide = serverSlide;
                        const target = app.flatSlides[serverSlide];
                        if (target) {
                            const currentFlat = app.getCurrentFlatIndex();
                            if (currentFlat !== serverSlide) {
                                app.goToSlide(target.moduleIndex, target.slideIndex);
                            }
                        }
                    }
                }
            }
        } catch { /* ignore */ }

        if (syncActive) {
            syncPollInterval = setTimeout(pollInstructorSlide, 2000);
        }
    }

    // ----------------------------------------------------------------
    // 3. Student: Report scores to server
    // ----------------------------------------------------------------

    async function reportScore() {
        const user = window.storage?.getUser();
        if (!user || window.isInstructor) return;

        const score = window.storage.calculateExerciseScore();
        const exercises = window.storage.getExerciseResults();

        // Enrich exercise data with type info from DOM where possible
        const enriched = {};
        for (const [id, result] of Object.entries(exercises)) {
            enriched[id] = { ...result };
            const card = document.querySelector(`[data-exercise-id="${id}"]`);
            if (card) {
                enriched[id].type = card.dataset.type || '';
                const titleEl = card.querySelector('.exercise-title');
                if (titleEl) enriched[id].title = titleEl.textContent;
            }
            // Capture scale value
            if (enriched[id].type === 'scale') {
                const scaleEl = document.querySelector(`#scale-${id}`);
                if (scaleEl) enriched[id].value = scaleEl.value;
            }
            // Capture text input value
            if (enriched[id].type === 'text-input') {
                const textEl = document.querySelector(`#text-${id}`);
                if (textEl) enriched[id].value = textEl.value;
            }
        }

        try {
            await fetch(`${SYNC_API}?action=score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.name,
                    studentId: user.id,
                    earned: score.earned,
                    total: score.total,
                    percentage: score.percentage,
                    exercises: enriched
                })
            });
        } catch { /* ignore */ }
    }

    // ----------------------------------------------------------------
    // 4. Student Points Display
    // ----------------------------------------------------------------

    function updatePointsDisplay() {
        const el = document.getElementById('student-points');
        if (!el) return;

        const score = window.storage?.calculateExerciseScore();
        if (!score || score.total === 0) {
            el.classList.add('hidden');
            return;
        }

        el.classList.remove('hidden');
        const earnedEl = el.querySelector('.points-earned');
        const totalEl = el.querySelector('.points-total');
        if (earnedEl) earnedEl.textContent = score.earned;
        if (totalEl) totalEl.textContent = score.total;
    }

    // ----------------------------------------------------------------
    // 5. QR Code Overlay for Exercise Slides
    // ----------------------------------------------------------------

    function showExerciseQR() {
        // Only show for instructor view
        if (!window.isInstructor) return;

        const overlay = document.getElementById('exercise-qr-overlay');
        if (!overlay) return;

        // Check if current slide has an exercise
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) {
            overlay.classList.add('hidden');
            return;
        }

        const exercise = activeSlide.querySelector('.exercise-card');
        if (!exercise) {
            overlay.classList.add('hidden');
            return;
        }

        // Generate QR pointing to the current presentation URL
        const baseUrl = window.location.href.split('?')[0].split('#')[0];
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(baseUrl)}`;

        overlay.innerHTML = `
            <div class="exercise-qr-content">
                <img src="${qrUrl}" alt="QR-Code" class="exercise-qr-image">
                <span class="exercise-qr-label">Mitmachen!</span>
            </div>
        `;
        overlay.classList.remove('hidden');
    }

    // ----------------------------------------------------------------
    // 6. Instructor Dashboard
    // ----------------------------------------------------------------

    async function openDashboard() {
        const modal = document.getElementById('dashboard-modal');
        if (!modal) return;

        modal.classList.remove('hidden');
        const body = document.getElementById('dashboard-body');
        if (body) body.innerHTML = '<div class="dashboard-loading">Daten werden geladen...</div>';

        try {
            const [scoresRes, feedbackRes] = await Promise.all([
                fetch(`${SYNC_API}?action=scores`),
                fetch(`${SYNC_API}?action=feedback`)
            ]);

            const scores = scoresRes.ok ? await scoresRes.json() : [];
            const feedback = feedbackRes.ok ? await feedbackRes.json() : [];

            renderDashboard(scores, feedback);
        } catch {
            if (body) body.innerHTML = '<p style="color:var(--error);">Fehler beim Laden der Daten.</p>';
        }
    }

    function renderDashboard(scores, feedback) {
        const body = document.getElementById('dashboard-body');
        if (!body) return;

        let html = '';

        // --- Scores Table ---
        html += '<h3 class="dashboard-section-title">Punktestand der Studenten</h3>';

        if (scores.length === 0) {
            html += '<p class="dashboard-empty">Noch keine Ergebnisse vorhanden.</p>';
        } else {
            // Sort by points descending
            scores.sort((a, b) => b.earned - a.earned);

            html += '<div class="dashboard-table-wrap"><table class="dashboard-table">';
            html += '<thead><tr><th>#</th><th>Name</th><th>Punkte</th><th>Max</th><th>%</th><th>Zuletzt aktiv</th></tr></thead>';
            html += '<tbody>';
            scores.forEach((s, i) => {
                const pct = s.percentage || 0;
                const barColor = pct >= 70 ? 'var(--success)' : pct >= 40 ? 'var(--warning)' : 'var(--error)';
                const timeStr = s.timestamp ? new Date(s.timestamp).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }) : '-';
                html += `<tr>
                    <td class="rank">${i + 1}</td>
                    <td class="name">${escapeHtml(s.name)}</td>
                    <td class="points">${s.earned}</td>
                    <td class="max-points">${s.total}</td>
                    <td class="percentage">
                        <div class="dashboard-bar-bg">
                            <div class="dashboard-bar" style="width:${pct}%;background:${barColor}"></div>
                        </div>
                        <span>${pct}%</span>
                    </td>
                    <td class="time">${timeStr}</td>
                </tr>`;
            });
            html += '</tbody></table></div>';

            // Summary stats
            const avg = Math.round(scores.reduce((s, x) => s + x.percentage, 0) / scores.length);
            const maxScore = Math.max(...scores.map(s => s.earned));
            html += `
                <div class="dashboard-stats">
                    <div class="dashboard-stat">
                        <span class="stat-value">${scores.length}</span>
                        <span class="stat-label">Teilnehmer</span>
                    </div>
                    <div class="dashboard-stat">
                        <span class="stat-value">${avg}%</span>
                        <span class="stat-label">Durchschnitt</span>
                    </div>
                    <div class="dashboard-stat">
                        <span class="stat-value">${maxScore}</span>
                        <span class="stat-label">Höchste Punktzahl</span>
                    </div>
                </div>
            `;
        }

        // --- Feedback Section ---
        if (feedback.length > 0) {
            html += '<h3 class="dashboard-section-title" style="margin-top:2rem;">Feedback & Bewertungen</h3>';

            // Group by exercise
            const grouped = {};
            feedback.forEach(f => {
                const key = f.exerciseId;
                if (!grouped[key]) grouped[key] = { title: f.title, type: f.type, entries: [] };
                grouped[key].entries.push(f);
            });

            for (const [exId, group] of Object.entries(grouped)) {
                html += `<div class="dashboard-feedback-group">`;
                html += `<h4 class="feedback-group-title">${escapeHtml(group.title || exId)}</h4>`;

                if (group.type === 'scale') {
                    const values = group.entries.map(e => parseFloat(e.value) || 0);
                    const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
                    html += `<div class="feedback-scale-summary">`;
                    html += `<span class="feedback-avg">Durchschnitt: <strong>${avg}</strong></span>`;
                    html += `<span class="feedback-count">(${values.length} Antworten)</span>`;
                    html += `</div>`;
                    // Individual values
                    html += '<div class="feedback-values">';
                    group.entries.forEach(e => {
                        html += `<span class="feedback-chip">${escapeHtml(e.student)}: ${e.value}</span>`;
                    });
                    html += '</div>';
                } else {
                    // Text input feedback
                    group.entries.forEach(e => {
                        html += `<div class="feedback-text-entry">
                            <span class="feedback-student">${escapeHtml(e.student)}</span>
                            <div class="feedback-text-content">${escapeHtml(String(e.value || ''))}</div>
                        </div>`;
                    });
                }

                html += '</div>';
            }
        }

        // Export button
        html += `
            <div class="dashboard-actions">
                <button class="button primary" onclick="window.remoteSync.exportDashboard()">
                    CSV exportieren
                </button>
            </div>
        `;

        body.innerHTML = html;
    }

    function exportDashboard() {
        fetch(`${SYNC_API}?action=scores`)
            .then(r => r.json())
            .then(scores => {
                if (!scores.length) return;

                let csv = 'Rang,Name,Punkte,Maximum,Prozent,Zeitpunkt\n';
                scores.sort((a, b) => b.earned - a.earned);
                scores.forEach((s, i) => {
                    csv += `${i + 1},"${s.name}",${s.earned},${s.total},${s.percentage}%,"${s.timestamp || ''}"\n`;
                });

                const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ki-akademie-ergebnisse-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
            })
            .catch(() => {
                window.app?.showNotification('Export fehlgeschlagen.', 'error');
            });
    }

    // ----------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ----------------------------------------------------------------
    // Hook into app lifecycle
    // ----------------------------------------------------------------

    function init() {
        // Hook into renderCurrentSlide to broadcast slide + show QR
        const origRender = KIAkademie.prototype.renderCurrentSlide;
        if (origRender) {
            KIAkademie.prototype.renderCurrentSlide = function () {
                origRender.call(this);
                broadcastSlide();
                updatePointsDisplay();
                // Delay QR check to let DOM render
                setTimeout(showExerciseQR, 100);
            };
        }

        // Hook into exercise completion to report score + update display
        window.addEventListener('exerciseCompleted', () => {
            updatePointsDisplay();
            // Slight delay to let storage save first
            setTimeout(reportScore, 500);
        });

        // Start student sync if not instructor
        // Delayed to let instructor check happen first
        setTimeout(() => {
            if (!window.isInstructor) {
                startStudentSync();
            }
            updatePointsDisplay();
        }, 2000);

        // Dashboard button
        const dashBtn = document.getElementById('open-dashboard');
        if (dashBtn) {
            dashBtn.addEventListener('click', openDashboard);
        }

        // Close dashboard
        const closeDash = document.getElementById('close-dashboard');
        if (closeDash) {
            closeDash.addEventListener('click', () => {
                document.getElementById('dashboard-modal')?.classList.add('hidden');
            });
        }
    }

    // ----------------------------------------------------------------
    // Expose module
    // ----------------------------------------------------------------

    window.remoteSync = {
        broadcastSlide,
        startStudentSync,
        stopStudentSync,
        reportScore,
        updatePointsDisplay,
        openDashboard,
        exportDashboard,
        showExerciseQR
    };

    document.addEventListener('DOMContentLoaded', init);
})();
