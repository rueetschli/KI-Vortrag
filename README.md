# KI-Akademie - Interaktive Präsentationsplattform

Wirtschaftsschule Five Digital

## 🚀 Schnellstart

1. Alle Dateien per FTP auf Ihren Webserver hochladen
2. `index.html` im Browser öffnen
3. Fertig!

**Keine Installation, kein Docker, kein Build-Prozess nötig.**

## 🎮 Steuerung

### Tastatur
| Taste | Aktion |
|-------|--------|
| → / ↓ / Space / N | Nächste Folie |
| ← / ↑ / P | Vorherige Folie |
| Page Down | Nächste Folie (Presenter) |
| Page Up | Vorherige Folie (Presenter) |
| Home | Erste Folie |
| End | Letzte Folie |
| F / F11 | Vollbild |
| O | Übersicht öffnen |
| Esc | Übersicht schließen |

### PowerPoint Presenter
Die meisten kabellosen Presenter senden Page Up/Down - funktioniert automatisch!

### Touch/Mobile
Wischen Sie links/rechts zum Navigieren.

## 📁 Dateistruktur

```
ki-akademie/
├── index.html          # Hauptseite
├── css/
│   ├── style.css       # Haupt-Styles
│   ├── animations.css  # Animationen
│   └── exercises.css   # Übungs-Komponenten
├── js/
│   ├── app.js          # App-Kern
│   ├── app-nav.js      # Navigation
│   ├── app-ui.js       # UI-Funktionen
│   ├── exercises.js    # Übungs-Logik
│   ├── markdown-parser.js  # Content-Parser
│   ├── particles.js    # Hintergrund-Effekt
│   └── storage.js      # Speicherung
└── content/
    ├── modules.json    # Modul-Index
    └── *.md            # Kurs-Inhalte
```

## ✏️ Inhalte bearbeiten

### Neues Modul erstellen

1. Neue `.md` Datei in `/content/` erstellen
2. In `modules.json` hinzufügen

### Markdown-Syntax

```markdown
:::module{id="1" title="Modultitel" duration="30"}

:::title-slide
# Großer Titel
Untertitel

---slide---

## Normale Folie
Inhalt hier...

---slide---

:::exercise{type="multiple-choice" id="ex1" title="Frage" points="10"}
question: Was ist richtig?
options:
- Antwort A
- Antwort B
- Antwort C
correct: B
:::

:::endmodule
```

### Übungstypen

| Typ | Beschreibung |
|-----|--------------|
| `multiple-choice` | Single-Choice Fragen |
| `true-false` | Richtig/Falsch |
| `fill-blank` | Lückentext |
| `matching` | Zuordnung |
| `ordering` | Reihenfolge |
| `text-input` | Freitext |
| `scale` | Bewertungsskala |
| `demo` | Interaktive Demo |

### Spezielle Boxen

```markdown
:::info
Information
:::

:::warning
Warnung
:::

:::success
Erfolg
:::
```

## 🎨 Design anpassen

Farben in `css/style.css` ändern:

```css
:root {
    --primary-dark: #0a1628;    /* Hintergrund */
    --accent: #f59e0b;          /* WSF Orange */
    --secondary: #ff6b35;       /* Sekundär */
}
```

## 💾 Datenspeicherung

- Fortschritt wird im Browser (LocalStorage) gespeichert
- Jeder Student hat eigene Session
- Optional: PHP-Backend aktivierbar (siehe storage.js)

## 🔧 Fehlerbehebung

**Folien laden nicht:**
- Prüfen Sie die Browser-Konsole (F12)
- Stellen Sie sicher, dass alle Dateien hochgeladen sind
- Der Webserver muss `.md` und `.json` Dateien ausliefern

**Presenter funktioniert nicht:**
- Testen Sie die Tasten im Browser
- Manche Presenter benötigen HID-Modus

## 📝 Lizenz

Erstellt für Wirtschaftsschule Five
