:::module{id="2" title="Die KI-Landschaft 2026" duration="60"}

:::title-slide

# Die KI-Landschaft 2026

Das Multi-Modell-Zeitalter: Spezialisierung statt Einheitsbrei

---slide---

## Das Wichtigste zuerst: Die Spielregeln haben sich geändert

:::warning
**2024** war die Frage: "Welches ist das beste Modell?"
**2026** ist die Frage: "Welches Modell für welche Aufgabe?"
:::

Die Ära des "One Model fits all" ist vorbei. Unternehmen, die heute gewinnen, nutzen **Model-Routing** – sie leiten Aufgaben automatisch an das optimale Modell weiter.

---slide---

## Die fünf Flaggschiffe im Vergleich

| Modell | Stärke | Kontext | Preis (API/1M Token) |
|--------|--------|---------|---------------------|
| **GPT-5.2** | Reasoning, Mathematik | 400K | ~$15 Input |
| **Claude 4.5 Opus** | Coding, Schreibqualität | 1M (Beta) | ~$15 Input |
| **Gemini 3 Pro** | Multimodal, Speed | 1M | ~$5 Input |
| **Llama 4 Maverick** | Open Source, Privacy | 1M | Kostenlos* |
| **DeepSeek R1** | Budget, Skalierung | 128K | 27x günstiger |

*Eigene Infrastruktur nötig

---slide---

## GPT-5.2 – Der Denker

**OpenAI's Flaggschiff mit 900 Mio. wöchentlichen Nutzern**

**Durchbrüche:**
- **100% Score** auf AIME 2025 (Mathematik-Benchmark)
- **400K Token** Kontextfenster
- **6.2% Halluzinationsrate** – 40% weniger als Vorgänger
- 6 einstellbare Reasoning-Stufen (von "minimal" bis "xhigh")

**Ideal für:** Komplexe Analysen, Strategieplanung, Research

**Preise Consumer:**
- Free: Basis-Zugang
- Plus: $20/Monat
- Pro: $200/Monat (unbegrenztes Reasoning)

---slide---

## Claude 4.5 Opus – Der Code-Champion

**Anthropics Flaggschiff: Erstes Modell über 80% auf SWE-bench**

**Durchbrüche:**
- **80.9% SWE-bench** – löst echte GitHub-Issues autonom
- **Extended Thinking Mode** – plant Architektur vor dem Coden
- Natürlichster Schreibstil aller Modelle ("Writer's Choice")
- Bis zu **76% weniger Token** bei mittlerer Reasoning-Stufe

**Ideal für:** Code-Generierung, lange Dokumente, sensible Umgebungen

**Preise Consumer:**
- Free: Basis-Zugang
- Pro: $20/Monat

---slide---

## Gemini 3 – Der Multimodale Speedster

**Google's Antwort: Schneller, günstiger, überall integriert**

**Durchbrüche:**
- Gemini 3 **Flash schlägt Pro** auf 18/20 Benchmarks – bei 3x Speed
- **1 Million Token** Kontextfenster (ganze Bücher!)
- **Deep Think Mode** für erweitertes Reasoning
- Veo 3 für State-of-the-Art Videogenerierung
- Nano Banana für beste Bildgenerierung

**Ideal für:** Google Workspace, multimodale Aufgaben, Video

**Preise Consumer:**
- In Google One AI Premium: $20/Monat
- In Workspace Business: ab CHF 14/Nutzer

---slide---

## Die Herausforderer

**Llama 4 Maverick (Meta)**
- 400B Parameter, Open Source (Apache 2.0)
- Läuft auf **eigener Infrastruktur** → volle Datenkontrolle
- Schlägt GPT-4o und Gemini 2.0 Flash in Benchmarks
- Ideal für: Datenschutz-sensitive Unternehmen

**DeepSeek R1 (China)**
- **27x günstiger** als OpenAI bei vergleichbarer Reasoning-Qualität
- 685B Parameter, nur 37B aktiv (Sparse Architecture)
- Ideal für: Hochvolumen-Aufgaben, Content-Moderation, Daten-Labeling

**Mistral Large 3 (Frankreich/EU)**
- 92% der GPT-5.2-Leistung bei **15% der Kosten**
- EU-konform, europäische Alternative

---slide---

## Consumer-Tools: Was Sie morgen nutzen können

| Tool | Was es kann | Preis/Monat |
|------|------------|-------------|
| **ChatGPT Plus** | Allrounder, Bilder, Deep Research | $20 |
| **Claude Pro** | Schreiben, Code, Analyse | $20 |
| **Gemini Advanced** | Google-Integration, Video | $20 |
| **Perplexity Pro** | Recherche mit Quellenangaben | $20 |
| **Microsoft Copilot** | Office 365 Integration | CHF 30/Nutzer |
| **Grok** | X/Twitter-Daten, 2M Kontext | $30 |

---slide---

:::exercise{type="multiple-choice" id="ex-llm" title="Welches Modell wofür?" points="10"}
question: Ein Schweizer KMU will KI in sein bestehendes Microsoft 365 integrieren. Welches Tool ist am sinnvollsten?
options:
- ChatGPT Plus
- Microsoft Copilot
- Google Gemini
- DeepSeek
correct: B
hint: Achten Sie auf die bestehende Infrastruktur des Unternehmens.
correct_feedback: Richtig! Copilot integriert sich nahtlos in bestehende Microsoft-Umgebungen.
incorrect_feedback: Microsoft Copilot bietet die beste Integration in Microsoft 365.
:::

