/**
 * KI-AKADEMIE - Embedded Content Part 2
 * Module 3: Geschichte & Module 4: Recht Schweiz
 */

function getModule3() {
    return {
        id: 'modul-3',
        title: 'Geschichte der KI',
        duration: '45',
        slides: [
            {
                id: 'm3-s1',
                type: 'title',
                title: 'Geschichte',
                content: `
                    <h1>Von Turing bis ChatGPT</h1>
                    <p style="font-size: 1.25rem; color: var(--gray-300);">80 Jahre KI-Geschichte in Schlüsselmomenten</p>
                `
            },
            {
                id: 'm3-s2',
                type: 'content',
                title: 'Die Anfänge',
                content: `
                    <h2>Die theoretischen Grundlagen (1943-1960)</h2>
                    <div class="info-box">
                        <h4>1943 - Das erste künstliche Neuron</h4>
                        <p>McCulloch & Pitts entwickeln das erste mathematische Modell eines Neurons.</p>
                    </div>
                    <div class="warning-box" style="margin-top: 1rem;">
                        <h4>1950 - Alan Turing: "Können Maschinen denken?"</h4>
                        <p>Der berühmte Turing-Test: Wenn ein Computer einen Menschen im Textgespräch davon überzeugen kann, ein Mensch zu sein, zeigt er "Maschinenintelligenz".</p>
                        <p style="margin-top: 0.5rem;"><strong>Fun Fact:</strong> 2025 wurde GPT-4.5 in 73% der Fälle für einen Menschen gehalten!</p>
                    </div>
                    <div class="success-box" style="margin-top: 1rem;">
                        <h4>1956 - Die Dartmouth-Konferenz</h4>
                        <p>Geburtsstunde der KI als Forschungsfeld. John McCarthy prägt den Begriff "Artificial Intelligence".</p>
                    </div>
                `
            },
            {
                id: 'm3-s3',
                type: 'content',
                title: 'KI-Winter',
                content: `
                    <h2>Die KI-Winter: Wenn der Hype abkühlt</h2>
                    <p>Die KI-Geschichte zeigt ein Muster aus Euphorie und Ernüchterung:</p>
                    <div style="margin: 2rem 0; padding: 1rem; border-left: 4px solid var(--error);">
                        <h4 style="color: var(--error);">1. KI-Winter (1974-1980)</h4>
                        <p>Der Lighthill-Bericht urteilt: KI hat "völliges Versagen" erreicht. Grossbritannien streicht alle Forschungsgelder.</p>
                    </div>
                    <div style="margin: 2rem 0; padding: 1rem; border-left: 4px solid var(--warning);">
                        <h4 style="color: var(--warning);">Boom der Expertensysteme (1980-1987)</h4>
                        <p>Unternehmen investieren über $1 Milliarde jährlich. XCON spart DEC $40 Millionen.</p>
                    </div>
                    <div style="margin: 2rem 0; padding: 1rem; border-left: 4px solid var(--error);">
                        <h4 style="color: var(--error);">2. KI-Winter (1987-1993)</h4>
                        <p>Desktop-Computer machen teure KI-Hardware obsolet. Der Markt bricht zusammen.</p>
                    </div>
                `
            },
            {
                id: 'm3-s4',
                type: 'content',
                title: 'Deep Learning',
                content: `
                    <h2>Der Durchbruch: Deep Learning (2012)</h2>
                    <blockquote>
                        <p>"Ein eindeutiger Wendepunkt in der Geschichte des maschinellen Sehens." - Yann LeCun</p>
                    </blockquote>
                    <div class="success-box">
                        <h4>30. September 2012 - AlexNet gewinnt ImageNet</h4>
                        <p>Fehlerrate sinkt von 26% auf <strong>15.3%</strong> - ein Sprung von über 10 Prozentpunkten!</p>
                        <p style="margin-top: 0.5rem;">Trainiert auf nur 2 Gaming-GPUs in einem Elternhaus. Google kauft das Startup kurz darauf.</p>
                    </div>
                    <div class="info-box" style="margin-top: 1.5rem;">
                        <h4>März 2016 - AlphaGo besiegt Lee Sedol</h4>
                        <p>Go hat mehr mögliche Stellungen als Atome im Universum (10<sup>170</sup>). Experten dachten, KI sei noch Jahrzehnte entfernt.</p>
                        <p style="margin-top: 0.5rem;"><strong>"Zug 37"</strong> - Ein Zug mit 1:10.000 Wahrscheinlichkeit, der Jahrhunderte von Go-Strategie auf den Kopf stellte.</p>
                    </div>
                `
            },
            {
                id: 'm3-s5',
                type: 'content',
                title: 'Transformer',
                content: `
                    <h2>Die Transformer-Revolution (2017)</h2>
                    <div class="warning-box">
                        <h4>"Attention Is All You Need"</h4>
                        <p>Das Paper von 8 Google-Forschern im Juni 2017 veränderte alles. Das "T" in GPT, BERT und ChatGPT steht für <strong>Transformer</strong>.</p>
                    </div>
                    <h3 style="margin-top: 2rem;">Die GPT-Evolution:</h3>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem;">
                        <div style="text-align: center; padding: 1rem; background: var(--glass-bg); border-radius: var(--radius-lg);">
                            <p style="font-size: 0.875rem; color: var(--gray-400);">2018</p>
                            <p style="font-weight: 600;">GPT-1</p>
                            <p style="font-size: 0.875rem;">117M Parameter</p>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: var(--glass-bg); border-radius: var(--radius-lg);">
                            <p style="font-size: 0.875rem; color: var(--gray-400);">2019</p>
                            <p style="font-weight: 600;">GPT-2</p>
                            <p style="font-size: 0.875rem;">1.5B Parameter</p>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: var(--glass-bg); border-radius: var(--radius-lg);">
                            <p style="font-size: 0.875rem; color: var(--gray-400);">2020</p>
                            <p style="font-weight: 600;">GPT-3</p>
                            <p style="font-size: 0.875rem;">175B Parameter</p>
                        </div>
                        <div style="text-align: center; padding: 1rem; background: linear-gradient(135deg, var(--accent), var(--secondary)); border-radius: var(--radius-lg);">
                            <p style="font-size: 0.875rem; color: var(--primary-dark);">2022</p>
                            <p style="font-weight: 600; color: var(--primary-dark);">ChatGPT</p>
                            <p style="font-size: 0.875rem; color: var(--primary-dark);">100M Nutzer in 2 Monaten!</p>
                        </div>
                    </div>
                `
            },
            {
                id: 'm3-s6',
                type: 'exercise',
                title: 'Geschichte-Quiz',
                content: `
                    <h2>Übung: KI-Geschichte</h2>
                    <div class="exercise-card" data-exercise-id="history-quiz" data-type="multiple-choice" data-points="10">
                        <div class="exercise-header">
                            <span class="exercise-type">Multiple Choice</span>
                        </div>
                        <h4 class="exercise-title">In welchem Jahr wurde ChatGPT veröffentlicht?</h4>
                        <div class="exercise-content">
                            <div class="mc-options" data-correct="C">
                                <label class="mc-option" data-value="A">
                                    <input type="radio" name="history-quiz" value="A">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>A.</strong> 2020</span>
                                </label>
                                <label class="mc-option" data-value="B">
                                    <input type="radio" name="history-quiz" value="B">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>B.</strong> 2021</span>
                                </label>
                                <label class="mc-option" data-value="C">
                                    <input type="radio" name="history-quiz" value="C">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>C.</strong> 2022 (30. November)</span>
                                </label>
                                <label class="mc-option" data-value="D">
                                    <input type="radio" name="history-quiz" value="D">
                                    <span class="mc-indicator"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                                    <span class="mc-text"><strong>D.</strong> 2023</span>
                                </label>
                            </div>
                        </div>
                        <div class="exercise-actions">
                            <button class="button primary" onclick="checkExercise('history-quiz')">Antwort prüfen</button>
                        </div>
                        <div class="exercise-feedback" id="feedback-history-quiz"></div>
                    </div>
                `
            }
        ]
    };
}

