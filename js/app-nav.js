/**
 * KI-AKADEMIE - Navigation Module
 * Handles slides, navigation, content loading
 */

// Extend the main class
Object.assign(KIAkademie.prototype, {
    
    async loadContent() {
        try {
            const response = await fetch('content/modules.json');
            const config = await response.json();
            
            for (const file of config.modules) {
                try {
                    const mdRes = await fetch(`content/${file}`);
                    const md = await mdRes.text();
                    const parser = new MarkdownParser();
                    const parsed = parser.parseContent(md);
                    this.modules.push(...parsed);
                } catch (e) {
                    console.warn(`Could not load ${file}`, e);
                }
            }
        } catch (e) {
            console.warn('Loading demo content');
            this.loadDemoContent();
        }
        
        this.buildFlatSlides();
        this.renderModuleList();
        this.renderCurrentSlide();
        this.updateProgress();
    },
    
    loadDemoContent() {
        this.modules = [{
            id: 'demo', title: 'Demo-Modul', duration: '5',
            slides: [
                {id: 'demo-1', title: 'Willkommen', type: 'title', 
                 content: '<h1>KI-Akademie</h1><p>Demo-Präsentation</p>'},
                {id: 'demo-2', title: 'Inhalt', type: 'content',
                 content: '<h2>Was ist KI?</h2><p>Künstliche Intelligenz...</p>'}
            ]
        }];
    },
    
    buildFlatSlides() {
        this.flatSlides = [];
        this.modules.forEach((mod, mi) => {
            mod.slides.forEach((slide, si) => {
                this.flatSlides.push({moduleIndex: mi, slideIndex: si, ...slide});
            });
        });
        this.totalSlides = this.flatSlides.length;
    },
    
    renderModuleList() {
        if (!this.elements.moduleList) return;
        
        let html = '';
        this.modules.forEach((mod, i) => {
            const isActive = i === this.currentModuleIndex;
            html += `
                <div class="module-item ${isActive ? 'expanded' : ''}">
                    <div class="module-header ${isActive ? 'active' : ''}" onclick="app.goToModule(${i})">
                        <span class="module-number">${i + 1}</span>
                        <div class="module-info">
                            <div class="module-title">${mod.title}</div>
                            <div class="module-meta">${mod.slides.length} Folien · ${mod.duration} Min</div>
                        </div>
                    </div>
                    <div class="module-slides">
                        ${mod.slides.map((s, j) => `
                            <a href="#" class="slide-link ${i === this.currentModuleIndex && j === this.currentSlideIndex ? 'active' : ''}" 
                               onclick="event.preventDefault(); app.goToSlide(${i}, ${j})">
                                ${s.title || 'Folie ' + (j+1)}
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        this.elements.moduleList.innerHTML = html;
    },
    
    renderCurrentSlide() {
        if (!this.elements.slideContainer || !this.modules.length) return;
        
        const mod = this.modules[this.currentModuleIndex];
        if (!mod || !mod.slides.length) return;
        
        const slide = mod.slides[this.currentSlideIndex];
        if (!slide) return;
        
        const slideEl = document.createElement('div');
        slideEl.className = `slide ${slide.type || 'content'}-slide active`;
        slideEl.innerHTML = slide.content;
        
        // Clear and add new slide
        const old = this.elements.slideContainer.querySelector('.slide.active');
        if (old) {
            old.classList.remove('active');
            old.classList.add('prev');
            setTimeout(() => old.remove(), 500);
        }
        
        this.elements.slideContainer.appendChild(slideEl);
        this.updateNavigation();
        this.updateProgress();
        this.renderModuleList();
        
        // Save position
        window.storage?.setPosition(this.currentModuleIndex, this.currentSlideIndex);
    },
    
    nextSlide() {
        const mod = this.modules[this.currentModuleIndex];
        if (!mod) return;
        
        if (this.currentSlideIndex < mod.slides.length - 1) {
            this.currentSlideIndex++;
        } else if (this.currentModuleIndex < this.modules.length - 1) {
            this.currentModuleIndex++;
            this.currentSlideIndex = 0;
        }
        this.renderCurrentSlide();
    },
    
    prevSlide() {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
        } else if (this.currentModuleIndex > 0) {
            this.currentModuleIndex--;
            this.currentSlideIndex = this.modules[this.currentModuleIndex].slides.length - 1;
        }
        this.renderCurrentSlide();
    },
    
    goToSlide(moduleIndex, slideIndex) {
        this.currentModuleIndex = moduleIndex;
        this.currentSlideIndex = slideIndex;
        this.renderCurrentSlide();
        this.closeSidebar();
    },
    
    goToModule(index) {
        this.currentModuleIndex = index;
        this.currentSlideIndex = 0;
        this.renderCurrentSlide();
    },
    
    goToLastSlide() {
        this.currentModuleIndex = this.modules.length - 1;
        this.currentSlideIndex = this.modules[this.currentModuleIndex].slides.length - 1;
        this.renderCurrentSlide();
    },
    
    getCurrentFlatIndex() {
        let idx = 0;
        for (let i = 0; i < this.currentModuleIndex; i++) {
            idx += this.modules[i].slides.length;
        }
        return idx + this.currentSlideIndex;
    },
    
    updateNavigation() {
        const flatIdx = this.getCurrentFlatIndex();
        const isFirst = flatIdx === 0;
        const isLast = flatIdx === this.totalSlides - 1;
        
        if (this.elements.prevSlide) this.elements.prevSlide.disabled = isFirst;
        if (this.elements.nextSlide) this.elements.nextSlide.disabled = isLast;
        
        if (this.elements.slideIndicator) {
            this.elements.slideIndicator.querySelector('.current-slide').textContent = flatIdx + 1;
            this.elements.slideIndicator.querySelector('.total-slides').textContent = this.totalSlides;
        }
    },
    
    updateProgress() {
        const progress = this.totalSlides > 0 ? Math.round(((this.getCurrentFlatIndex() + 1) / this.totalSlides) * 100) : 0;
        if (this.elements.globalProgress) this.elements.globalProgress.style.width = progress + '%';
        if (this.elements.progressText) this.elements.progressText.textContent = progress + '%';
    }
});
