/**
 * KI-AKADEMIE - Embedded Content Part 1
 * Module 1: Einführung & Module 2: KI-Landschaft
 */

function getModule1() {
    return {
        id: 'modul-1',
        title: 'Willkommen & Einführung',
        duration: '30',
        slides: [
            {
                id: 'm1-s1',
                type: 'title',
                title: 'Willkommen',
                content: `
                    <h1>Künstliche Intelligenz</h1>
                    <p style="font-size: 1.5rem; color: var(--gray-300); margin-bottom: 2rem;">Einführungsmodul für Büro-, Marketing- und Verkaufsleiter</p>
                    <div style="display: flex; gap: 2rem; justify-content: center; margin-top: 3rem;">
                        <div class="stat-item">
                            <span class="stat-number">6</span>
                            <span class="stat-label">Stunden</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">6</span>
                            <span class="stat-label">Module</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">12+</span>
                            <span class="stat-label">Übungen</span>
                        </div>
                    </div>
                `
            },
            {
                id: 'm1-s2',
                type: 'content',
                title: 'Lernziele',
                content: `
                    <h2>Was Sie heute lernen werden</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                        <div class="info-box">
                            <h4>🤖 KI-Grundlagen</h4>
                            <p>Verstehen Sie die verschiedenen Arten von KI und wie sie funktionieren.</p>
                        </div>
                        <div class="info-box">
                            <h4>📜 Geschichte</h4>
                            <p>Von Turing bis ChatGPT - 80 Jahre KI-Entwicklung.</p>
                        </div>
                        <div class="info-box">
                            <h4>⚖️ Recht & Ethik</h4>
                            <p>Schweizer Datenschutz, EU AI Act und ethische Grundsätze.</p>
                        </div>
                        <div class="info-box">
                            <h4>💼 Praxis</h4>
                            <p>Konkrete Anwendungsfälle für Marketing, Vertrieb und Büro.</p>
                        </div>
                    </div>
                `
            },
            {
                id: 'm1-s3',
                type: 'content',
                title: 'KI-Revolution',
                content: `
                    <h2>Die KI-Revolution in Zahlen</h2>
                    <blockquote>
                        <p>ChatGPT erreichte 100 Millionen Nutzer in nur 2 Monaten – schneller als jede Technologie zuvor.</p>
                    </blockquote>
                    <p>Die künstliche Intelligenz hat sich innerhalb von drei Jahren von einer akademischen Kuriosität zum unverzichtbaren Geschäftswerkzeug entwickelt.</p>
                    <div class="warning-box" style="margin-top: 1.5rem;">
                        <h4>Aktuelle Statistiken:</h4>
                        <p><strong>90%</strong> der Organisationen nutzen KI in mindestens einer Funktion</p>
                        <p><strong>75%</strong> aller Wissensarbeiter setzen heute KI-Tools im Beruf ein</p>
                        <p><strong>79%</strong> der Führungskräfte sagen, ihr Unternehmen braucht KI um wettbewerbsfähig zu bleiben</p>
                    </div>
                `
            },
            {
                id: 'm1-s4',
                type: 'exercise',
                title: 'Einstiegs-Quiz',
                content: `
                    <h2>Wie gut kennen Sie sich mit KI aus?</h2>
                    <div class="exercise-card" data-exercise-id="quiz-1" data-type="multiple-choice" data-points="10">
                        <div class="exercise-header">
                            <span class="exercise-type">Multiple Choice</span>
                            <span class="exercise-points">10 Punkte</span>
                        </div>
                        <h4 class="exercise-title">Was bedeutet "GPT" in ChatGPT?</h4>
                        <div class="exercise-content">
                            <div class="mc-options" data-correct="C">
                                <label class="mc-option" data-value="A">
                                    <input type="radio" name="quiz-1" value="A">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>A.</strong> General Purpose Technology</span>
                                </label>
                                <label class="mc-option" data-value="B">
                                    <input type="radio" name="quiz-1" value="B">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>B.</strong> Graphical Processing Terminal</span>
                                </label>
                                <label class="mc-option" data-value="C">
                                    <input type="radio" name="quiz-1" value="C">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>C.</strong> Generative Pre-trained Transformer</span>
                                </label>
                                <label class="mc-option" data-value="D">
                                    <input type="radio" name="quiz-1" value="D">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>D.</strong> Global Processing Tool</span>
                                </label>
                            </div>
                        </div>
                        <div class="exercise-actions">
                            <button class="button primary" onclick="checkExercise('quiz-1')">Antwort prüfen</button>
                        </div>
                        <div class="exercise-feedback" id="feedback-quiz-1"></div>
                    </div>
                `
            }
        ]
    };
}