function getModule4() {
    return {
        id: 'modul-4',
        title: 'Recht & Datenschutz Schweiz',
        duration: '60',
        slides: [
            {
                id: 'm4-s1',
                type: 'title',
                title: 'Recht Schweiz',
                content: `
                    <h1>Rechtliche Situation in der Schweiz</h1>
                    <p style="font-size: 1.25rem; color: var(--gray-300);">nDSG, EU AI Act und Compliance-Praxis</p>
                `
            },
            {
                id: 'm4-s2',
                type: 'content',
                title: 'Schweizer Ansatz',
                content: `
                    <h2>Der Schweizer Ansatz zur KI-Regulierung</h2>
                    <div class="warning-box">
                        <h4>Kein "Swiss AI Act"</h4>
                        <p>Der Bundesrat hat im Februar 2025 klargestellt: Die Schweiz wird <strong>kein</strong> umfassendes KI-Gesetz einführen.</p>
                    </div>
                    <p style="margin-top: 1.5rem;">Stattdessen: <strong>Pragmatischer, sektorspezifischer Ansatz</strong></p>
                    <ul>
                        <li>Das <strong>nDSG</strong> (neues Datenschutzgesetz) regelt die meisten KI-relevanten Aspekte</li>
                        <li>Sektorspezifische Vorschriften (z.B. FINMA für Finanzbranche)</li>
                        <li>Freiwillige Rahmenwerke und Selbstregulierung</li>
                    </ul>
                    <div class="info-box" style="margin-top: 1.5rem;">
                        <p>Der EDÖB bestätigte im November 2023: Das Datenschutzgesetz ist <strong>"direkt auf KI anwendbar"</strong>.</p>
                    </div>
                `
            },
            {
                id: 'm4-s3',
                type: 'content',
                title: 'nDSG Kernpunkte',
                content: `
                    <h2>Das nDSG und KI - Die wichtigsten Punkte</h2>
                    <div style="display: grid; gap: 1rem;">
                        <div class="info-box">
                            <h4>📋 Transparenzpflichten (Art. 19-21)</h4>
                            <p>Offenlegung von Zweck, Funktionsweise und Datenquellen. Betroffene müssen erkennen können, wenn sie mit KI interagieren.</p>
                        </div>
                        <div class="warning-box">
                            <h4>🤖 Automatisierte Einzelentscheidungen (Art. 21)</h4>
                            <p>Wenn eine KI-Entscheidung <strong>rechtliche Wirkungen</strong> hat oder die Person <strong>erheblich beeinträchtigt</strong>:</p>
                            <ul>
                                <li>Information über die automatisierte Entscheidung</li>
                                <li>Recht auf Darlegung des eigenen Standpunkts</li>
                                <li>Recht auf Überprüfung durch eine natürliche Person</li>
                            </ul>
                        </div>
                        <div class="success-box">
                            <h4>📊 Profiling & Hochrisiko-Profiling</h4>
                            <p>Bewertung persönlicher Aspekte (Arbeitsleistung, Gesundheit, Verhalten, Standort). Bei <strong>Hochrisiko-Profiling</strong>: Ausdrückliche Einwilligung erforderlich!</p>
                        </div>
                    </div>
                `
            },
            {
                id: 'm4-s4',
                type: 'content',
                title: 'DSFA',
                content: `
                    <h2>Datenschutz-Folgenabschätzung (DSFA)</h2>
                    <div class="warning-box">
                        <h4>Wann ist eine DSFA obligatorisch?</h4>
                        <p>Bei Verarbeitungen mit <strong>hohem Risiko</strong> für Persönlichkeit oder Grundrechte - insbesondere bei:</p>
                        <ul>
                            <li>Neuen Technologien (wie KI)</li>
                            <li>Umfangreicher Verarbeitung sensibler Daten</li>
                            <li>Systematischer Überwachung öffentlicher Bereiche</li>
                        </ul>
                    </div>
                    <div class="info-box" style="margin-top: 1.5rem;">
                        <h4>Die DSFA muss enthalten:</h4>
                        <ol>
                            <li>Beschreibung der geplanten Verarbeitung</li>
                            <li>Bewertung der Risiken</li>
                            <li>Dokumentation der Schutzmassnahmen</li>
                        </ol>
                        <p style="margin-top: 1rem;"><strong>Bei hohem Restrisiko:</strong> EDÖB vor Verarbeitungsbeginn konsultieren!</p>
                    </div>
                `
            },
            {
                id: 'm4-s5',
                type: 'content',
                title: 'EU AI Act',
                content: `
                    <h2>Der EU AI Act und Schweizer Unternehmen</h2>
                    <p>In Kraft seit 1. August 2024 - betrifft auch die Schweiz!</p>
                    <div style="margin: 2rem 0;">
                        <h4>Risikobasierte Kategorien:</h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;">
                            <div style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--error); border-radius: var(--radius-lg);">
                                <p style="color: var(--error); font-weight: 600;">🚫 Verboten</p>
                                <p style="font-size: 0.875rem;">Social Scoring, manipulative KI, biometrische Echtzeit-Identifikation</p>
                            </div>
                            <div style="padding: 1rem; background: rgba(245, 158, 11, 0.1); border: 1px solid var(--warning); border-radius: var(--radius-lg);">
                                <p style="color: var(--warning); font-weight: 600;">⚠️ Hochrisiko</p>
                                <p style="font-size: 0.875rem;">Personalscreening, Kreditscoring, medizinische Diagnostik</p>
                            </div>
                            <div style="padding: 1rem; background: rgba(59, 130, 246, 0.1); border: 1px solid var(--info); border-radius: var(--radius-lg);">
                                <p style="color: var(--info); font-weight: 600;">ℹ️ Limitiertes Risiko</p>
                                <p style="font-size: 0.875rem;">Chatbots, Deepfakes - Transparenzpflicht</p>
                            </div>
                            <div style="padding: 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success); border-radius: var(--radius-lg);">
                                <p style="color: var(--success); font-weight: 600;">✓ Minimal</p>
                                <p style="font-size: 0.875rem;">Spam-Filter, Videospiele - unreguliert</p>
                            </div>
                        </div>
                    </div>
                    <div class="warning-box">
                        <p><strong>Sanktionen:</strong> Bis zu 35 Mio. € oder 7% des globalen Jahresumsatzes!</p>
                    </div>
                `
            },
            {
                id: 'm4-s6',
                type: 'content',
                title: 'Compliance Checkliste',
                content: `
                    <h2>Compliance-Checkliste für Schweizer KMU</h2>
                    <div class="success-box">
                        <h4>✅ Sofort umsetzen:</h4>
                        <ul>
                            <li>Alle KI-Systeme mit Personendaten überprüfen</li>
                            <li>Datenschutzerklärung um KI-Nutzung ergänzen</li>
                            <li>Mechanismen für Transparenz bei automatisierten Entscheidungen</li>
                            <li>Prozesse für Anträge auf menschliche Überprüfung</li>
                        </ul>
                    </div>
                    <div class="info-box" style="margin-top: 1rem;">
                        <h4>📋 KI-Inventar anlegen:</h4>
                        <ul>
                            <li>Alle genutzten KI-Systeme erfassen</li>
                            <li>Zweck, Datenquellen und Funktionsweise dokumentieren</li>
                            <li>Interne Risikoklassifizierung vornehmen</li>
                        </ul>
                    </div>
                    <div class="warning-box" style="margin-top: 1rem;">
                        <h4>🇪🇺 Bei EU-Geschäft bis August 2026:</h4>
                        <ul>
                            <li>KI-Systeme nach EU AI Act kategorisieren</li>
                            <li>Konformitätsbewertung für Hochrisiko-Systeme</li>
                            <li>EU-Bevollmächtigten benennen (bei GPAI-Anbietung)</li>
                        </ul>
                    </div>
                `
            }
        ]
    };
}
