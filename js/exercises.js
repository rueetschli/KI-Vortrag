/**
 * KI-AKADEMIE - Exercise Handler
 * Manages all exercise interactions, validation, and scoring
 */

class ExerciseHandler {
    constructor() {
        this.exercises = new Map();
        this.results = new Map();
        this.totalPoints = 0;
        this.earnedPoints = 0;
        
        this.init();
    }
    
    init() {
        // Initialize after DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.bindGlobalEvents();
        });
    }
    
    bindGlobalEvents() {
        // Multiple choice selection
        document.addEventListener('click', (e) => {
            const mcOption = e.target.closest('.mc-option');
            if (mcOption) {
                this.selectMultipleChoice(mcOption);
            }
        });
        
        // Drag and drop for ordering
        this.initDragAndDrop();
    }
    
    /**
     * Register an exercise
     */
    registerExercise(id, type, data) {
        this.exercises.set(id, { type, data, answered: false });
        this.totalPoints += parseInt(data.points || 10);
    }
    
    /**
     * Select multiple choice option
     */
    selectMultipleChoice(option) {
        const container = option.closest('.mc-options');
        if (!container) return;
        
        // Don't allow changes after submission
        if (container.classList.contains('submitted')) return;
        
        // Deselect all options
        container.querySelectorAll('.mc-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Select clicked option
        option.classList.add('selected');
        
        // Check the radio button
        const radio = option.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
    }
    
    /**
     * Initialize drag and drop for ordering exercises
     */
    initDragAndDrop() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('ordering-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('ordering-item')) {
                e.target.classList.remove('dragging');
            }
        });
        
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            const list = e.target.closest('.ordering-list');
            if (!list) return;
            
            const dragging = document.querySelector('.ordering-item.dragging');
            if (!dragging) return;
            
            const siblings = [...list.querySelectorAll('.ordering-item:not(.dragging)')];
            const nextSibling = siblings.find(sibling => {
                const rect = sibling.getBoundingClientRect();
                return e.clientY < rect.top + rect.height / 2;
            });
            
            list.insertBefore(dragging, nextSibling);
            this.updateOrderingNumbers(list);
        });
    }
    
    /**
     * Update ordering numbers after drag
     */
    updateOrderingNumbers(list) {
        list.querySelectorAll('.ordering-item').forEach((item, index) => {
            const numberSpan = item.querySelector('.ordering-number');
            if (numberSpan) numberSpan.textContent = index + 1;
        });
    }
    
    /**
     * Check exercise answer
     */
    checkExercise(exerciseId) {
        const card = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
        if (!card) return;
        
        const type = card.dataset.type;
        const points = parseInt(card.dataset.points || 10);
        
        let isCorrect = false;
        let feedback = '';
        
        switch (type) {
            case 'multiple-choice':
                isCorrect = this.checkMultipleChoice(card);
                break;
            case 'true-false':
                isCorrect = this.checkTrueFalse(card);
                break;
            case 'fill-blank':
                isCorrect = this.checkFillBlank(card);
                break;
            case 'matching':
                isCorrect = this.checkMatching(card);
                break;
            case 'ordering':
                isCorrect = this.checkOrdering(card);
                break;
            case 'text-input':
                isCorrect = this.checkTextInput(card);
                break;
            case 'scale':
                isCorrect = true; // Scale exercises are always "correct"
                break;
        }
        
        // Detect survey mode (MC with correct: "*")
        const isSurvey = type === 'multiple-choice' &&
            card.querySelector('.mc-options')?.dataset.correct === '*';

        // Show feedback
        this.showFeedback(exerciseId, isCorrect, points, isSurvey);

        // Record result
        this.results.set(exerciseId, { correct: isCorrect, points: isCorrect ? points : 0 });
        
        // Update score
        if (isCorrect) {
            this.earnedPoints += points;
        }
        
        // Trigger event for progress tracking
        window.dispatchEvent(new CustomEvent('exerciseCompleted', {
            detail: { exerciseId, isCorrect, points }
        }));
        
        return isCorrect;
    }
    
    /**
     * Check multiple choice answer
     * Supports correct: "*" as wildcard (survey mode – every answer is accepted)
     */
    checkMultipleChoice(card) {
        const container = card.querySelector('.mc-options');
        if (!container) return false;

        const correct = container.dataset.correct;
        const selected = container.querySelector('.mc-option.selected');

        if (!selected) {
            this.showNotification('Bitte wählen Sie eine Antwort aus.', 'warning');
            return false;
        }

        const selectedValue = selected.dataset.value;
        const isSurvey = correct === '*';
        const isCorrect = isSurvey || selectedValue === correct;

        // Mark container as submitted
        container.classList.add('submitted');

        if (isSurvey) {
            // Survey mode: just highlight the chosen answer, no right/wrong
            selected.classList.add('correct');
        } else {
            // Quiz mode: show correct/incorrect styling
            container.querySelectorAll('.mc-option').forEach(option => {
                if (option.dataset.value === correct) {
                    option.classList.add('correct');
                } else if (option.classList.contains('selected') && option.dataset.value !== correct) {
                    option.classList.add('incorrect');
                }
            });
        }

        return isCorrect;
    }
    
    /**
     * Check true/false answer
     */
    checkTrueFalse(card) {
        const container = card.querySelector('.tf-options');
        if (!container) return false;
        
        const correct = container.dataset.correct;
        const selected = container.querySelector('.tf-option.selected');
        
        if (!selected) {
            this.showNotification('Bitte wählen Sie eine Antwort aus.', 'warning');
            return false;
        }
        
        const selectedValue = selected.dataset.value;
        return selectedValue === correct;
    }
    
    /**
     * Check fill in the blank answers
     */
    checkFillBlank(card) {
        const blanks = card.querySelectorAll('.fill-blank');
        let allCorrect = true;
        
        blanks.forEach(blank => {
            const answer = blank.dataset.answer.toLowerCase().trim();
            const userAnswer = blank.value.toLowerCase().trim();
            
            if (userAnswer === answer) {
                blank.classList.add('correct');
                blank.classList.remove('incorrect');
            } else {
                blank.classList.add('incorrect');
                blank.classList.remove('correct');
                allCorrect = false;
            }
        });
        
        return allCorrect;
    }
    
    /**
     * Check matching exercise
     */
    checkMatching(card) {
        const matches = card.querySelectorAll('.matching-item.matched');
        const pairs = card.querySelectorAll('.matching-item.left');
        
        if (matches.length < pairs.length * 2) {
            this.showNotification('Bitte ordnen Sie alle Paare zu.', 'warning');
            return false;
        }
        
        // Check logic would go here - simplified for now
        return true;
    }
    
    /**
     * Check ordering exercise
     */
    checkOrdering(card) {
        const items = card.querySelectorAll('.ordering-item');
        let allCorrect = true;
        
        items.forEach((item, index) => {
            const correctIndex = parseInt(item.dataset.correctIndex);
            if (correctIndex !== index) {
                allCorrect = false;
            }
        });
        
        return allCorrect;
    }
    
    /**
     * Check text input (basic validation)
     */
    checkTextInput(card) {
        const textarea = card.querySelector('.text-input-area');
        if (!textarea) return false;
        
        const minLength = parseInt(textarea.getAttribute('minlength') || 10);
        const text = textarea.value.trim();
        
        if (text.length < minLength) {
            this.showNotification(`Bitte geben Sie mindestens ${minLength} Zeichen ein.`, 'warning');
            return false;
        }
        
        return true;
    }
    
    /**
     * Show feedback for an exercise
     */
    showFeedback(exerciseId, isCorrect, points, isSurvey = false) {
        const feedbackContainer = document.getElementById(`feedback-${exerciseId}`);
        if (!feedbackContainer) return;

        const feedbackClass = isCorrect ? 'correct' : 'incorrect';
        const icon = isCorrect ?
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' :
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

        let title, message;
        if (isSurvey) {
            title = 'Danke!';
            message = 'Ihre Antwort wurde erfasst.';
        } else if (isCorrect) {
            title = 'Richtig!';
            message = `Sehr gut! Sie haben ${points} Punkte verdient.`;
        } else {
            title = 'Nicht ganz richtig';
            message = 'Schauen Sie sich die richtige Antwort an und versuchen Sie es beim nächsten Mal erneut.';
        }

        feedbackContainer.className = `exercise-feedback ${feedbackClass}`;
        feedbackContainer.innerHTML = `
            <div class="feedback-header">
                <span class="feedback-icon">${icon}</span>
                <span class="feedback-title">${title}</span>
            </div>
            <p class="feedback-text">${message}</p>
        `;
        feedbackContainer.style.display = 'block';
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        } else {
            alert(message);
        }
    }
    
    /**
     * Get current score
     */
    getScore() {
        return {
            earned: this.earnedPoints,
            total: this.totalPoints,
            percentage: this.totalPoints > 0 ? Math.round((this.earnedPoints / this.totalPoints) * 100) : 0
        };
    }
    
    /**
     * Reset all exercises
     */
    reset() {
        this.results.clear();
        this.earnedPoints = 0;
        
        // Reset UI
        document.querySelectorAll('.mc-options').forEach(container => {
            container.classList.remove('submitted');
            container.querySelectorAll('.mc-option').forEach(option => {
                option.classList.remove('selected', 'correct', 'incorrect');
            });
        });
        
        document.querySelectorAll('.exercise-feedback').forEach(feedback => {
            feedback.style.display = 'none';
        });
    }
}

