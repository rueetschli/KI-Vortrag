:::module{id="5" title="KI-Ethik" duration="30"}

:::title-slide

# Ethik und KI

Verantwortungsvoller Einsatz als Geschäftsnotwendigkeit

---slide---

## Warum KI-Ethik 2026 geschäftskritisch ist

:::warning
**50% der Leser** können KI-generierte Texte nicht von menschlich geschriebenen unterscheiden. Das macht Transparenz wichtiger denn je.
:::

**Warum es jetzt zählt:**
- EU AI Act schreibt **Kennzeichnungspflichten** ab August 2026 vor
- Ethische Fehltritte führen zu **messbaren Reputationsschäden**
- **93% der Führungskräfte** sagen: KI-Agenten verändern Kundenbeziehungen fundamental
- "Shadow Agents" – nicht autorisierte KI-Tools von Mitarbeitenden – machen über **50% der KI-Nutzung** in Unternehmen aus

---slide---

## Problem 1: Bias – KI übernimmt Vorurteile

**KI lernt aus historischen Daten – und historische Daten sind voller Vorurteile.**

**Amazon (2018):** KI-Rekrutierungssystem bevorzugte Männer für technische Positionen. Trainiert auf 10 Jahren männerdominierter Lebensläufe. → System wurde eingestellt.

**Gesichtserkennung (2024):**
- Fehlerrate hellhäutige Männer: **0.8%**
- Fehlerrate dunkelhäutige Frauen: **34.7%**

**Gesundheitsalgorithmus USA:** Bevorzugte weisse Patienten – weil Gesundheits*ausgaben* als Proxy für *Bedarf* verwendet wurden. Schwarze Patienten hatten historisch weniger Zugang zum Gesundheitssystem.

---slide---

## Problem 2: Halluzinationen – KI erfindet "Fakten"

:::warning
**KI-Outputs enthalten 2.5–6.2% Halluzinationen** – bei GPT-5.2 ist es immerhin 40% weniger als bei Vorgängern, aber das Risiko bleibt.
:::

**Reale Fälle:**
- Ein **Anwalt** reichte einen Schriftsatz mit **6 erfundenen Gerichtsfällen** von ChatGPT ein → $5'000 Strafe
- Air Canada wurde für **falsche Erstattungsversprechen** ihres KI-Chatbots haftbar gemacht
- Google's KI-Suchresultat empfahl, **Kleber auf Pizza** zu machen (Reddit-Quelle)

**Die Regel:** KI als "brillanten Praktikanten" behandeln – intelligent, aber **immer prüfen**.

---slide---

## Problem 3: Deepfakes & Desinformation

**Die Technologie wird besser – und gefährlicher:**

- KI-generierte Videos sind in **Sekunden** erstellbar
- **Stimmenklone** brauchen nur 3 Sekunden Audiomaterial
- Deepfake-Erkennung wird zunehmend schwieriger

**Reale Fälle:**
- KI-**Robocall imitiert Präsident Biden** → $6 Mio. Strafe
- Deepfake-CFO in **Hongkong**: Mitarbeiter überweist **$25 Mio.** nach Videocall mit KI-generierten Kollegen
- Deepfake-Audio beschuldigt **Schulleiter** falscher Aussagen → Morddrohungen

:::warning
**Ab August 2026:** Der EU AI Act verlangt, dass **alle Deepfakes** klar als KI-generiert gekennzeichnet werden.
:::

---slide---

## Problem 4: Die Black Box – fehlende Erklärbarkeit

**Viele KI-Systeme können ihre Entscheidungen nicht erklären.**

**Warum das problematisch ist:**
- Nutzer verstehen Ablehnungen nicht (Kredit, Bewerbung)
- **Audits** sind schwierig bis unmöglich
- **Compliance** mit nDSG und EU AI Act wird erschwert
- Informierte Einwilligung ist kaum möglich

**Die Lösung 2026:** Adjustable Reasoning – neuere Modelle zeigen ihre Denkschritte (Chain-of-Thought), wenn man sie lässt. Aber es bleibt eine Blackbox bei der Gewichtung.

---slide---

## Problem 5: Umweltbelastung

**KI braucht enorme Mengen Energie:**

- Eine ChatGPT-Anfrage: **10x mehr Energie** als eine Google-Suche
- KI-Stromverbrauch hat sich zwischen 2023 und 2026 **verzehnfacht**
- KI-bedingte **CO₂-Emissionen** sind seit 2019 um **48%** gestiegen
- US-Rechenzentren verbrauchen bereits **4.4% des US-Stroms**

**Was Unternehmen tun können:**
- **Kleinere Modelle** bevorzugen (SLMs statt GPT-5 für einfache Aufgaben)
- **Reasoning-Stufe anpassen** (nicht "xhigh" für eine einfache E-Mail)
- Anbieter mit erneuerbaren Energien wählen

---slide---

## Problem 6: Shadow Agents – das versteckte Risiko

:::warning
**Über 50%** der KI-Nutzung in Unternehmen geschieht ohne Wissen der IT-Abteilung – sogenannte "Shadow Agents".
:::

**Das Risiko:**
- **39% der Verbraucher** haben unwissentlich vertrauliche Arbeitsdaten in KI-Tools eingegeben
- Keine Datenschutz-Garantien bei kostenlosen Tools
- Geschäftsgeheimnisse können in Trainingsdaten landen
- Keine Audit-Trails, keine Governance

**Die Lösung:** Klare **KI-Policy** im Unternehmen, genehmigte Enterprise-Tools, regelmässige Schulungen.

---slide---

## Fragen an Ihren KI-Anbieter

**Vor der Tool-Auswahl klären:**

- Auf welchen Daten wurde trainiert? Gibt es **Bias-Tests**?
- Werden unsere Daten fürs **Training verwendet**?
- Wo werden unsere Daten **verarbeitet und gespeichert**?
- Gibt es **Enterprise-Versionen** mit Datenschutz-Garantien?
- Wie wird **menschliche Aufsicht** ermöglicht?
- Wie werden KI-generierte Inhalte **gekennzeichnet**?
- Welche **Zertifizierungen** liegen vor (SOC 2, ISO 27001)?

---slide---

:::exercise{type="multiple-choice" id="ex-ethik" title="Ethische Herausforderung" points="15"}
question: Ein KI-System zur Bewerberauswahl lehnt überproportional Kandidaten mit ausländisch klingenden Namen ab. Was ist die wahrscheinlichste Ursache?
options:
- Das System ist absichtlich diskriminierend programmiert
- Die Trainingsdaten enthielten historische Vorurteile
- Die KI hat eigenständig Diskriminierung "erfunden"
- Der Algorithmus ist veraltet
correct: B
hint: Denken Sie daran, woher KI "lernt" – und welche Muster in historischen Einstellungsdaten stecken.
:::

---slide---

:::exercise{type="text-input" id="ex-ethik-reflexion" title="Reflexion: Shadow Agents" points="10"}
question: Welche KI-Tools nutzen Sie oder Ihre Kollegen im Arbeitsalltag – und gibt es dafür eine offizielle Unternehmensrichtlinie?
placeholder: Beschreiben Sie, welche Tools genutzt werden und ob es Regeln dafür gibt...
minLength: 50
maxLength: 300
:::

:::endmodule
