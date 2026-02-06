/**
 * KI-AKADEMIE - Main Application
 * Part 1: Core class, initialization, events
 */

class KIAkademie {
    constructor() {
        this.modules = [];
        this.currentModuleIndex = 0;
        this.currentSlideIndex = 0;
        this.totalSlides = 0;
        this.flatSlides = [];
        this.elements = {};
    }
    
    async init() {
        this.cacheElements();
        this.bindEvents();
        this.bindKeyboard();
        this.bindTouch();
        this.checkLogin();
        await this.loadContent();
    }
    
    cacheElements() {
        this.elements = {
            loginScreen: document.getElementById('login-screen'),
            loginForm: document.getElementById('login-form'),
            studentName: document.getElementById('student-name'),
            app: document.getElementById('app'),
            displayName: document.getElementById('display-name'),
            userAvatar: document.getElementById('user-avatar'),
            prevSlide: document.getElementById('prev-slide'),
            nextSlide: document.getElementById('next-slide'),
            slideIndicator: document.getElementById('slide-indicator'),
            globalProgress: document.getElementById('global-progress'),
            progressText: document.getElementById('progress-text'),
            slideContainer: document.getElementById('slide-container'),
            moduleSidebar: document.getElementById('module-sidebar'),
            moduleList: document.getElementById('module-list'),
            toggleOverview: document.getElementById('toggle-overview'),
            toggleFullscreen: document.getElementById('toggle-fullscreen'),
            closeSidebar: document.getElementById('close-sidebar'),
            notifications: document.getElementById('notifications')
        };
    }
    
    bindEvents() {
        this.elements.loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        this.elements.prevSlide?.addEventListener('click', () => this.prevSlide());
        this.elements.nextSlide?.addEventListener('click', () => this.nextSlide());
        this.elements.toggleOverview?.addEventListener('click', () => this.toggleSidebar());
        this.elements.closeSidebar?.addEventListener('click', () => this.closeSidebar());
        this.elements.toggleFullscreen?.addEventListener('click', () => this.toggleFullscreen());
        
        window.addEventListener('exerciseCompleted', (e) => this.handleExerciseComplete(e.detail));
    }
    
    // Keyboard & Presenter Remote Support
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'n':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': case 'p':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0, 0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToLastSlide();
                    break;
                case 'f': case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    this.closeSidebar();
                    break;
                case 'o':
                    e.preventDefault();
                    this.toggleSidebar();
                    break;
            }
        });
    }
    
    bindTouch() {
        let startX = 0;
        const container = this.elements.slideContainer;
        if (!container) return;
        
        container.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        }, {passive: true});
        
        container.addEventListener('touchend', (e) => {
            const diff = e.changedTouches[0].screenX - startX;
            if (Math.abs(diff) > 50) {
                diff < 0 ? this.nextSlide() : this.prevSlide();
            }
        }, {passive: true});
    }
    
    checkLogin() {
        if (window.storage?.isLoggedIn()) {
            this.showApp(window.storage.getUser());
        }
    }
    
    handleLogin() {
        const name = this.elements.studentName?.value.trim();
        if (!name) {
            this.showNotification('Bitte Namen eingeben', 'warning');
            return;
        }
        const user = window.storage.setUser(name);
        this.showApp(user);
    }
    
    showApp(user) {
        this.elements.loginScreen?.classList.add('hidden');
        this.elements.app?.classList.remove('hidden');
        if (this.elements.displayName) this.elements.displayName.textContent = user.name;
        if (this.elements.userAvatar) this.elements.userAvatar.textContent = user.initials;

        // Auto fullscreen on start
        setTimeout(() => {
            document.documentElement.requestFullscreen().catch(() => {});
        }, 300);
    }
}

// Global: play video fullscreen
window.playVideoFullscreen = function(thumbnailEl) {
    const container = thumbnailEl.closest('.media-video-container');
    if (!container) return;

    const videoId = container.dataset.videoId;
    const videoUrl = container.dataset.videoUrl;
    if (!videoId) return;

    const overlay = document.getElementById('video-fullscreen-overlay');
    const content = document.getElementById('video-fullscreen-content');
    if (!overlay || !content) return;

    content.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            style="width:100%;height:100%;border:0;border-radius:12px;"
        ></iframe>
    `;
    overlay.classList.remove('hidden');

    // Close handler
    const closeBtn = document.getElementById('close-video-fullscreen');
    const closeHandler = () => {
        overlay.classList.add('hidden');
        content.innerHTML = '';
        closeBtn.removeEventListener('click', closeHandler);
    };
    closeBtn.addEventListener('click', closeHandler);

    // Escape to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeHandler();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
};

window.app = new KIAkademie();
document.addEventListener('DOMContentLoaded', () => {
    // Check if this is a task submission page (mobile student view)
    const params = new URLSearchParams(window.location.search);
    if (params.get('task')) return; // task-submissions.js handles this

    window.app.init();
});