// Global exercise handler instance
window.exerciseHandler = new ExerciseHandler();

// Global functions for inline event handlers
window.checkExercise = function(exerciseId) {
    window.exerciseHandler.checkExercise(exerciseId);
};

window.toggleHint = function(exerciseId) {
    const hint = document.getElementById(`hint-${exerciseId}`);
    if (hint) {
        hint.classList.toggle('visible');
    }
};

window.selectTrueFalse = function(element) {
    const container = element.closest('.tf-options');
    if (!container) return;
    
    container.querySelectorAll('.tf-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    element.classList.add('selected');
};

window.updateCharCounter = function(textarea, maxLength) {
    const counter = document.getElementById(`counter-${textarea.id.replace('text-', '')}`);
    if (counter) {
        const length = textarea.value.length;
        counter.textContent = length;
        
        const counterContainer = counter.closest('.char-counter');
        if (counterContainer) {
            counterContainer.classList.remove('warning', 'error');
            if (length > maxLength * 0.9) {
                counterContainer.classList.add('error');
            } else if (length > maxLength * 0.75) {
                counterContainer.classList.add('warning');
            }
        }
    }
};

window.updateScaleValue = function(id, value) {
    const display = document.getElementById(`scale-value-${id}`);
    if (display) {
        display.textContent = value;
    }
};

window.selectMatching = function(element, side) {
    const container = element.closest('.matching-container');
    if (!container) return;
    
    const column = container.querySelector(`.${side}-column`);
    column.querySelectorAll('.matching-item').forEach(item => {
        item.classList.remove('selected');
    });
    element.classList.add('selected');
    
    // Check if we have a pair selected
    const leftSelected = container.querySelector('.left-column .matching-item.selected');
    const rightSelected = container.querySelector('.right-column .matching-item.selected');
    
    if (leftSelected && rightSelected) {
        // Mark as matched
        leftSelected.classList.add('matched');
        rightSelected.classList.add('matched');
        leftSelected.classList.remove('selected');
        rightSelected.classList.remove('selected');
    }
};

window.sendDemoMessage = function(id) {
    const input = document.getElementById(`demo-input-${id}`);
    const chat = document.getElementById(`chat-${id}`);
    
    if (!input || !chat) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    chat.innerHTML += `
        <div class="chat-message user">
            <div class="chat-avatar">Du</div>
            <div class="chat-bubble">${escapeHtml(message)}</div>
        </div>
    `;
    
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            'Das ist eine interessante Frage! KI-Systeme wie ich arbeiten mit statistischen Modellen, um Muster in Daten zu erkennen und darauf basierend Antworten zu generieren.',
            'Gute Frage! In der Praxis wird KI für viele Aufgaben eingesetzt, von der Textverarbeitung bis zur Bildanalyse.',
            'Das hängt von verschiedenen Faktoren ab. Moderne KI-Modelle werden auf grossen Datenmengen trainiert und können dadurch komplexe Zusammenhänge verstehen.',
            'Interessant! KI entwickelt sich ständig weiter. Wichtig ist, dass wir sie verantwortungsvoll einsetzen und ihre Grenzen kennen.'
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        chat.innerHTML += `
            <div class="chat-message ai">
                <div class="chat-avatar">KI</div>
                <div class="chat-bubble">${response}</div>
            </div>
        `;
        
        chat.scrollTop = chat.scrollHeight;
    }, 1000);
    
    chat.scrollTop = chat.scrollHeight;
};

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
