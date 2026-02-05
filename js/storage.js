/**
 * KI-AKADEMIE - Storage Manager
 * Handles user data, progress tracking, and persistence
 * Supports both LocalStorage and optional PHP backend
 */

class StorageManager {
    constructor() {
        this.storageKey = 'ki-akademie';
        this.useBackend = false; // Set to true if PHP backend is available
        this.backendUrl = 'php/api.php';
        
        this.data = {
            user: null,
            progress: {},
            exercises: {},
            completedSlides: [],
            currentSlide: 0,
            currentModule: 0,
            settings: {
                theme: 'dark',
                fontSize: 'normal',
                animations: true
            },
            timestamps: {
                started: null,
                lastActive: null
            }
        };
        
        this.init();
    }
    
    init() {
        this.load();
    }
    
    /**
     * Load data from storage
     */
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.data = { ...this.data, ...parsed };
            }
        } catch (e) {
            console.error('Error loading from storage:', e);
        }
    }
    
    /**
     * Save data to storage
     */
    save() {
        try {
            this.data.timestamps.lastActive = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            
            // Optionally sync to backend
            if (this.useBackend && this.data.user) {
                this.syncToBackend();
            }
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    }
    
    /**
     * Sync data to PHP backend
     */
    async syncToBackend() {
        if (!this.useBackend) return;
        
        try {
            const response = await fetch(this.backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'sync',
                    data: this.data
                })
            });
            
            if (!response.ok) {
                console.warn('Backend sync failed');
            }
        } catch (e) {
            console.warn('Backend sync error:', e);
        }
    }
    
    /**
     * Set user data
     */
    setUser(name) {
        this.data.user = {
            name: name,
            id: this.generateUserId(name),
            initials: this.getInitials(name)
        };
        
        if (!this.data.timestamps.started) {
            this.data.timestamps.started = new Date().toISOString();
        }
        
        this.save();
        return this.data.user;
    }
    
    /**
     * Get user data
     */
    getUser() {
        return this.data.user;
    }
    
    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.data.user !== null;
    }
    
    /**
     * Generate a user ID from name
     */
    generateUserId(name) {
        const timestamp = Date.now().toString(36);
        const nameHash = name.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0).toString(36);
        return `${nameHash}-${timestamp}`;
    }
    
    /**
     * Get initials from name
     */
    getInitials(name) {
        return name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }
    
    /**
     * Set current position
     */
    setPosition(moduleIndex, slideIndex) {
        this.data.currentModule = moduleIndex;
        this.data.currentSlide = slideIndex;
        this.save();
    }
    
    /**
     * Get current position
     */
    getPosition() {
        return {
            module: this.data.currentModule,
            slide: this.data.currentSlide
        };
    }
    
    /**
     * Mark slide as completed
     */
    completeSlide(slideId) {
        if (!this.data.completedSlides.includes(slideId)) {
            this.data.completedSlides.push(slideId);
            this.save();
        }
    }
    
    /**
     * Check if slide is completed
     */
    isSlideCompleted(slideId) {
        return this.data.completedSlides.includes(slideId);
    }
    
    /**
     * Get all completed slides
     */
    getCompletedSlides() {
        return this.data.completedSlides;
    }
    
    /**
     * Save exercise result
     */
    saveExerciseResult(exerciseId, result) {
        this.data.exercises[exerciseId] = {
            ...result,
            completedAt: new Date().toISOString()
        };
        this.save();
    }
    
    /**
     * Get exercise result
     */
    getExerciseResult(exerciseId) {
        return this.data.exercises[exerciseId] || null;
    }
    
    /**
     * Get all exercise results
     */
    getExerciseResults() {
        return this.data.exercises;
    }
    
    /**
     * Calculate overall progress
     */
    calculateProgress(totalSlides) {
        if (totalSlides === 0) return 0;
        return Math.round((this.data.completedSlides.length / totalSlides) * 100);
    }
    
    /**
     * Calculate exercise score
     */
    calculateExerciseScore() {
        const exercises = Object.values(this.data.exercises);
        if (exercises.length === 0) return { earned: 0, total: 0, percentage: 0 };
        
        const earned = exercises.reduce((sum, ex) => sum + (ex.points || 0), 0);
        const total = exercises.reduce((sum, ex) => sum + (ex.maxPoints || 10), 0);
        const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
        
        return { earned, total, percentage };
    }
    
    /**
     * Get time spent
     */
    getTimeSpent() {
        if (!this.data.timestamps.started) return 0;
        
        const started = new Date(this.data.timestamps.started);
        const now = new Date();
        const diffMs = now - started;
        
        return Math.round(diffMs / 1000 / 60); // Return minutes
    }
    
    /**
     * Get settings
     */
    getSettings() {
        return this.data.settings;
    }
    
    /**
     * Update settings
     */
    updateSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this.save();
    }
    
    /**
     * Export progress data
     */
    exportData() {
        return {
            user: this.data.user,
            progress: this.calculateProgress(100), // Would need actual total
            completedSlides: this.data.completedSlides.length,
            exerciseScore: this.calculateExerciseScore(),
            timeSpent: this.getTimeSpent(),
            exportedAt: new Date().toISOString()
        };
    }
    
    /**
     * Reset all data
     */
    reset() {
        this.data = {
            user: null,
            progress: {},
            exercises: {},
            completedSlides: [],
            currentSlide: 0,
            currentModule: 0,
            settings: this.data.settings, // Keep settings
            timestamps: {
                started: null,
                lastActive: null
            }
        };
        localStorage.removeItem(this.storageKey);
    }
    
    /**
     * Logout user (but keep some data)
     */
    logout() {
        this.data.user = null;
        this.save();
    }
}

// Create global storage instance
window.storage = new StorageManager();