---slide---

## Bildgeneratoren 2026

| Tool | Stärke | Preis |
|------|--------|-------|
| **Nano Banana (Google)** | Beste Qualität insgesamt | In Gemini enthalten |
| **GPT Image 1.5** | Text in Bildern, Prompt-Treue | In ChatGPT+ |
| **Midjourney v7** | Künstlerische Qualität | ab $10/Mt |
| **Adobe Firefly 3** | Commercial-Safe, Lizenzsicher | In CC enthalten |
| **Flux (Black Forest Labs)** | Open Source, anpassbar | Kostenlos* |

*Benötigt eigene Hardware oder Cloud

:::info
**Tipp:** Für Marketing-Teams ist die Lizenzfrage entscheidend – Adobe Firefly und Midjourney bieten Commercial-Safe-Lizenzen.
:::

---slide---

## Trend 1: KI-Agenten – Die Revolution von 2026

:::warning
**Gartner:** Bis Ende 2026 werden **40% aller Enterprise-Apps** KI-Agenten integrieren – ein 8-facher Anstieg in nur einem Jahr.
:::

**Was Agenten 2026 können:**
- Mehrstufige Aufgaben **autonom** planen und ausführen
- Tools, APIs und Datenbanken eigenständig nutzen
- Aus Fehlern lernen und Strategien anpassen
- In **Multi-Agenten-Teams** zusammenarbeiten

**Beispiele:**
- Salesforce Einstein: Autonome Lead-Qualifizierung
- HubSpot Breeze: Löst 50%+ Support-Tickets eigenständig
- Claude Code: Löst echte GitHub-Issues autonom
- GitHub Copilot: Schreibt und testet ganzen Code

---slide---

## Trend 2: Adjustable Compute – Denken nach Mass

**Das Killer-Feature 2026:** Sie bestimmen, wie viel die KI nachdenkt.

| Stufe | Latenz | Kosten | Ideal für |
|-------|--------|--------|-----------|
| Minimal | ~1 Sek. | Niedrig | Einfache Fragen |
| Medium | ~5 Sek. | Mittel | Standardaufgaben |
| High | ~15 Sek. | Hoch | Analyse & Planung |
| Extended | ~60 Sek. | Sehr hoch | Research-Grade Reasoning |

→ GPT-5.2 bietet 6 Stufen, Claude 4.5 bietet ähnliche Kontrolle

---slide---

## Trend 3: Small Language Models – Gross ist nicht immer besser

**SLMs laufen auf Ihrem Gerät – ohne Internet, ohne Cloud:**

- **Phi-4 (Microsoft):** Leistung eines GPT-4-Vorgängers auf dem Laptop
- **Llama 3.3 70B:** GPT-4-Klasse auf 64GB MacBook
- **Mistral Small 3:** Gleiche Leistung bei einem Drittel des Speichers
- **Gemma 3 (Google):** Optimiert für Smartphones

**Warum das wichtig ist:**
- **100% Datenschutz** – keine Daten verlassen das Gerät
- **10-100x günstiger** als Cloud-Modelle
- **Kein Internet nötig** – funktioniert offline
- Ideal für regulierte Branchen (Finanz, Gesundheit)

---slide---

## Trend 4: Preisverfall – KI wird demokratisiert

:::success
**KI-Preise sind 2025 um 50–98% gefallen.** Was vor einem Jahr $15 kostete, kostet heute oft unter $1.
:::

**Preisbeispiele pro 1 Million Token (Output):**
- GPT-4 (2023): ~$60
- GPT-5.2 (2026): ~$30
- Gemini 3 Flash: ~$2
- DeepSeek R1: ~$1
- Llama 4 (Self-hosted): ~$0.10

→ **KI-Nutzung ist kein Budget-Thema mehr – es ist ein Kompetenz-Thema.**

---slide---

:::exercise{type="matching" id="ex-tools" title="Tool-Zuordnung 2026" points="15"}
question: Ordnen Sie die Modelle den passenden Stärken zu:
pairs:
- GPT-5.2 | Mathematisches Reasoning (100% AIME)
- Claude 4.5 Opus | Autonomes Coding (80.9% SWE-bench)
- Gemini 3 Flash | Speed bei niedrigen Kosten (3x schneller)
- DeepSeek R1 | Budget-Skalierung (27x günstiger)
hint: Jedes Modell hat 2026 eine klare Spezialisierung.
:::

---slide---

:::exercise{type="multiple-choice" id="ex-trend" title="KI-Trend 2026" points="10"}
question: Welcher Trend definiert die KI-Landschaft 2026 am stärksten?
options:
- Immer grössere Modelle mit mehr Parametern
- Spezialisierung und Multi-Modell-Strategien
- Nur noch ein dominantes Modell am Markt
- KI wird wieder günstiger als manuelle Arbeit
correct: B
hint: Denken Sie an die Entwicklung vom "One Model fits all" zum strategischen Einsatz.
:::

:::endmodule
