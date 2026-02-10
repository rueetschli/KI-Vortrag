# KI-Grundlagen - Interaktive Präsentationsplattform

> Wirtschaftsschule Five - Markdown-basiertes Präsentationssystem mit Quizzes, Echtzeit-Synchronisation und Studenten-Tracking
>
> **Dozent:** Michael Rueetschli | **Schule:** Wirtschaftsschule Five

---

## Inhaltsverzeichnis

- [Schnellstart](#schnellstart)
- [Architektur](#architektur)
- [Steuerung](#steuerung)
- [Content erstellen](#content-erstellen)
  - [Module und Folien](#module-und-folien)
  - [Videos einbinden](#videos-einbinden)
  - [Speaker-Notes](#speaker-notes)
  - [Spezielle Boxen](#spezielle-boxen)
  - [Media-Layouts](#media-layouts)
- [Übungstypen (Quizzes)](#übungstypen-quizzes)
  - [Multiple Choice](#1-multiple-choice)
  - [Richtig/Falsch](#2-richtigfalsch)
  - [Lückentext](#3-lückentext)
  - [Zuordnung](#4-zuordnung)
  - [Reihenfolge](#5-reihenfolge)
  - [Freitext](#6-freitext)
  - [Bewertungsskala](#7-bewertungsskala)
  - [Interaktive Demo](#8-interaktive-demo)
- [Gruppenaufgaben (Tasks)](#gruppenaufgaben-tasks)
- [Dozenten-Funktionen](#dozenten-funktionen)
  - [Dozenten-Login](#dozenten-login)
  - [Content-Editor](#content-editor)
  - [Seiteneinstellungen](#seiteneinstellungen)
  - [Passwort ändern](#passwort-ändern)
  - [Referentenansicht](#referentenansicht)
  - [Presenter-Dock](#presenter-dock)
  - [Studenten-Dashboard](#studenten-dashboard)
  - [Fernsteuerung (Remote Control)](#fernsteuerung-remote-control)
- [Studenten-Features](#studenten-features)
  - [Punkte-Anzeige](#punkte-anzeige)
  - [Bildschirm-Synchronisation](#bildschirm-synchronisation)
- [API-Endpunkte](#api-endpunkte)
- [Dateistruktur](#dateistruktur)
- [Design anpassen](#design-anpassen)
- [Fehlerbehebung](#fehlerbehebung)

---

## Schnellstart

1. Alle Dateien per FTP auf einen Webserver mit PHP hochladen
2. `index.html` im Browser öffnen
3. Fertig!

**Keine Installation, kein Docker, kein Build-Prozess nötig.**

Die Plattform benötigt lediglich:
- Einen Webserver mit PHP (für die API-Funktionen wie Echtzeit-Sync und Gruppenaufgaben)
- Einen modernen Browser (Chrome, Firefox, Safari, Edge)

Ohne PHP funktionieren alle Basisfunktionen (Präsentation, Quizzes, lokaler Fortschritt). Die Echtzeit-Features (Fernsteuerung, Dashboard, Gruppenaufgaben) benötigen das PHP-Backend.

---

## Architektur

```
Browser (Student)                    Browser (Dozent)
+------------------+                +------------------+
| index.html       |                | index.html       |
| JS-Module        |    Polling     | JS-Module        |
| LocalStorage     | <-----------> | Presenter Window |
+--------+---------+    (2-3s)     +--------+---------+
         |                                  |
         |        +----------------+        |
         +------->|  PHP Backend   |<-------+
                  |  api/sync.php  |
                  | api/submissions|
                  +-------+--------+
                          |
                  +-------+--------+
                  |  api/data/*.json|
                  |  (File Storage) |
                  +----------------+
```

- **Frontend:** Vanilla JavaScript (kein Framework), HTML5, CSS3
- **Content:** Markdown-Dateien mit erweiterter Syntax
- **Backend:** PHP (optional, für Echtzeit-Features)
- **Speicherung:** LocalStorage + JSON-Dateien auf dem Server
- **Kommunikation:** HTTP-Polling (alle 2-3 Sekunden)

---

## Steuerung

### Tastatur

| Taste | Aktion |
|-------|--------|
| `→` / `↓` / `Space` / `N` | Nächste Folie |
| `←` / `↑` / `P` | Vorherige Folie |
| `Page Down` | Nächste Folie (Presenter-Fernbedienung) |
| `Page Up` | Vorherige Folie (Presenter-Fernbedienung) |
| `Home` | Erste Folie |
| `End` | Letzte Folie |
| `F` / `F11` | Vollbild ein/aus |
| `O` | Modul-Übersicht ein/aus |
| `Esc` | Übersicht schliessen |
| `S` | Spotlight-Modus ein/aus |
| `T` | Präsentations-Timer ein/aus |

### Kabellose Presenter

Die meisten kabellosen Presenter (Logitech, Kensington etc.) senden `Page Up` / `Page Down` - diese werden automatisch erkannt.

### Touch/Mobile

Wischen Sie nach links/rechts zum Navigieren.

---

## Content erstellen

Alle Inhalte werden als Markdown-Dateien im Ordner `content/` gespeichert und in `content/modules.json` registriert.

### Module und Folien

Jede `.md`-Datei definiert ein Modul mit Folien:

```markdown
:::module{id="mein-modul" title="Mein Modultitel" duration="30"}

:::title-slide
# Grosser Titel
Untertitel oder Beschreibung

---slide---

## Normale Folie

Hier kommt der Inhalt mit **Markdown-Formatierung**.

- Aufzählungspunkte
- Weitere Punkte

---slide---

## Noch eine Folie

Weiterer Inhalt...

:::endmodule
```

**Wichtige Regeln:**
- `:::module{...}` startet ein neues Modul (Pflichtattribute: `id`, `title`)
- `:::title-slide` markiert die erste Folie eines Moduls als Titel-Folie
- `---slide---` trennt die einzelnen Folien
- `:::endmodule` beendet das Modul
- `duration` gibt die geschätzte Dauer in Minuten an

**Modul registrieren** in `content/modules.json`:

```json
{
  "modules": [
    "01-willkommen.md",
    "02-mein-neues-modul.md"
  ]
}
```

### Videos einbinden

Es gibt drei Wege, Videos in Folien einzubinden:

#### 1. YouTube-Link als Bild (automatische Erkennung)

Einen YouTube-Link direkt als Markdown-Bild einbetten. Die Plattform erkennt YouTube-URLs automatisch und erstellt ein klickbares Thumbnail mit Play-Button:

```markdown
![Video Titel](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
```

Das Bild wird automatisch zum klickbaren Video-Thumbnail umgewandelt. Bei Klick öffnet sich ein Fullscreen-Player.

#### 2. Media-Layout mit Video

Für Videos neben Text (Split-Layout):

```markdown
:::media{video="https://www.youtube.com/watch?v=dQw4w9WgXcQ" position="left"}
### Erklärung zum Video

Hier steht beschreibender Text neben dem Video.

- Punkt 1
- Punkt 2
:::endmedia
```

`position="left"` platziert das Video links (Standard), `position="right"` rechts.

#### 3. Eigenes Thumbnail

```markdown
:::media{video="https://youtu.be/dQw4w9WgXcQ" thumbnail="bilder/custom-thumb.jpg" position="right"}
Text neben dem Video mit eigenem Vorschaubild.
:::endmedia
```

#### 4. YouTube-Overlay während der Präsentation

Als Dozent können Sie über das Presenter-Dock (`Video`-Button) jederzeit ein YouTube-Video live einblenden, ohne es vorher in die Folien einzubauen.

### Speaker-Notes

Speaker-Notes sind nur in der Referentenansicht (Popup-Fenster) sichtbar und werden den Studenten nicht angezeigt:

```markdown
---slide---

## Folientitel

Sichtbarer Inhalt für alle.

:::notes
- Hier stehen **private Notizen** für den Dozenten
- Unterstützt volle Markdown-Formatierung
- Stichpunkte, **fett**, *kursiv* etc.
- Zeithinweis: 5 Minuten für diese Folie einplanen
:::endnotes
```

Die Notes erscheinen im unteren Bereich der Referentenansicht und werden als Markdown gerendert (Fett, Listen, Links etc. funktionieren).

### Spezielle Boxen

Farbige Infoboxen für besondere Hinweise:

```markdown
:::info
Dies ist eine **Informationsbox** (blau).
Gut für Hintergrundinformationen oder Definitionen.
:::

:::warning
Dies ist eine **Warnungsbox** (orange).
Gut für wichtige Hinweise oder Einschränkungen.
:::

:::success
Dies ist eine **Erfolgsbox** (grün).
Gut für Best Practices oder positive Beispiele.
:::
```

### Media-Layouts

Bilder oder Videos neben Text in einem Split-Layout:

```markdown
:::media{image="bilder/ki-beispiel.png" source="Quelle: Wikipedia" position="left"}
### Beschreibung

Text der neben dem Bild erscheint.
:::endmedia
```

Attribute:
- `image="url"` - Pfad zum Bild
- `video="youtube-url"` - YouTube-Video statt Bild
- `thumbnail="url"` - Eigenes Video-Vorschaubild
- `source="text"` - Quellenangabe unter dem Medium
- `position="left|right"` - Medium links oder rechts (Standard: left)

---

## Übungstypen (Quizzes)

Die Plattform unterstützt 8 verschiedene interaktive Übungstypen. Alle werden in der Markdown-Syntax definiert und automatisch zu interaktiven HTML-Komponenten umgewandelt.

**Allgemeine Attribute für alle Übungen:**

```markdown
:::exercise{type="..." id="..." title="..." points="..."}
```

| Attribut | Pflicht | Beschreibung |
|----------|---------|-------------|
| `type` | Ja | Übungstyp (siehe unten) |
| `id` | Ja | Eindeutige ID (wird für Speicherung verwendet) |
| `title` | Ja | Titel der Übung |
| `points` | Nein | Punkte für richtige Antwort (Standard: 10) |

### 1. Multiple Choice

Single-Choice-Fragen mit A/B/C/D-Optionen:

```markdown
:::exercise{type="multiple-choice" id="mc1" title="KI-Grundlagen" points="10"}
question: Welche Aussage über Künstliche Intelligenz ist korrekt?
options:
- KI kann selbstständig denken wie ein Mensch
- KI erkennt Muster in Daten und trifft darauf basierend Vorhersagen
- KI hat ein eigenes Bewusstsein
- KI funktioniert ohne Daten
correct: B
hint: Denken Sie an die grundlegende Funktionsweise von Machine Learning.
:::
```

**Parameter:**
| Parameter | Beschreibung |
|-----------|-------------|
| `question:` | Die Fragestellung |
| `options:` | Liste der Antwortmöglichkeiten (mit `- ` Prefix) |
| `correct:` | Buchstabe der richtigen Antwort (A, B, C, D) |
| `hint:` | Optionaler Hinweis (Button zum Einblenden) |

### 2. Richtig/Falsch

Einfache Richtig/Falsch-Fragen:

```markdown
:::exercise{type="true-false" id="tf1" title="KI-Faktencheck" points="5"}
question: ChatGPT wurde von Google entwickelt.
correct: false
hint: Überlegen Sie, welches Unternehmen hinter ChatGPT steht.
:::
```

**Parameter:**
| Parameter | Beschreibung |
|-----------|-------------|
| `question:` | Die Behauptung |
| `correct:` | `true` oder `false` |
| `hint:` | Optionaler Hinweis |

### 3. Lückentext

Texte mit Lücken zum Ausfüllen:

```markdown
:::exercise{type="fill-blank" id="fb1" title="Begriffe ergänzen" points="15"}
text: Machine Learning ist ein Teilbereich der ___ . Dabei lernt ein ___ aus Daten.
blanks:
- Künstlichen Intelligenz
- Algorithmus
hint: Denken Sie an die Hierarchie der KI-Begriffe.
:::
```

**Parameter:**
| Parameter | Beschreibung |
|-----------|-------------|
| `text:` | Text mit `___` als Platzhalter für jede Lücke |
| `blanks:` | Richtige Antworten in Reihenfolge der Lücken |
| `hint:` | Optionaler Hinweis |

Die Prüfung ist case-insensitive (Gross/Kleinschreibung wird ignoriert).

### 4. Zuordnung

Paare einander zuordnen (Klick links, dann Klick rechts):

```markdown
:::exercise{type="matching" id="match1" title="KI-Begriffe zuordnen" points="20"}
question: Ordnen Sie die Begriffe den richtigen Beschreibungen zu:
pairs:
- Machine Learning | Lernen aus Daten
- Deep Learning | Neuronale Netze mit vielen Schichten
- NLP | Verarbeitung natürlicher Sprache
- Computer Vision | Bildverarbeitung und -erkennung
:::
```

**Parameter:**
| Parameter | Beschreibung |
|-----------|-------------|
| `question:` | Aufgabenstellung |
| `pairs:` | Paare im Format `links | rechts` (getrennt durch `|`) |

Die rechte Spalte wird automatisch gemischt.

### 5. Reihenfolge

Elemente in die richtige Reihenfolge bringen (Drag & Drop):

```markdown
:::exercise{type="ordering" id="ord1" title="KI-Geschichte" points="15"}
question: Bringen Sie die KI-Meilensteine in chronologische Reihenfolge:
items:
- Dartmouth-Konferenz (1956)
- Erster Schachcomputer besiegt Weltmeister (1997)
- ImageNet-Durchbruch mit Deep Learning (2012)
- ChatGPT Veröffentlichung (2022)
:::
```

**Parameter:**
| Parameter | Beschreibung |
|-----------|-------------|
| `question:` | Aufgabenstellung |
| `items:` | Elemente in der **richtigen** Reihenfolge (werden automatisch gemischt) |

### 6. Freitext

Offene Textantworten mit Längenvalidierung:

```markdown
:::exercise{type="text-input" id="text1" title="Reflexion" points="10"}
question: Beschreiben Sie in eigenen Worten, wie Sie KI in Ihrem Berufsalltag einsetzen könnten.
placeholder: Denken Sie an konkrete Aufgaben in Ihrem Arbeitsbereich...
minLength: 50
maxLength: 500
:::
```

**Parameter:**
| Parameter | Beschreibung |
|-----------|-------------|
| `question:` | Die Fragestellung |
| `placeholder:` | Platzhaltertext im Eingabefeld |
| `minLength:` | Mindestlänge der Antwort (Standard: 10) |
| `maxLength:` | Maximale Länge (Standard: 500) |

Freitext-Übungen gelten als "richtig", wenn die Mindestlänge erreicht ist. Die eingegebenen Texte sind im Dozenten-Dashboard als Feedback einsehbar.

### 7. Bewertungsskala

Slider-basierte Bewertungen (ideal für Feedback und Umfragen):

```markdown
:::exercise{type="scale" id="scale1" title="Kurs-Feedback" points="5"}
question: Wie hilfreich fanden Sie dieses Modul?
min: 1
max: 10
step: 1
minLabel: Nicht hilfreich
maxLabel: Sehr hilfreich
:::
```

**Parameter:**
| Parameter | Beschreibung |
|-----------|-------------|
| `question:` | Die Frage |
| `min:` / `max:` | Wertebereich (Standard: 1-10) |
| `step:` | Schrittweite (Standard: 1) |
| `minLabel:` / `maxLabel:` | Beschriftung der Enden |

Skala-Übungen sind immer "richtig" (es gibt keine falsche Bewertung). Im **Dozenten-Dashboard** werden die Ergebnisse aggregiert angezeigt (Durchschnittswert + alle Einzelwerte).

### 8. Interaktive Demo

Simulierter KI-Chat zum Ausprobieren:

```markdown
:::exercise{type="demo" id="demo1" title="KI-Chat ausprobieren" points="5"}
question: Chatten Sie mit der KI
description: Künstliche Intelligenz
:::
```

**Parameter:**
| Parameter | Beschreibung |
|-----------|-------------|
| `question:` | Titel des Chat-Fensters |
| `description:` | Themenkontext für die simulierten Antworten |

**Hinweis:** Die Demo verwendet vordefinierte Antworten und ist nicht mit einer echten KI verbunden. Sie dient der Veranschaulichung.

---

## Gruppenaufgaben (Tasks)

Gruppenaufgaben ermöglichen Cross-Device-Interaktion: Der Dozent zeigt einen QR-Code, Studenten scannen ihn auf dem Smartphone und reichen Antworten ein.

### Aufgabe definieren

```markdown
---slide---

:::task{id="brainstorming" title="KI-Ideen Brainstorming"}
Sammeln Sie in Ihrer Gruppe **drei konkrete Ideen**, wie KI in Ihrem Unternehmen eingesetzt werden könnte.

Beachten Sie:
- Machbarkeit
- Kosten-Nutzen-Verhältnis
- Ethische Aspekte
:::endtask

---slide---

:::taskresults{task="brainstorming" title="Ergebnisse: KI-Ideen"}
:::
```

**Ablauf:**
1. Dozent navigiert zur Task-Folie -> QR-Code + URL werden angezeigt
2. Studenten scannen den QR-Code auf dem Smartphone
3. Auf dem Smartphone öffnet sich ein Eingabeformular (Name, Gruppe, Antwort)
4. Eingereichte Antworten erscheinen live auf der Ergebnis-Folie
5. Die Ergebnis-Folie pollt alle 3 Sekunden nach neuen Einreichungen

### Ergebnisse anzeigen

Die `:::taskresults{task="brainstorming"}` Folie zeigt alle Einreichungen an:
- Gruppiert nach Gruppenname (wenn angegeben)
- Mit Zeitstempel
- Live-aktualisiert während der Präsentation

---

## Dozenten-Funktionen

### Dozenten-Login

1. Auf dem Login-Bildschirm auf **"Als Dozent anmelden"** klicken
2. Passwort eingeben (Standard: `dozent2026`, änderbar über den Editor)
3. Es erscheinen zusätzliche Buttons in der Navigationsleiste:
   - **Stift-Icon:** Content-Editor (Markdown-Dateien bearbeiten)
   - **Monitor-Icon:** Referentenansicht öffnen
   - **Balkendiagramm-Icon:** Studenten-Dashboard
   - **Papierkorb-Icon:** Alle Antworten löschen

Das Dozenten-Passwort wird serverseitig in `config.php` gespeichert und kann über den Editor geändert werden. Ohne PHP-Backend wird das Fallback-Passwort `dozent2026` verwendet.

### Content-Editor

Der Content-Editor ermöglicht das direkte Bearbeiten aller Kursinhalte im Browser. Klicken Sie auf das **Stift-Icon** in der Navigationsleiste.

**Tab: Dateien**
- Alle `.md`-Dateien im `content/`-Ordner werden aufgelistet
- Dateien können geöffnet, bearbeitet und gespeichert werden
- Neue Dateien können erstellt werden (mit Modul-Template)
- Bestehende Dateien können umbenannt oder gelöscht werden
- Die `modules.json` wird bei jeder Dateiänderung automatisch aktualisiert

**Tab: Modulreihenfolge**
- Module können per Drag & Drop oder Pfeil-Buttons umsortiert werden
- Module können aus der Liste entfernt werden (Datei bleibt erhalten)
- Änderungen werden in `modules.json` gespeichert

### Seiteneinstellungen

Im Tab **Seiteneinstellungen** des Editors können folgende Werte angepasst werden:

| Einstellung | Beschreibung | Beispiel |
|------------|-------------|---------|
| Titel | Haupttitel auf der Login-Seite | KI-GRUNDLAGEN |
| Untertitel | Unter dem Logo | Wirtschaftsschule Five |
| Badge | Kurs-Badge | Einführungsmodul |
| Kursname | Name des Kurses | KI-Grundlagen |
| Kursbeschreibung | Zielgruppe / Beschreibung | für Büro-, Marketing- und Verkaufsleiter |
| Dozent | Name des Dozenten | Michael Rueetschli |
| Institution | Name der Schule | Wirtschaftsschule Five |
| Statistiken | Module, Übungen, Lernzeit | 6, 12+, 6h |

Die Einstellungen werden in `config.php` gespeichert und beim Laden der Seite automatisch angewendet.

### Passwort ändern

Im Tab **Passwort** des Editors kann das Dozenten-Passwort geändert werden:
1. Aktuelles Passwort eingeben
2. Neues Passwort eingeben und bestätigen
3. Mindestlänge: 4 Zeichen
4. Das neue Passwort wird in `config.php` gespeichert

### Referentenansicht

Klicken Sie auf den Monitor-Button in der Nav-Bar. Es öffnet sich ein Popup-Fenster mit:

```
+----------------------------------+
| REFERENTENANSICHT    Folie 5/45  |
+----------------------------------+
|                |                  |
| Aktuelle Folie | Nächste Folie    |
|   (Vorschau)   |  (Vorschau)     |
|                |                  |
+----------------------------------+
| Notizen                          |
| - Punkt 1                        |
| - Punkt 2                        |
+----------------------------------+
|    [← Zurück]   [Weiter →]      |
+----------------------------------+
```

- **Aktuelle Folie** (links) - Vorschau des aktuellen Inhalts
- **Nächste Folie** (rechts) - Was als nächstes kommt
- **Speaker-Notes** (unten) - Private Notizen zu dieser Folie
- **Timer** - Synchronisiert mit dem Haupt-Timer
- **Navigation** - Zurück/Weiter-Buttons die das Hauptfenster steuern

**Tipp:** Ziehen Sie das Presenter-Fenster auf einen zweiten Monitor und präsentieren Sie das Hauptfenster über den Beamer.

### Presenter-Dock

Das Presenter-Dock erscheint unten rechts und bietet Schnellzugriff:

| Tool | Taste | Beschreibung |
|------|-------|-------------|
| Spotlight | `S` | Dunkelt den Bildschirm ab, heller Kreis folgt dem Mauszeiger |
| Timer | `T` | Startet/stoppt einen Präsentations-Timer (MM:SS) |
| Video | - | YouTube-Video live einblenden (URL eingeben) |
| Interaktiv | - | QR-Code-Generator für spontane Aktivitäten (Mentimeter, Kahoot, Forms) |

### Studenten-Dashboard

Der Dashboard-Button (Balkendiagramm-Icon) öffnet eine Übersicht:

**Rangliste:**
| # | Name | Punkte | Max | % |
|---|------|--------|-----|---|
| 1 | Anna Müller | 45 | 50 | 90% |
| 2 | Max Keller | 35 | 50 | 70% |
| ... | ... | ... | ... | ... |

**Zusammenfassung:**
- Teilnehmeranzahl
- Durchschnittliche Punktzahl
- Höchste Punktzahl

**Feedback-Auswertung:**
- Aggregierte Ergebnisse von Skala-Übungen (Durchschnittswert + Einzelwerte)
- Freitext-Feedback aller Studenten

**CSV-Export:** Alle Ergebnisse als CSV-Datei herunterladen (kompatibel mit Excel).

### Fernsteuerung (Remote Control)

Wenn der Dozent eingeloggt ist und Folien wechselt, wird die aktuelle Foliennummer automatisch an den Server gesendet. Studenten-Browser synchronisieren sich alle 2 Sekunden.

**So funktioniert es:**
1. Dozent loggt sich ein und beginnt die Präsentation
2. Studenten öffnen die gleiche URL und loggen sich mit ihrem Namen ein
3. Die Studenten-Browser synchronisieren sich automatisch mit dem Dozenten
4. Dozent wechselt die Folie -> alle Studenten wechseln automatisch mit

### QR-Code bei Quizzes

Wenn der Dozent eine Folie mit einer Übung aufruft, erscheint automatisch ein QR-Code unten links. Studenten können diesen scannen, um direkt zur Präsentation zu gelangen und mitzumachen.

---

## Studenten-Features

### Punkte-Anzeige

Studenten sehen ihre erspielten Punkte direkt in der Navigationsleiste neben ihrem Namen:

```
[★] 35 / 80    Max Mustermann [MM]
```

- Zeigt aktuell verdiente Punkte / maximale Punkte
- Wird live nach jeder beantworteten Übung aktualisiert
- Erscheint erst, nachdem die erste Übung beantwortet wurde

### Bildschirm-Synchronisation

Studenten müssen nicht selbst durch die Folien navigieren:

- Dozent wechselt die Folie -> alle Studenten sehen automatisch die gleiche Folie
- Funktioniert über HTTP-Polling (kein WebSocket nötig)
- Die Synchronisation startet automatisch 2 Sekunden nach dem Login
- Nur aktiv, wenn der Dozent innerhalb der letzten 2 Stunden eine Folie gesetzt hat

---

## API-Endpunkte

### Task Submissions (`api/submissions.php`)

| Methode | Parameter | Beschreibung |
|---------|-----------|-------------|
| `GET` | `?task={id}` | Alle Einreichungen für eine Aufgabe abrufen |
| `POST` | Body: `{taskId, name, group, content}` | Neue Einreichung speichern |
| `DELETE` | `?task={id}` | Einreichungen für eine Aufgabe löschen |
| `DELETE` | (ohne Parameter) | Alle Einreichungen löschen |

### Sync API (`api/sync.php`)

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `GET` | `?action=slide` | Aktuelle Dozenten-Folie abfragen |
| `POST` | `?action=slide` | Dozenten-Folie setzen (Body: `{slide, moduleIndex, slideIndex}`) |
| `POST` | `?action=score` | Studenten-Punktestand melden (Body: `{name, studentId, earned, total, percentage, exercises}`) |
| `GET` | `?action=scores` | Alle Studenten-Punktestände abfragen |
| `DELETE` | `?action=scores` | Alle Punktestände + Folienstatus löschen |
| `GET` | `?action=feedback` | Feedback-Übungen (Skala, Freitext) aggregiert abfragen |

### Editor API (`api/editor.php`)

Alle Endpunkte (ausser `auth`) erfordern den Header `X-Instructor-Auth` mit dem Dozenten-Passwort.

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| `POST` | `?action=auth` | Passwort verifizieren (Body: `{password}`) |
| `POST` | `?action=change-password` | Passwort ändern (Body: `{oldPassword, newPassword}`) |
| `GET` | `?action=files` | Alle `.md`-Dateien auflisten |
| `GET` | `?action=file&name=...` | Dateiinhalt lesen |
| `POST` | `?action=file` | Datei speichern/erstellen (Body: `{name, content}`) |
| `DELETE` | `?action=file&name=...` | Datei löschen |
| `GET` | `?action=modules` | `modules.json` lesen |
| `POST` | `?action=modules` | `modules.json` speichern |
| `GET` | `?action=config` | Seiteneinstellungen lesen |
| `POST` | `?action=config` | Seiteneinstellungen speichern (Body: `{site: {...}}`) |

### Site Config (`api/site-config.php`)

| Methode | Beschreibung |
|---------|-------------|
| `GET` | Öffentliche Seiteneinstellungen lesen (kein Passwort in Antwort) |

---

## Dateistruktur

```
ki-akademie/
├── index.html              # Hauptseite (Single-Page-App)
├── README.md               # Diese Dokumentation
├── config.php              # Passwort + Seiteneinstellungen
├── css/
│   ├── style.css           # Haupt-Styles + Dashboard + Editor
│   ├── animations.css      # Keyframe-Animationen
│   ├── exercises.css       # Übungs-Komponenten
│   └── presenter.css       # Referentenansicht + Task-Styles
├── js/
│   ├── app.js              # KIAkademie-Klasse, Initialisierung
│   ├── app-nav.js          # Navigation, Content-Loading, Slide-Rendering
│   ├── app-ui.js           # Sidebar, Fullscreen, Notifications
│   ├── editor.js           # Content-Editor (Dateien, Einstellungen, Passwort)
│   ├── exercises.js        # ExerciseHandler, Validierung, Scoring
│   ├── markdown-parser.js  # Markdown-Erweiterungen, Übungs-HTML
│   ├── storage.js          # LocalStorage-Manager
│   ├── instructor.js       # Dozenten-Login, Presenter-Fenster
│   ├── presenter-tools.js  # Spotlight, Timer, YouTube, QR-Generator
│   ├── remote-sync.js      # Fernsteuerung, Punkte-Sync, Dashboard
│   ├── task-submissions.js # Gruppenaufgaben, Mobile-Eingabe, Polling
│   ├── print-export.js     # PDF/Druck-Export
│   └── particles.js        # Hintergrund-Partikel-Animation
├── content/
│   ├── modules.json        # Modul-Index (Liste der .md-Dateien)
│   ├── 01-willkommen.md    # Modul: Willkommen
│   ├── 02-ki-landschaft.md # Modul: KI-Landschaft
│   └── ...                 # Weitere Module
└── api/
    ├── editor.php          # REST-API für Content-Editor
    ├── site-config.php     # Öffentliche Seiteneinstellungen
    ├── submissions.php     # REST-API für Gruppenaufgaben
    ├── sync.php            # REST-API für Echtzeit-Sync + Scores
    └── data/               # JSON-Datenspeicher (automatisch erstellt)
```

---

## Design anpassen

Die Farben und Schriftarten können über CSS-Variablen in `css/style.css` angepasst werden:

```css
:root {
    /* Hauptfarben */
    --primary-dark: #0a1628;    /* Dunkler Hintergrund */
    --primary: #1a365d;         /* Primärfarbe */
    --accent: #f59e0b;          /* Akzentfarbe (WSF Orange) */
    --secondary: #ff6b35;       /* Sekundärfarbe */

    /* Schriftarten */
    --font-display: 'Orbitron', sans-serif;  /* Überschriften */
    --font-body: 'Exo 2', sans-serif;        /* Fliesstext */
    --font-mono: 'JetBrains Mono', monospace; /* Code/Zahlen */
}
```

---

## Fehlerbehebung

**Folien laden nicht:**
- Browser-Konsole prüfen (F12 -> Console)
- Sicherstellen, dass alle Dateien hochgeladen sind
- Webserver muss `.md` und `.json` Dateien ausliefern

**Presenter funktioniert nicht:**
- Popup-Blocker deaktivieren
- Tastaturkürzel im Browser testen
- Manche Presenter benötigen HID-Modus

**Fernsteuerung funktioniert nicht:**
- PHP muss auf dem Server verfügbar sein
- Prüfen ob `api/sync.php` erreichbar ist (im Browser aufrufen)
- Der `api/data/` Ordner muss beschreibbar sein (chmod 755)

**Dashboard zeigt keine Daten:**
- Studenten müssen mindestens eine Übung beantwortet haben
- Punkte werden erst nach Beantwortung an den Server gesendet
- PHP-Backend muss erreichbar sein

**QR-Codes werden nicht angezeigt:**
- Internetverbindung prüfen (QR-Codes werden von `api.qrserver.com` generiert)

**Editor speichert nicht:**
- PHP muss auf dem Server verfügbar sein
- `content/`-Ordner muss beschreibbar sein (chmod 755)
- `config.php` im Hauptverzeichnis muss beschreibbar sein
- Browser-Konsole auf Fehlermeldungen prüfen

**Passwort vergessen:**
- Direkt in `config.php` das Passwort im Feld `'password'` ändern

---

## Lizenz

Erstellt für Wirtschaftsschule Five.
