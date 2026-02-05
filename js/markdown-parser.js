/**
 * KI-AKADEMIE - Markdown Parser & Slide Generator
 * Processes .md content files with special syntax for exercises and interactivity
 */

class MarkdownParser {
    constructor() {
        // Configure marked options
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true
            });
        }
        
        // Custom syntax patterns
        this.patterns = {
            // Slide separator: ---slide---
            slideSeparator: /^---slide---$/gm,
            
            // Module definition: :::module{id="1" title="Title" duration="60"}
            moduleStart: /^:::module\{([^}]+)\}$/gm,
            moduleEnd: /^:::$/gm,
            
            // Exercise blocks
            exerciseStart: /^:::exercise\{([^}]+)\}$/gm,
            exerciseEnd: /^:::$/gm,
            
            // Special content boxes
            infoBox: /^:::info\n([\s\S]*?)^:::$/gm,
            warningBox: /^:::warning\n([\s\S]*?)^:::$/gm,
            successBox: /^:::success\n([\s\S]*?)^:::$/gm,
            
            // Interactive demo
            demoStart: /^:::demo\{([^}]+)\}$/gm,
            
            // Slide types
            titleSlide: /^:::title-slide$/gm,
            contentSlide: /^:::content-slide$/gm,
            exerciseSlide: /^:::exercise-slide$/gm,
            
            // Attributes parser
            attributes: /(\w+)=["']([^"']+)["']/g
        };
    }
    
    /**
     * Parse a complete markdown file into modules and slides
     */
    parseContent(markdown) {
        const modules = [];
        let currentModule = null;
        let currentSlide = null;
        let slideIndex = 0;
        
        // Split by lines for processing
        const lines = markdown.split('\n');
        let buffer = [];
        let inModule = false;
        let inExercise = false;
        let exerciseBuffer = [];
        let exerciseAttrs = {};
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check for module start
            const moduleMatch = line.match(/^:::module\{([^}]+)\}$/);
            if (moduleMatch) {
                // Save previous module if exists
                if (currentModule && buffer.length > 0) {
                    this.processBuffer(currentModule, buffer, slideIndex);
                    buffer = [];
                }
                
                // Create new module
                const attrs = this.parseAttributes(moduleMatch[1]);
                currentModule = {
                    id: attrs.id || `module-${modules.length + 1}`,
                    title: attrs.title || 'Unbenanntes Modul',
                    duration: attrs.duration || '30',
                    slides: []
                };
                modules.push(currentModule);
                inModule = true;
                slideIndex = 0;
                continue;
            }
            
            // Check for module end
            if (line.trim() === ':::endmodule') {
                if (buffer.length > 0 && currentModule) {
                    this.processBuffer(currentModule, buffer, slideIndex);
                    buffer = [];
                }
                inModule = false;
                continue;
            }
            
            // Check for slide separator
            if (line.trim() === '---slide---') {
                if (buffer.length > 0 && currentModule) {
                    this.processBuffer(currentModule, buffer, slideIndex);
                    buffer = [];
                    slideIndex++;
                }
                continue;
            }
            
            // Check for exercise start
            const exerciseMatch = line.match(/^:::exercise\{([^}]+)\}$/);
            if (exerciseMatch) {
                exerciseAttrs = this.parseAttributes(exerciseMatch[1]);
                inExercise = true;
                exerciseBuffer = [];
                continue;
            }
            
            // Check for exercise end
            if (line.trim() === ':::endexercise' && inExercise) {
                const exerciseHtml = this.createExercise(exerciseAttrs, exerciseBuffer.join('\n'));
                buffer.push(exerciseHtml);
                inExercise = false;
                exerciseBuffer = [];
                continue;
            }
            
            // Collect content
            if (inExercise) {
                exerciseBuffer.push(line);
            } else {
                buffer.push(line);
            }
        }
        
        // Process remaining buffer
        if (buffer.length > 0 && currentModule) {
            this.processBuffer(currentModule, buffer, slideIndex);
        }
        
        return modules;
    }
    
    /**
     * Process a buffer of lines into a slide
     */
    processBuffer(module, buffer, slideIndex) {
        let content = buffer.join('\n').trim();
        if (!content) return;
        
        // Determine slide type
        let slideType = 'content';
        if (content.includes(':::title-slide')) {
            slideType = 'title';
            content = content.replace(/:::title-slide\n?/g, '');
        } else if (content.includes(':::exercise-slide')) {
            slideType = 'exercise';
            content = content.replace(/:::exercise-slide\n?/g, '');
        }
        
        // Process special boxes
        content = this.processSpecialBoxes(content);
        
        // Parse markdown to HTML
        let html = marked.parse(content);
        
        // Create slide object
        const slide = {
            id: `${module.id}-slide-${slideIndex}`,
            moduleId: module.id,
            type: slideType,
            content: html,
            index: slideIndex
        };
        
        // Extract title for navigation
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            slide.title = titleMatch[1];
        } else {
            const h2Match = content.match(/^##\s+(.+)$/m);
            slide.title = h2Match ? h2Match[1] : `Folie ${slideIndex + 1}`;
        }
        
        module.slides.push(slide);
    }
    
    /**
     * Process special content boxes
     */
    processSpecialBoxes(content) {
        // Info boxes
        content = content.replace(/:::info\n([\s\S]*?):::/gm, (match, inner) => {
            return `<div class="info-box">${marked.parse(inner.trim())}</div>`;
        });
        
        // Warning boxes
        content = content.replace(/:::warning\n([\s\S]*?):::/gm, (match, inner) => {
            return `<div class="warning-box">${marked.parse(inner.trim())}</div>`;
        });
        
        // Success boxes
        content = content.replace(/:::success\n([\s\S]*?):::/gm, (match, inner) => {
            return `<div class="success-box">${marked.parse(inner.trim())}</div>`;
        });
        
        return content;
    }
    
    /**
     * Parse attributes from a string like: id="1" title="Test"
     */
    parseAttributes(attrString) {
        const attrs = {};
        const regex = /(\w+)=["']([^"']+)["']/g;
        let match;
        
        while ((match = regex.exec(attrString)) !== null) {
            attrs[match[1]] = match[2];
        }
        
        return attrs;
    }
    
    /**
     * Create exercise HTML based on type
     */
    createExercise(attrs, content) {
        const type = attrs.type || 'multiple-choice';
        const id = attrs.id || `exercise-${Date.now()}`;
        const title = attrs.title || 'Übung';
        const points = attrs.points || '10';
        
        // Parse exercise content (YAML-like format)
        const exerciseData = this.parseExerciseContent(content);
        
        let exerciseHtml = '';
        
        switch (type) {
            case 'multiple-choice':
                exerciseHtml = this.createMultipleChoice(id, exerciseData);
                break;
            case 'true-false':
                exerciseHtml = this.createTrueFalse(id, exerciseData);
                break;
            case 'fill-blank':
                exerciseHtml = this.createFillBlank(id, exerciseData);
                break;
            case 'matching':
                exerciseHtml = this.createMatching(id, exerciseData);
                break;
            case 'ordering':
                exerciseHtml = this.createOrdering(id, exerciseData);
                break;
            case 'text-input':
                exerciseHtml = this.createTextInput(id, exerciseData);
                break;
            case 'scale':
                exerciseHtml = this.createScale(id, exerciseData);
                break;
            case 'demo':
                exerciseHtml = this.createDemo(id, exerciseData);
                break;
            default:
                exerciseHtml = `<p>Unbekannter Übungstyp: ${type}</p>`;
        }
        
        return `
            <div class="exercise-card" data-exercise-id="${id}" data-type="${type}" data-points="${points}">
                <div class="exercise-header">
                    <span class="exercise-type">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        ${this.getExerciseTypeLabel(type)}
                    </span>
                    <span class="exercise-points">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        ${points} Punkte
                    </span>
                </div>
                <h4 class="exercise-title">${title}</h4>
                ${exerciseData.description ? `<p class="exercise-description">${exerciseData.description}</p>` : ''}
                <div class="exercise-content">
                    ${exerciseHtml}
                </div>
                ${exerciseData.hint ? `
                    <button class="hint-button" onclick="toggleHint('${id}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Hinweis anzeigen
                    </button>
                    <div class="hint-content" id="hint-${id}">${exerciseData.hint}</div>
                ` : ''}
                <div class="exercise-actions">
                    <button class="button primary" onclick="checkExercise('${id}')">Antwort prüfen</button>
                </div>
                <div class="exercise-feedback" id="feedback-${id}"></div>
            </div>
        `;
    }
    
    /**
     * Parse exercise content from YAML-like format
     */
    parseExerciseContent(content) {
        const data = {
            question: '',
            options: [],
            correct: null,
            description: '',
            hint: '',
            feedback: { correct: '', incorrect: '' },
            pairs: [],
            items: [],
            blanks: []
        };
        
        const lines = content.split('\n');
        let currentKey = null;
        let currentList = null;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // Key-value pairs
            if (trimmed.startsWith('question:')) {
                data.question = trimmed.substring(9).trim();
                currentKey = 'question';
            } else if (trimmed.startsWith('description:')) {
                data.description = trimmed.substring(12).trim();
                currentKey = 'description';
            } else if (trimmed.startsWith('hint:')) {
                data.hint = trimmed.substring(5).trim();
                currentKey = 'hint';
            } else if (trimmed.startsWith('correct:')) {
                data.correct = trimmed.substring(8).trim();
                currentKey = 'correct';
            } else if (trimmed.startsWith('correct_feedback:')) {
                data.feedback.correct = trimmed.substring(17).trim();
            } else if (trimmed.startsWith('incorrect_feedback:')) {
                data.feedback.incorrect = trimmed.substring(19).trim();
            } else if (trimmed.startsWith('options:')) {
                currentList = 'options';
            } else if (trimmed.startsWith('pairs:')) {
                currentList = 'pairs';
            } else if (trimmed.startsWith('items:')) {
                currentList = 'items';
            } else if (trimmed.startsWith('blanks:')) {
                currentList = 'blanks';
            } else if (trimmed.startsWith('- ') && currentList) {
                const value = trimmed.substring(2);
                if (currentList === 'pairs') {
                    const parts = value.split('|').map(s => s.trim());
                    if (parts.length === 2) {
                        data.pairs.push({ left: parts[0], right: parts[1] });
                    }
                } else if (currentList === 'blanks') {
                    data.blanks.push(value);
                } else {
                    data[currentList].push(value);
                }
            } else if (trimmed.startsWith('text:')) {
                data.text = trimmed.substring(5).trim();
            } else if (trimmed.startsWith('min:')) {
                data.min = parseInt(trimmed.substring(4).trim());
            } else if (trimmed.startsWith('max:')) {
                data.max = parseInt(trimmed.substring(4).trim());
            } else if (trimmed.startsWith('step:')) {
                data.step = parseInt(trimmed.substring(5).trim());
            } else if (trimmed.startsWith('minLabel:')) {
                data.minLabel = trimmed.substring(9).trim();
            } else if (trimmed.startsWith('maxLabel:')) {
                data.maxLabel = trimmed.substring(9).trim();
            } else if (trimmed.startsWith('placeholder:')) {
                data.placeholder = trimmed.substring(12).trim();
            } else if (trimmed.startsWith('minLength:')) {
                data.minLength = parseInt(trimmed.substring(10).trim());
            } else if (trimmed.startsWith('maxLength:')) {
                data.maxLength = parseInt(trimmed.substring(10).trim());
            }
        }
        
        return data;
    }
    
    /**
     * Create Multiple Choice HTML
     */
    createMultipleChoice(id, data) {
        const optionsHtml = data.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D...
            return `
                <label class="mc-option" data-value="${letter}">
                    <input type="radio" name="${id}" value="${letter}">
                    <span class="mc-indicator">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </span>
                    <span class="mc-text"><strong>${letter}.</strong> ${option}</span>
                </label>
            `;
        }).join('');
        
        return `
            <p class="exercise-question">${data.question}</p>
            <div class="mc-options" data-correct="${data.correct}">
                ${optionsHtml}
            </div>
        `;
    }
    
    /**
     * Create True/False HTML
     */
    createTrueFalse(id, data) {
        return `
            <p class="exercise-question">${data.question}</p>
            <div class="tf-options" data-correct="${data.correct}">
                <button class="tf-option true" data-value="true" onclick="selectTrueFalse(this)">
                    <span class="tf-icon">✓</span>
                    <span class="tf-label">Richtig</span>
                </button>
                <button class="tf-option false" data-value="false" onclick="selectTrueFalse(this)">
                    <span class="tf-icon">✗</span>
                    <span class="tf-label">Falsch</span>
                </button>
            </div>
        `;
    }
    
    /**
     * Create Fill in the Blank HTML
     */
    createFillBlank(id, data) {
        let text = data.text || data.question;
        let blankIndex = 0;
        
        // Replace ___ with input fields
        text = text.replace(/___/g, () => {
            const answer = data.blanks[blankIndex] || '';
            const input = `<input type="text" class="fill-blank" data-answer="${answer}" data-index="${blankIndex}" placeholder="...">`;
            blankIndex++;
            return input;
        });
        
        return `
            <div class="fill-blank-container">${text}</div>
        `;
    }
    
    /**
     * Create Matching Exercise HTML
     */
    createMatching(id, data) {
        // Shuffle right side for matching
        const shuffledRight = [...data.pairs].sort(() => Math.random() - 0.5);
        
        const leftHtml = data.pairs.map((pair, index) => `
            <div class="matching-item left" data-index="${index}" onclick="selectMatching(this, 'left')">${pair.left}</div>
        `).join('');
        
        const rightHtml = shuffledRight.map((pair, index) => `
            <div class="matching-item right" data-answer="${data.pairs.findIndex(p => p.right === pair.right)}" onclick="selectMatching(this, 'right')">${pair.right}</div>
        `).join('');
        
        return `
            <p class="exercise-question">${data.question || 'Ordne die passenden Paare zu:'}</p>
            <div class="matching-container">
                <div class="matching-column left-column">${leftHtml}</div>
                <div class="matching-lines"></div>
                <div class="matching-column right-column">${rightHtml}</div>
            </div>
        `;
    }
    
    /**
     * Create Ordering Exercise HTML
     */
    createOrdering(id, data) {
        // Shuffle items
        const shuffled = [...data.items].sort(() => Math.random() - 0.5);
        
        const itemsHtml = shuffled.map((item, index) => {
            const correctIndex = data.items.indexOf(item);
            return `
                <div class="ordering-item" draggable="true" data-correct-index="${correctIndex}">
                    <span class="ordering-handle">
                        <span></span><span></span><span></span>
                    </span>
                    <span class="ordering-number">${index + 1}</span>
                    <span class="ordering-text">${item}</span>
                </div>
            `;
        }).join('');
        
        return `
            <p class="exercise-question">${data.question || 'Bringe die Elemente in die richtige Reihenfolge:'}</p>
            <div class="ordering-list" id="ordering-${id}">
                ${itemsHtml}
            </div>
        `;
    }
    
    /**
     * Create Text Input Exercise HTML
     */
    createTextInput(id, data) {
        const minLength = data.minLength || 10;
        const maxLength = data.maxLength || 500;
        
        return `
            <p class="exercise-question">${data.question}</p>
            <div class="text-input-exercise">
                <textarea class="text-input-area" 
                    id="text-${id}" 
                    placeholder="${data.placeholder || 'Deine Antwort hier eingeben...'}"
                    minlength="${minLength}"
                    maxlength="${maxLength}"
                    oninput="updateCharCounter(this, ${maxLength})"></textarea>
                <div class="char-counter">
                    <span id="counter-${id}">0</span> / ${maxLength} Zeichen
                </div>
            </div>
        `;
    }
    
    /**
     * Create Scale Exercise HTML
     */
    createScale(id, data) {
        const min = data.min || 1;
        const max = data.max || 10;
        const step = data.step || 1;
        const defaultValue = Math.round((min + max) / 2);
        
        return `
            <p class="scale-question">${data.question}</p>
            <div class="scale-exercise">
                <div class="scale-slider-container">
                    <input type="range" 
                        class="scale-slider" 
                        id="scale-${id}"
                        min="${min}" 
                        max="${max}" 
                        step="${step}"
                        value="${defaultValue}"
                        oninput="updateScaleValue('${id}', this.value)">
                </div>
                <div class="scale-labels">
                    <span class="scale-label">${data.minLabel || min}</span>
                    <span class="scale-label">${data.maxLabel || max}</span>
                </div>
                <div class="scale-value" id="scale-value-${id}">${defaultValue}</div>
            </div>
        `;
    }
    
    /**
     * Create Interactive Demo HTML
     */
    createDemo(id, data) {
        return `
            <div class="interactive-demo" id="demo-${id}">
                <div class="demo-header">
                    <span class="demo-title">${data.question || 'KI-Demo'}</span>
                    <span class="demo-badge">Live</span>
                </div>
                <div class="demo-content">
                    <div class="demo-chat" id="chat-${id}">
                        <div class="chat-message ai">
                            <div class="chat-avatar">KI</div>
                            <div class="chat-bubble">Hallo! Ich bin ein KI-Assistent. Stellen Sie mir eine Frage zum Thema ${data.description || 'Künstliche Intelligenz'}.</div>
                        </div>
                    </div>
                    <div class="demo-input">
                        <input type="text" id="demo-input-${id}" placeholder="Ihre Frage hier eingeben..." onkeypress="if(event.key==='Enter')sendDemoMessage('${id}')">
                        <button onclick="sendDemoMessage('${id}')">Senden</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Get human-readable exercise type label
     */
    getExerciseTypeLabel(type) {
        const labels = {
            'multiple-choice': 'Multiple Choice',
            'true-false': 'Richtig/Falsch',
            'fill-blank': 'Lückentext',
            'matching': 'Zuordnung',
            'ordering': 'Reihenfolge',
            'text-input': 'Freitext',
            'scale': 'Bewertung',
            'demo': 'Interaktive Demo'
        };
        return labels[type] || type;
    }
}

// Export for use in other modules
window.MarkdownParser = MarkdownParser;
