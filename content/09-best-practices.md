:::module{id="9" title="Best Practices" duration="30"}

:::title-slide

# Best Practices 2026

Prompting-Mastery, häufige Fehler und ROI-Messung

---slide---

## Die Kunst des Promptings 2026

:::info
**49% aller ChatGPT-Nutzung** ist "Fragen stellen" – die Qualität der Frage bestimmt die Qualität der Antwort. Prompting ist die wichtigste KI-Kompetenz 2026.
:::

**Regel Nr. 1: Klarheit siegt**

❌ Schlecht:
> "Erzähl mir über Vertrieb"

✅ Gut:
> "Erstelle eine 3-Absatz-Zusammenfassung der Q3-Verkäufe nach Region. Hebe die Top-3-Performer hervor und nenne je einen Verbesserungsvorschlag. Zielgruppe: Geschäftsleitung. Ton: faktenbasiert, nicht werblich."

---slide---

## Prompting-Framework: CRISP

**C** – **Context** (Kontext und Hintergrund geben)
**R** – **Role** (Rolle zuweisen: "Du bist ein erfahrener...")
**I** – **Instructions** (Klare, priorisierte Anweisungen)
**S** – **Specifics** (Format, Länge, Sprache, Ton)
**P** – **Parameters** (Einschränkungen: was NICHT tun)

---slide---

## CRISP in Aktion

```
[Context]
Ich bin Marketing-Manager eines B2B-SaaS-Unternehmens
in der Schweiz mit 50 Mitarbeitenden. Wir verkaufen
Buchhaltungssoftware an KMU.

[Role]
Agiere als erfahrener Content-Stratege mit
10+ Jahren B2B-Erfahrung im DACH-Raum.

[Instructions]
Erstelle einen LinkedIn-Post über den Einsatz
von KI in der Buchhaltung.

[Specifics]
- Max. 150 Wörter
- Professioneller aber zugänglicher Ton
- Schweizer Hochdeutsch (kein ß)
- Mit einer Frage am Ende für Engagement

[Parameters]
- Keine Emojis
- Keine Buzzwords wie "revolutionär" oder "Game-Changer"
- Keine allgemeinen KI-Versprechen, nur konkrete Beispiele
```

---slide---

## Fortgeschrittene Prompting-Techniken

**1. Chain-of-Thought (Schrittweises Denken)**
> "Bevor du antwortest, denke Schritt für Schritt nach und zeige deine Überlegungen."

**2. Few-Shot (Beispiele geben)**
> "Hier sind 3 Beispiele guter LinkedIn-Posts unserer Branche: [Beispiele]. Erstelle einen ähnlichen."

**3. Persona + Constraints**
> "Du bist ein skeptischer CFO. Prüfe diesen Investitionsvorschlag und nenne die 5 grössten Risiken."

**4. Iteratives Verfeinern**
> "Das ist gut, aber: Mach den Einstieg provokativer. Kürze auf 100 Wörter. Ersetze den CTA durch eine Frage."

:::info
**Pro-Tipp 2026:** Nutzen Sie die **Reasoning-Stufen** der Modelle. Für einen einfachen Social Post: niedrige Stufe. Für eine Strategieanalyse: hohe Stufe.
:::

---slide---

## Fehler 1: Übervertrauen – der teuerste Fehler

:::warning
**KI-Outputs können 2.5–6.2% Halluzinationen enthalten.** Auch GPT-5.2 mit 40% weniger Halluzinationen ist nicht fehlerfrei.
:::

**Reale Fälle:**
- Anwalt reicht **6 erfundene Gerichtsfälle** ein → $5'000 Strafe
- Air Canada haftet für **falsche Versprechen** des KI-Chatbots
- Finanzberichte mit **halluzinierten Zahlen** an Investoren

**Die goldene Regel:**
> KI ist ein brillanter Praktikant: schnell, fleissig, kreativ – aber Sie müssen **jedes Ergebnis prüfen**, bevor es nach aussen geht.

---slide---

## Fehler 2: Datenschutz ignorieren

:::warning
**39% der Mitarbeitenden** haben unwissentlich vertrauliche Arbeitsdaten in KI-Tools eingegeben. Über **50%** der KI-Nutzung ist nicht von der IT genehmigt.
:::

**Niemals in kostenlose KI-Tools eingeben:**
- Vertrauliche Kundendaten oder Verträge
- Geschäftsgeheimnisse oder Finanzdaten
- Personenbezogene Daten (Namen, Adressen, Gehälter)
- Passwörter, API-Keys oder Zugangsdaten
- Unveröffentlichte Produkt- oder Strategieinformationen

