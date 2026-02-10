/**
 * KI-AKADEMIE - Presenter Tools
 * Spotlight, timer, YouTube embed, QR interactions, Break Mode
 */

(function () {
    // --- State Variables ---
    let spotlightActive = false;
    let spotlightEl = null;
    
    // Dock Timer (Stopwatch)
    let dockTimerInterval = null;
    let dockTimerSeconds = 0;

    // Break Timer (Countdown)
    let breakInterval = null;
    let breakTargetTime = null;

    function byId(id) {
        return document.getElementById(id);
    }

    function formatTime(totalSeconds) {
        const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const ss = String(totalSeconds % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    }

    // --- Spotlight Feature ---
    function toggleSpotlight() {
        const btn = byId('toggle-spotlight');
        spotlightActive = !spotlightActive;

        if (spotlightActive) {
            spotlightEl = document.createElement('div');
            spotlightEl.className = 'spotlight-overlay';
            document.body.appendChild(spotlightEl);

            document.addEventListener('mousemove', handleSpotlightMove);
            btn?.classList.add('active');
        } else {
            document.removeEventListener('mousemove', handleSpotlightMove);
            spotlightEl?.remove();
            spotlightEl = null;
            btn?.classList.remove('active');
        }
    }

    function handleSpotlightMove(event) {
        if (!spotlightEl) return;
        spotlightEl.style.setProperty('--x', `${event.clientX}px`);
        spotlightEl.style.setProperty('--y', `${event.clientY}px`);
    }

    // --- Dock Timer (Stopwatch) ---
    function toggleDockTimer() {
        const btn = byId('toggle-timer');
        const display = byId('dock-timer-display');

        if (dockTimerInterval) {
            clearInterval(dockTimerInterval);
            dockTimerInterval = null;
            btn?.classList.remove('active');
            return;
        }

        btn?.classList.add('active');
        dockTimerInterval = setInterval(() => {
            dockTimerSeconds += 1;
            if (display) display.textContent = formatTime(dockTimerSeconds);
        }, 1000);
    }

    // --- Break / Pause Feature ---
    function togglePauseMenu() {
        const overlay = byId('break-overlay');
        const selection = byId('break-selection');
        const timerView = byId('break-timer-view');

        if (!overlay) return;

        // Reset views
        selection.classList.remove('hidden');
        timerView.classList.add('hidden');
        
        // Show/Hide Overlay
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden');
        } else {
            // Only close if timer is NOT running. 
            // If timer is running, user must explicitly click "Stop Break"
            if (!breakInterval) {
                overlay.classList.add('hidden');
            }
        }
    }

    function startBreak(minutes) {
        const selection = byId('break-selection');
        const timerView = byId('break-timer-view');
        const countdownEl = byId('break-countdown');
        const endTimeEl = byId('break-end-time');

        // Switch views
        selection.classList.add('hidden');
        timerView.classList.remove('hidden');

        // Calculate Times
        const now = new Date();
        breakTargetTime = new Date(now.getTime() + minutes * 60000);
        
        // Display "Back at..."
        const endHours = String(breakTargetTime.getHours()).padStart(2, '0');
        const endMinutes = String(breakTargetTime.getMinutes()).padStart(2, '0');
        if (endTimeEl) endTimeEl.textContent = `${endHours}:${endMinutes}`;

        // Start Interval
        updateBreakTimer(); // Run once immediately
        if (breakInterval) clearInterval(breakInterval);
        
        breakInterval = setInterval(updateBreakTimer, 1000);
    }

    function updateBreakTimer() {
        const countdownEl = byId('break-countdown');
        if (!countdownEl || !breakTargetTime) return;

        const now = new Date();
        const diff = breakTargetTime - now;

        if (diff <= 0) {
            // Timer finished
            countdownEl.textContent = "00:00";
            clearInterval(breakInterval);
            breakInterval = null;
            // Optional: Play sound or flash here
            countdownEl.style.color = '#ef4444'; // Red
            return;
        }

        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function stopBreak() {
        if (breakInterval) {
            clearInterval(breakInterval);
            breakInterval = null;
        }
        byId('break-overlay')?.classList.add('hidden');
        byId('break-countdown').style.color = ''; // Reset color
    }

    // --- Media & Modal Helpers ---
    function extractYoutubeId(url) {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    function openModal(id) {
        byId(id)?.classList.remove('hidden');
    }

    function closeModal(id) {
        byId(id)?.classList.add('hidden');
    }

    function embedYoutube() {
        const input = byId('youtube-url');
        const preview = byId('youtube-preview');
        const id = extractYoutubeId(input?.value || '');

        if (!preview) return;
        if (!id) {
            preview.innerHTML = '<p>Ungültiger YouTube-Link. Bitte URL prüfen.</p>';
            return;
        }

        preview.innerHTML = `
            <iframe
                src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            ></iframe>
        `;
    }

    function toggleInteractionPanel(forceOpen) {
        const panel = byId('interaction-panel');
        if (!panel) return;
        if (typeof forceOpen === 'boolean') {
            panel.classList.toggle('open', forceOpen);
            return;
        }
        panel.classList.toggle('open');
    }

    function generateQr() {
        const title = byId('qr-title')?.value || 'Interaktion';
        const link = byId('qr-link')?.value || '';
        const output = byId('qr-output');
        if (!output) return;

        if (!link.startsWith('http://') && !link.startsWith('https://')) {
            output.innerHTML = '<p>Bitte eine gültige URL mit http:// oder https:// eingeben.</p>';
            return;
        }

        const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
        output.innerHTML = `
            <p><strong>${title}</strong></p>
            <img src="${qrSrc}" alt="QR Code für ${title}">
            <p style="margin-top:0.5rem;font-size:0.9rem;color:#94a3b8;">${link}</p>
        `;
    }

    // --- Initialization & Event Binding ---
    function bind() {
        // Spotlight
        byId('toggle-spotlight')?.addEventListener('click', toggleSpotlight);
        
        // Dock Timer
        byId('toggle-timer')?.addEventListener('click', toggleDockTimer);
        
        // Pause / Break
        byId('toggle-pause')?.addEventListener('click', togglePauseMenu);
        byId('close-break')?.addEventListener('click', () => byId('break-overlay')?.classList.add('hidden'));
        byId('stop-break')?.addEventListener('click', stopBreak);
        
        // Pause Duration Buttons
        document.querySelectorAll('.break-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                startBreak(minutes);
            });
        });

        // Media / YouTube
        byId('open-media-modal')?.addEventListener('click', () => openModal('media-modal'));
        byId('close-media-modal')?.addEventListener('click', () => closeModal('media-modal'));
        byId('embed-youtube')?.addEventListener('click', embedYoutube);

        // Interactions
        byId('open-interaction-panel')?.addEventListener('click', () => toggleInteractionPanel());
        byId('close-interaction-panel')?.addEventListener('click', () => toggleInteractionPanel(false));
        byId('generate-qr')?.addEventListener('click', generateQr);

        // Keyboard Shortcuts
        document.addEventListener('keydown', (event) => {
            const tag = event.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) return;

            if (event.key === 's' || event.key === 'S') {
                event.preventDefault();
                toggleSpotlight();
            }

            if (event.key === 't' || event.key === 'T') {
                event.preventDefault();
                toggleDockTimer();
            }

            if (event.key === 'p' || event.key === 'P') {
                event.preventDefault();
                togglePauseMenu();
            }
        });

        // Close modal on overlay click
        document.querySelectorAll('#media-modal .modal-overlay').forEach((el) => {
            el.addEventListener('click', () => closeModal('media-modal'));
        });
    }

    document.addEventListener('DOMContentLoaded', bind);
})();