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
            slideSeparator: /^---slide---$/gm,
            moduleStart: /^:::module\{([^}]+)\}$/gm,
            moduleEnd: /^:::$/gm,
            exerciseStart: /^:::exercise\{([^}]+)\}$/gm,
            exerciseEnd: /^:::$/gm,
            infoBox: /^:::info\n([\s\S]*?)^:::$/gm,
            warningBox: /^:::warning\n([\s\S]*?)^:::$/gm,
            successBox: /^:::success\n([\s\S]*?)^:::$/gm,
            demoStart: /^:::demo\{([^}]+)\}$/gm,
            titleSlide: /^:::title-slide$/gm,
            contentSlide: /^:::content-slide$/gm,
            exerciseSlide: /^:::exercise-slide$/gm,
            attributes: /(\w+)=["']([^"']+)["']/g
        };
    }

    /**
     * Parse a complete markdown file into modules and slides
     */
    parseContent(markdown) {
        const modules = [];
        let currentModule = null;
        let slideIndex = 0;

        // Store pre-generated HTML blocks with placeholders to prevent
        // marked.parse() from escaping them (indented HTML = code block in markdown)
        this.htmlBlocks = new Map();
        this.htmlBlockCounter = 0;

        const lines = markdown.split('\n');
        let buffer = [];
        let inExercise = false;
        let exerciseBuffer = [];
        let exerciseAttrs = {};
        let inTask = false;
        let taskBuffer = [];
        let taskAttrs = {};
        let inNotes = false;
        let notesBuffer = [];
        let inTaskResults = false;
        let taskResultsAttrs = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Module start
            const moduleMatch = line.match(/^:::module\{([^}]+)\}$/);
            if (moduleMatch) {
                if (currentModule && buffer.length > 0) {
                    this.processBuffer(currentModule, buffer, slideIndex, notesBuffer.join('\n'));
                    buffer = [];
                    notesBuffer = [];
                }
                const attrs = this.parseAttributes(moduleMatch[1]);
                currentModule = {
                    id: attrs.id || `module-${modules.length + 1}`,
                    title: attrs.title || 'Unbenanntes Modul',
                    duration: attrs.duration || '30',
                    slides: []
                };
                modules.push(currentModule);
                slideIndex = 0;
                continue;
            }

            // Module end
            if (line.trim() === ':::endmodule') {
                if (buffer.length > 0 && currentModule) {
                    this.processBuffer(currentModule, buffer, slideIndex, notesBuffer.join('\n'));
                    buffer = [];
                    notesBuffer = [];
                }
                continue;
            }

            // Slide separator
            if (line.trim() === '---slide---') {
                if (buffer.length > 0 && currentModule) {
                    this.processBuffer(currentModule, buffer, slideIndex, notesBuffer.join('\n'));
                    buffer = [];
                    notesBuffer = [];
                    slideIndex++;
                }
                continue;
            }

            // Notes start/end
            if (line.trim() === ':::notes') {
                inNotes = true;
                continue;
            }
            if (line.trim() === ':::endnotes' && inNotes) {
                inNotes = false;
                continue;
            }
            if (inNotes) {
                notesBuffer.push(line);
                continue;
            }

            // Task start
            const taskMatch = line.match(/^:::task\{([^}]+)\}$/);
            if (taskMatch) {
                taskAttrs = this.parseAttributes(taskMatch[1]);
                inTask = true;
                taskBuffer = [];
                continue;
            }
            if (line.trim() === ':::endtask' && inTask) {
                const taskHtml = this.createTask(taskAttrs, taskBuffer.join('\n'));
                buffer.push(this.storeHtmlBlock(taskHtml));
                inTask = false;
                taskBuffer = [];
                continue;
            }

            // Task results
            const taskResultsMatch = line.match(/^:::taskresults\{([^}]+)\}$/);
            if (taskResultsMatch) {
                const trAttrs = this.parseAttributes(taskResultsMatch[1]);
                const trHtml = this.createTaskResults(trAttrs);
                buffer.push(this.storeHtmlBlock(trHtml));
                continue;
            }

            // Exercise start
            const exerciseMatch = line.match(/^:::exercise\{([^}]+)\}$/);
            if (exerciseMatch) {
                exerciseAttrs = this.parseAttributes(exerciseMatch[1]);
                inExercise = true;
                exerciseBuffer = [];
                continue;
            }
            if ((line.trim() === ':::endexercise' || line.trim() === ':::') && inExercise) {
                const exerciseHtml = this.createExercise(exerciseAttrs, exerciseBuffer.join('\n'));
                buffer.push(this.storeHtmlBlock(exerciseHtml));
                inExercise = false;
                exerciseBuffer = [];
                continue;
            }

            // Collect content
            if (inTask) {
                taskBuffer.push(line);
            } else if (inExercise) {
                exerciseBuffer.push(line);
            } else {
                buffer.push(line);
            }
        }

        // Process remaining buffer
        if (buffer.length > 0 && currentModule) {
            this.processBuffer(currentModule, buffer, slideIndex, notesBuffer.join('\n'));
        }

        return modules;
    }

    /**
     * Process a buffer of lines into a slide
     */
    processBuffer(module, buffer, slideIndex, notes) {
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

        // Process media layouts
        content = this.processMediaLayouts(content);

        // Parse markdown to HTML
        let html = marked.parse(content);

        // Restore pre-generated HTML blocks (exercises, tasks, task results)
        html = this.restoreHtmlBlocks(html);

        // Process video thumbnails
        html = this.processVideoThumbnails(html);

        // Create slide object
        const slide = {
            id: `${module.id}-slide-${slideIndex}`,
            moduleId: module.id,
            type: slideType,
            content: html,
            index: slideIndex,
            notes: notes ? notes.trim() : ''
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
        content = content.replace(/:::info\n([\s\S]*?):::/gm, (match, inner) => {
            return `<div class="info-box">${marked.parse(inner.trim())}</div>`;
        });
        content = content.replace(/:::warning\n([\s\S]*?):::/gm, (match, inner) => {
            return `<div class="warning-box">${marked.parse(inner.trim())}</div>`;
        });
        content = content.replace(/:::success\n([\s\S]*?):::/gm, (match, inner) => {
            return `<div class="success-box">${marked.parse(inner.trim())}</div>`;
        });
        return content;
    }

    /**
     * Process media layouts:
     * :::media{image="url" source="..." video="youtube-url" thumbnail="url" position="left|right"}
     * Text content here
     * :::endmedia
     */
    processMediaLayouts(content) {
        content = content.replace(
            /:::media\{([^}]+)\}\n([\s\S]*?):::endmedia/gm,
            (match, attrStr, innerContent) => {
                const attrs = this.parseAttributes(attrStr);
                return this.createMediaLayout(attrs, innerContent.trim());
            }
        );
        return content;
    }

    /**
     * Create a media layout HTML block
     */
    createMediaLayout(attrs, textContent) {
        const position = attrs.position || 'left';
        const image = attrs.image || '';
        const video = attrs.video || '';
        const thumbnail = attrs.thumbnail || '';
        const source = attrs.source || '';

        let mediaHtml = '';

        if (video) {
            const videoId = this.extractYoutubeId(video);
            const thumbUrl = thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '');
            mediaHtml = `
                <div class="media-video-container" data-video-id="${videoId || ''}" data-video-url="${video}">
                    <img src="${thumbUrl}" alt="Video Vorschau" class="media-thumbnail" onclick="playVideoFullscreen(this)">
                    <div class="media-play-button" onclick="playVideoFullscreen(this.parentElement.querySelector('.media-thumbnail'))">
                        <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                </div>
            `;
        } else if (image) {
            mediaHtml = `<img src="${image}" alt="" class="media-image">`;
        }

        if (source) {
            mediaHtml += `<div class="media-source">Quelle: ${source}</div>`;
        }

        const textHtml = marked.parse(textContent);

        if (position === 'right') {
            return `
                <div class="media-layout">
                    <div class="media-text">${textHtml}</div>
                    <div class="media-visual">${mediaHtml}</div>
                </div>
            `;
        }

        return `
            <div class="media-layout">
                <div class="media-visual">${mediaHtml}</div>
                <div class="media-text">${textHtml}</div>
            </div>
        `;
    }

    /**
     * Process video thumbnails: YouTube image links become playable thumbnails
     */
    processVideoThumbnails(html) {
        html = html.replace(
            /<img\s+src="(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})[^"]*)"[^>]*>/g,
            (match, url, videoId) => {
                const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                return `
                    <div class="media-video-container" data-video-id="${videoId}" data-video-url="${url}">
                        <img src="${thumbUrl}" alt="Video Vorschau" class="media-thumbnail" onclick="playVideoFullscreen(this)">
                        <div class="media-play-button" onclick="playVideoFullscreen(this.parentElement.querySelector('.media-thumbnail'))">
                            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                    </div>
                `;
            }
        );
        return html;
    }

    extractYoutubeId(url) {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        ];
        for (const p of patterns) {
            const m = url.match(p);
            if (m) return m[1];
        }
        return null;
    }

    /**
     * Create interactive task HTML (QR code slide)
     */
    createTask(attrs, content) {
        const id = attrs.id || `task-${Date.now()}`;
        const title = attrs.title || 'Aufgabe';
        const description = content.trim();
        const descHtml = marked.parse(description);

        const baseUrl = window.location.href.split('?')[0].split('#')[0];
        const taskUrl = `${baseUrl}?task=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(taskUrl)}`;

        return `
            <div class="task-slide" data-task-id="${id}">
                <div class="task-header">
                    <span class="task-badge">Gruppenaufgabe</span>
                    <h2 class="task-title">${title}</h2>
                </div>
                <div class="task-description">${descHtml}</div>
                <div class="task-access">
                    <div class="task-qr">
                        <img src="${qrUrl}" alt="QR-Code" class="task-qr-image">
                        <p class="task-qr-label">QR-Code scannen</p>
                    </div>
                    <div class="task-or">oder</div>
                    <div class="task-url">
                        <p class="task-url-label">URL im Browser öffnen:</p>
                        <div class="task-url-box">${taskUrl}</div>
                    </div>
                </div>
                <div class="task-live-count" id="task-count-${id}">
                    <span class="count-number">0</span> Einreichungen
                </div>
            </div>
        `;
    }

    /**
     * Create task results slide HTML
     */
    createTaskResults(attrs) {
        const taskId = attrs.task || attrs.id || '';
        const title = attrs.title || 'Ergebnisse';

        return `
            <div class="task-results-slide" data-task-id="${taskId}">
                <h2 class="task-results-title">${title}</h2>
                <div class="task-results-container" id="results-${taskId}">
                    <div class="task-results-loading">Antworten werden geladen...</div>
                </div>
            </div>
        `;
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
     * Store a pre-generated HTML block and return a placeholder.
     * This prevents marked.parse() from treating indented HTML as code blocks.
     */
    storeHtmlBlock(html) {
        const id = `HTMLBLOCK_${this.htmlBlockCounter++}`;
        this.htmlBlocks.set(id, html.trim());
        return `<!--${id}-->`;
    }

    /**
     * Replace placeholders in parsed HTML with the original HTML blocks.
     */
    restoreHtmlBlocks(html) {
        this.htmlBlocks.forEach((blockHtml, id) => {
            const placeholder = `<!--${id}-->`;
            // marked may wrap standalone HTML comments in <p> tags
            html = html.replace(`<p>${placeholder}</p>`, blockHtml);
            html = html.replace(placeholder, blockHtml);
        });
        return html;
    }

    /**
     * Create exercise HTML based on type
     */
    createExercise(attrs, content) {
        const type = attrs.type || 'multiple-choice';
        const id = attrs.id || `exercise-${Date.now()}`;
        const title = attrs.title || 'Übung';
        const points = attrs.points || '10';

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

    parseExerciseContent(content) {
        const data = {
            question: '', options: [], correct: null, description: '', hint: '',
            feedback: { correct: '', incorrect: '' }, pairs: [], items: [], blanks: []
        };

        const lines = content.split('\n');
        let currentList = null;

        for (const line of lines) {
            const trimmed = line.trim();

            if (trimmed.startsWith('question:')) { data.question = trimmed.substring(9).trim(); currentList = null; }
            else if (trimmed.startsWith('description:')) { data.description = trimmed.substring(12).trim(); currentList = null; }
            else if (trimmed.startsWith('hint:')) { data.hint = trimmed.substring(5).trim(); currentList = null; }
            else if (trimmed.startsWith('correct:')) { data.correct = trimmed.substring(8).trim(); currentList = null; }
            else if (trimmed.startsWith('correct_feedback:')) { data.feedback.correct = trimmed.substring(17).trim(); }
            else if (trimmed.startsWith('incorrect_feedback:')) { data.feedback.incorrect = trimmed.substring(19).trim(); }
            else if (trimmed.startsWith('options:')) { currentList = 'options'; }
            else if (trimmed.startsWith('pairs:')) { currentList = 'pairs'; }
            else if (trimmed.startsWith('items:')) { currentList = 'items'; }
            else if (trimmed.startsWith('blanks:')) { currentList = 'blanks'; }
            else if (trimmed.startsWith('- ') && currentList) {
                const value = trimmed.substring(2);
                if (currentList === 'pairs') {
                    const parts = value.split('|').map(s => s.trim());
                    if (parts.length === 2) data.pairs.push({ left: parts[0], right: parts[1] });
                } else if (currentList === 'blanks') {
                    data.blanks.push(value);
                } else {
                    data[currentList].push(value);
                }
            }
            else if (trimmed.startsWith('text:')) { data.text = trimmed.substring(5).trim(); }
            else if (trimmed.startsWith('min:')) { data.min = parseInt(trimmed.substring(4).trim()); }
            else if (trimmed.startsWith('max:')) { data.max = parseInt(trimmed.substring(4).trim()); }
            else if (trimmed.startsWith('step:')) { data.step = parseInt(trimmed.substring(5).trim()); }
            else if (trimmed.startsWith('minLabel:')) { data.minLabel = trimmed.substring(9).trim(); }
            else if (trimmed.startsWith('maxLabel:')) { data.maxLabel = trimmed.substring(9).trim(); }
            else if (trimmed.startsWith('placeholder:')) { data.placeholder = trimmed.substring(12).trim(); }
            else if (trimmed.startsWith('minLength:')) { data.minLength = parseInt(trimmed.substring(10).trim()); }
            else if (trimmed.startsWith('maxLength:')) { data.maxLength = parseInt(trimmed.substring(10).trim()); }
        }

        return data;
    }

    createMultipleChoice(id, data) {
        const optionsHtml = data.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
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
            <div class="mc-options" data-correct="${data.correct}">${optionsHtml}</div>
        `;
    }

    createTrueFalse(id, data) {
        return `
            <p class="exercise-question">${data.question}</p>
            <div class="tf-options" data-correct="${data.correct}">
                <button class="tf-option true" data-value="true" onclick="selectTrueFalse(this)">
                    <span class="tf-icon">✓</span><span class="tf-label">Richtig</span>
                </button>
                <button class="tf-option false" data-value="false" onclick="selectTrueFalse(this)">
                    <span class="tf-icon">✗</span><span class="tf-label">Falsch</span>
                </button>
            </div>
        `;
    }

    createFillBlank(id, data) {
        let text = data.text || data.question;
        let blankIndex = 0;
        text = text.replace(/___/g, () => {
            const answer = data.blanks[blankIndex] || '';
            const input = `<input type="text" class="fill-blank" data-answer="${answer}" data-index="${blankIndex}" placeholder="...">`;
            blankIndex++;
            return input;
        });
        return `<div class="fill-blank-container">${text}</div>`;
    }

    createMatching(id, data) {
        const shuffledRight = [...data.pairs].sort(() => Math.random() - 0.5);
        const leftHtml = data.pairs.map((pair, index) => `
            <div class="matching-item left" data-index="${index}" onclick="selectMatching(this, 'left')">${pair.left}</div>
        `).join('');
        const rightHtml = shuffledRight.map((pair) => `
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

    createOrdering(id, data) {
        const shuffled = [...data.items].sort(() => Math.random() - 0.5);
        const itemsHtml = shuffled.map((item, index) => {
            const correctIndex = data.items.indexOf(item);
            return `
                <div class="ordering-item" draggable="true" data-correct-index="${correctIndex}">
                    <span class="ordering-handle"><span></span><span></span><span></span></span>
                    <span class="ordering-number">${index + 1}</span>
                    <span class="ordering-text">${item}</span>
                </div>
            `;
        }).join('');
        return `
            <p class="exercise-question">${data.question || 'Bringe die Elemente in die richtige Reihenfolge:'}</p>
            <div class="ordering-list" id="ordering-${id}">${itemsHtml}</div>
        `;
    }

    createTextInput(id, data) {
        const minLength = data.minLength || 10;
        const maxLength = data.maxLength || 500;
        return `
            <p class="exercise-question">${data.question}</p>
            <div class="text-input-exercise">
                <textarea class="text-input-area" id="text-${id}"
                    placeholder="${data.placeholder || 'Deine Antwort hier eingeben...'}"
                    minlength="${minLength}" maxlength="${maxLength}"
                    oninput="updateCharCounter(this, ${maxLength})"></textarea>
                <div class="char-counter"><span id="counter-${id}">0</span> / ${maxLength} Zeichen</div>
            </div>
        `;
    }

    createScale(id, data) {
        const min = data.min || 1;
        const max = data.max || 10;
        const step = data.step || 1;
        const defaultValue = Math.round((min + max) / 2);
        return `
            <p class="scale-question">${data.question}</p>
            <div class="scale-exercise">
                <div class="scale-slider-container">
                    <input type="range" class="scale-slider" id="scale-${id}"
                        min="${min}" max="${max}" step="${step}" value="${defaultValue}"
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

    getExerciseTypeLabel(type) {
        const labels = {
            'multiple-choice': 'Multiple Choice', 'true-false': 'Richtig/Falsch',
            'fill-blank': 'Lückentext', 'matching': 'Zuordnung', 'ordering': 'Reihenfolge',
            'text-input': 'Freitext', 'scale': 'Bewertung', 'demo': 'Interaktive Demo'
        };
        return labels[type] || type;
    }
}

// Export for use in other modules
window.MarkdownParser = MarkdownParser;