function getModule2() {
    return {
        id: 'modul-2',
        title: 'Die KI-Landschaft 2025',
        duration: '60',
        slides: [
            {
                id: 'm2-s1',
                type: 'title',
                title: 'KI-Landschaft',
                content: `
                    <h1>Die KI-Landschaft 2025</h1>
                    <p style="font-size: 1.25rem; color: var(--gray-300);">Welche KI-Systeme gibt es und wie unterscheiden sie sich?</p>
                `
            },
            {
                id: 'm2-s2',
                type: 'content',
                title: 'KI-Kategorien',
                content: `
                    <h2>Die 6 Hauptkategorien der KI</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                        <div class="info-box">
                            <h4>🎨 Generative KI</h4>
                            <p>Erstellt neue Inhalte: Text, Bilder, Audio, Video. Beispiele: ChatGPT, Midjourney, DALL-E</p>
                        </div>
                        <div class="info-box">
                            <h4>📊 Machine Learning</h4>
                            <p>Lernt aus Daten für Vorhersagen und Klassifikation. Arbeitet im Hintergrund vieler Business-Apps.</p>
                        </div>
                        <div class="info-box">
                            <h4>👁️ Computer Vision</h4>
                            <p>Versteht Bilder und Videos. Qualitätskontrolle, Gesichtserkennung, Dokumentenverarbeitung.</p>
                        </div>
                        <div class="info-box">
                            <h4>💬 NLP - Sprachverarbeitung</h4>
                            <p>Versteht menschliche Sprache. Chatbots, Übersetzung, Sentiment-Analyse.</p>
                        </div>
                        <div class="info-box">
                            <h4>🤖 KI-Agenten</h4>
                            <p>Autonome Systeme für mehrstufige Aufgaben. Der grosse Trend 2025!</p>
                        </div>
                        <div class="info-box">
                            <h4>🔊 Audio-KI</h4>
                            <p>Spracherkennung, Text-to-Speech, Musik-Generierung. ElevenLabs, Whisper.</p>
                        </div>
                    </div>
                `
            },
            {
                id: 'm2-s3',
                type: 'content',
                title: 'Tool-Vergleich',
                content: `
                    <h2>Die grossen KI-Tools im Vergleich</h2>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                            <thead>
                                <tr style="border-bottom: 2px solid var(--accent);">
                                    <th style="text-align: left; padding: 1rem; color: var(--accent);">Tool</th>
                                    <th style="text-align: left; padding: 1rem; color: var(--accent);">Stärken</th>
                                    <th style="text-align: left; padding: 1rem; color: var(--accent);">Preis/Monat</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid var(--glass-border);">
                                    <td style="padding: 1rem;"><strong>ChatGPT</strong></td>
                                    <td style="padding: 1rem;">Allrounder, Coding, DALL-E integriert</td>
                                    <td style="padding: 1rem;">$20 (Plus)</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--glass-border);">
                                    <td style="padding: 1rem;"><strong>Claude</strong></td>
                                    <td style="padding: 1rem;">200K Kontext, beste Schreibqualität</td>
                                    <td style="padding: 1rem;">$20 (Pro)</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--glass-border);">
                                    <td style="padding: 1rem;"><strong>Microsoft Copilot</strong></td>
                                    <td style="padding: 1rem;">Office-Integration, Enterprise-ready</td>
                                    <td style="padding: 1rem;">$21-30</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--glass-border);">
                                    <td style="padding: 1rem;"><strong>Google Gemini</strong></td>
                                    <td style="padding: 1rem;">Multimodal, Google Workspace</td>
                                    <td style="padding: 1rem;">ab $14</td>
                                </tr>
                                <tr>
                                    <td style="padding: 1rem;"><strong>Perplexity</strong></td>
                                    <td style="padding: 1rem;">Recherche mit Quellenangaben</td>
                                    <td style="padding: 1rem;">$20</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `
            },
            {
                id: 'm2-s4',
                type: 'content',
                title: 'Bildgenerierung',
                content: `
                    <h2>Bildgenerierung für Marketing</h2>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem;">
                        <div class="info-box" style="text-align: center;">
                            <h3 style="color: var(--accent);">Midjourney</h3>
                            <p style="font-size: 2rem; margin: 1rem 0;">🎨</p>
                            <p><strong>Beste Qualität</strong></p>
                            <p>Künstlerisch, emotional, ab $10/Monat</p>
                        </div>
                        <div class="info-box" style="text-align: center;">
                            <h3 style="color: var(--accent);">DALL-E 3</h3>
                            <p style="font-size: 2rem; margin: 1rem 0;">📝</p>
                            <p><strong>Beste Prompt-Treue</strong></p>
                            <p>Text in Bildern, in ChatGPT Plus</p>
                        </div>
                        <div class="info-box" style="text-align: center;">
                            <h3 style="color: var(--accent);">Stable Diffusion</h3>
                            <p style="font-size: 2rem; margin: 1rem 0;">🔧</p>
                            <p><strong>Open Source</strong></p>
                            <p>Maximale Kontrolle, kostenlos</p>
                        </div>
                    </div>
                `
            },
            {
                id: 'm2-s5',
                type: 'content',
                title: 'Trends 2025',
                content: `
                    <h2>Die 3 grossen KI-Trends 2025</h2>
                    <div class="warning-box">
                        <h3>1. KI-Agenten 🤖</h3>
                        <p>Autonome Systeme, die mehrstufige Aufgaben selbstständig ausführen. <strong>23%</strong> der Organisationen skalieren bereits Agentic AI. Bis 2029 werden <strong>80%</strong> der Kundenservice-Anfragen autonom gelöst.</p>
                    </div>
                    <div class="info-box" style="margin-top: 1rem;">
                        <h3>2. Multimodale KI 🎭</h3>
                        <p>Verarbeitet Text, Bilder, Audio und Video gleichzeitig. Markt wächst von $2.4 Mrd. auf $98.9 Mrd. bis 2037.</p>
                    </div>
                    <div class="success-box" style="margin-top: 1rem;">
                        <h3>3. Small Language Models 📱</h3>
                        <p>KI direkt auf dem Gerät, ohne Internet. 10-100x niedrigere Kosten, ideal für datenschutzsensitive Anwendungen.</p>
                    </div>
                `
            },
            {
                id: 'm2-s6',
                type: 'exercise',
                title: 'Tool-Zuordnung',
                content: `
                    <h2>Übung: Welches Tool für welchen Zweck?</h2>
                    <div class="exercise-card" data-exercise-id="tool-match" data-type="multiple-choice" data-points="15">
                        <div class="exercise-header">
                            <span class="exercise-type">Multiple Choice</span>
                            <span class="exercise-points">15 Punkte</span>
                        </div>
                        <h4 class="exercise-title">Sie müssen ein langes Dokument (150 Seiten) analysieren und zusammenfassen. Welches Tool eignet sich am besten?</h4>
                        <div class="exercise-content">
                            <div class="mc-options" data-correct="B">
                                <label class="mc-option" data-value="A">
                                    <input type="radio" name="tool-match" value="A">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>A.</strong> ChatGPT (Free) - Hat ein 8K Token Limit</span>
                                </label>
                                <label class="mc-option" data-value="B">
                                    <input type="radio" name="tool-match" value="B">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>B.</strong> Claude - Hat ein 200K Token Kontextfenster</span>
                                </label>
                                <label class="mc-option" data-value="C">
                                    <input type="radio" name="tool-match" value="C">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>C.</strong> Midjourney - Spezialisiert auf Bildgenerierung</span>
                                </label>
                                <label class="mc-option" data-value="D">
                                    <input type="radio" name="tool-match" value="D">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>D.</strong> Perplexity - Optimiert für Web-Recherche</span>
                                </label>
                            </div>
                        </div>
                        <div class="exercise-actions">
                            <button class="button primary" onclick="checkExercise('tool-match')">Antwort prüfen</button>
                        </div>
                        <div class="exercise-feedback" id="feedback-tool-match"></div>
                    </div>
                `
            }
        ]
    };
}
