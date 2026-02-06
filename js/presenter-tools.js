/**
 * KI-AKADEMIE - Presenter Tools
 * Spotlight, timer, YouTube embed, QR interactions
 */

(function () {
    let spotlightActive = false;
    let spotlightEl = null;
    let timerInterval = null;
    let timerSeconds = 0;

    function byId(id) {
        return document.getElementById(id);
    }

    function formatTime(total) {
        const mm = String(Math.floor(total / 60)).padStart(2, '0');
        const ss = String(total % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    }

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

    function toggleTimer() {
        const btn = byId('toggle-timer');
        const display = byId('dock-timer-display');

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            btn?.classList.remove('active');
            return;
        }

        btn?.classList.add('active');
        timerInterval = setInterval(() => {
            timerSeconds += 1;
            if (display) display.textContent = formatTime(timerSeconds);
        }, 1000);
    }

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

    function bind() {
        byId('toggle-spotlight')?.addEventListener('click', toggleSpotlight);
        byId('toggle-timer')?.addEventListener('click', toggleTimer);
        byId('open-media-modal')?.addEventListener('click', () => openModal('media-modal'));
        byId('close-media-modal')?.addEventListener('click', () => closeModal('media-modal'));
        byId('embed-youtube')?.addEventListener('click', embedYoutube);

        byId('open-interaction-panel')?.addEventListener('click', () => toggleInteractionPanel());
        byId('close-interaction-panel')?.addEventListener('click', () => toggleInteractionPanel(false));
        byId('generate-qr')?.addEventListener('click', generateQr);

        document.addEventListener('keydown', (event) => {
            // Don't intercept when typing in inputs, textareas, or contenteditable elements
            const tag = event.target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) return;

            if (event.key === 's' || event.key === 'S') {
                event.preventDefault();
                toggleSpotlight();
            }

            if (event.key === 't' || event.key === 'T') {
                event.preventDefault();
                toggleTimer();
            }
        });

        document.querySelectorAll('#media-modal .modal-overlay').forEach((el) => {
            el.addEventListener('click', () => closeModal('media-modal'));
        });
    }

    document.addEventListener('DOMContentLoaded', bind);
})();