**Lösung:** Enterprise-Versionen nutzen (ChatGPT Team/Enterprise, Claude for Work, Copilot) – diese nutzen Ihre Daten **nicht** fürs Training.

---slide---

## Fehler 3: Kein Human-in-the-Loop

**KI soll unterstützen, nicht ersetzen!**

**Immer menschliche Prüfung bei:**
- **Kundenkommunikation** – KI kennt Ihre Beziehung nicht
- **Rechtliche Dokumente** – Halluzinationen können teuer werden
- **Finanzentscheidungen** – KI hat kein Haftungsrisiko
- **Personalentscheidungen** – nDSG verlangt menschliche Überprüfung
- **Medizinische/Gesundheitsinhalte** – Fehler können gefährlich sein

:::success
**Best Practice:** Definieren Sie in Ihrer KI-Policy, welche Outputs **immer** von einem Menschen geprüft werden müssen – und welche "KI-only" gehen dürfen (z.B. interne Zusammenfassungen).
:::

---slide---

## ROI messen: Das Framework

**Formel:**
> KI-ROI = (Generierter Wert − Gesamtinvestition) / Gesamtinvestition × 100

**Wert berechnen:**
- Gesparte Stunden × interner Stundensatz
- Reduzierte Fehlerkosten
- Höhere Konversionsraten (messbar!)
- Schnellere Durchlaufzeiten (Time-to-Market)

**Kosten erfassen:**
- Lizenzen (pro Nutzer/Monat)
- Schulung & Onboarding (einmalig + laufend)
- Integration & IT-Aufwand
- Governance & Compliance

---slide---

## Typische ROI-Werte 2026

| Bereich | Zeitersparnis | Amortisation |
|---------|--------------|--------------|
| Meeting-Protokolle | 80–90% | Sofort |
| Content-Erstellung | 40–60% | 1–3 Monate |
| E-Mail-Marketing | 30–40% | 2–4 Monate |
| Lead-Scoring & Priorisierung | 15–25% mehr Konversion | 2–3 Monate |
| Dokumentenübersetzung | 70–80% | Sofort |
| CRM-Datenpflege | 60–75% | 1–2 Monate |

:::info
**Benchmark:** Unternehmen berichten durchschnittlich **$3.70 Rendite pro investiertem Dollar** in KI. 60% der Organisationen erreichen ROI innerhalb von 12 Monaten.
:::

---slide---

## Implementierungs-Roadmap

**Phase 1: Quick Wins (Woche 1–2)**
- Ein Tool wählen, das sofort Wirkung zeigt
- 3–5 Pilotnutzer definieren
- Zeitersparnis täglich dokumentieren

**Phase 2: Pilot (Woche 3–6)**
- KI-Policy erstellen und kommunizieren
- Feedback sammeln, Prompts optimieren
- Erste ROI-Messung durchführen

**Phase 3: Rollout (Woche 7–12)**
- Unternehmensweite Schulung
- Enterprise-Lizenzen beschaffen
- Governance-Prozesse etablieren
- Monatliches KI-Review einführen

---slide---

:::exercise{type="fill-blank" id="ex-prompt" title="Prompt verbessern" points="15"}
question: Verbessern Sie diesen Prompt mit dem CRISP-Framework.
text: Du bist ein ___ [Role]. Schreibe einen ___ [Instructions]. Die Zielgruppe ist ___ [Specifics]. Verwende KEINE ___ [Parameters].
blanks:
- erfahrener Schweizer B2B-Content-Stratege
- LinkedIn-Post über KI-gestützte Buchhaltung (max. 150 Wörter)
- CFOs und Finanzleiter in Schweizer KMU
- Emojis, Buzzwords oder allgemeine Versprechen
:::

---slide---

:::exercise{type="multiple-choice" id="ex-fehler" title="Fehler vermeiden" points="10"}
question: Was ist das grösste Risiko beim Einsatz von KI für Kundenkommunikation?
options:
- KI-generierte Texte direkt an Kunden senden ohne menschliche Prüfung
- Zu kurze Prompts schreiben
- Die kostenlose Version nutzen
- Mehrere KI-Modelle parallel testen
correct: A
hint: Denken Sie an Halluzinationen, falsche Versprechen und den Fall Air Canada.
:::

:::endmodule
