:::module{id="best-practices" title="Best Practices" duration="45"}

:::title-slide

# Best Practices & Verantwortung

Prompting lernen, Fehler vermeiden, verantwortungsvoll handeln

:::notes
Willkommen zur dritten und letzten Lektion. Jetzt geht es darum, wie ihr KI richtig einsetzt. Wir lernen, wie man gute Prompts schreibt – das ist quasi die Sprache, in der man mit KI redet. Dann schauen wir uns die haeufigsten Fehler an und wie man sie vermeidet. Und zum Schluss sprechen wir ueber Ethik, Recht und verantwortungsvollen Umgang. Das ist wichtig, weil KI-Kompetenz nicht nur "nutzen koennen" heisst, sondern auch "richtig nutzen koennen".
:::endnotes

---slide---

## Die Kunst des Promptings

:::info
**49% aller ChatGPT-Nutzung** ist "Fragen stellen" – die Qualitaet der Frage bestimmt die Qualitaet der Antwort. Prompting ist die wichtigste KI-Kompetenz 2026.
:::

**Regel Nr. 1: Klarheit siegt**

Schlecht:
> "Erzaehl mir ueber Vertrieb"

Gut:
> "Erstelle eine 3-Absatz-Zusammenfassung der Q3-Verkaeufe nach Region. Hebe die Top-3-Performer hervor und nenne je einen Verbesserungsvorschlag. Zielgruppe: Geschaeftsleitung. Ton: faktenbasiert, nicht werblich."

:::notes
Prompting ist die wichtigste KI-Kompetenz. 49 Prozent aller ChatGPT-Nutzung ist einfach Fragen stellen – und die Qualitaet eurer Frage bestimmt die Qualitaet der Antwort. Hier seht ihr den Unterschied: "Erzaehl mir ueber Vertrieb" gibt euch irgendetwas Generisches. Aber wenn ihr Kontext gebt, ein Format definiert und eine Zielgruppe nennt, bekommt ihr brauchbare Ergebnisse. Das ist wie im echten Leben: Je genauer ihr briefen, desto besser das Ergebnis.
:::endnotes

---slide---

## Das CRISP-Framework

**C** – **Context** (Kontext und Hintergrund geben)
**R** – **Role** (Rolle zuweisen: "Du bist ein erfahrener...")
**I** – **Instructions** (Klare, priorisierte Anweisungen)
**S** – **Specifics** (Format, Laenge, Sprache, Ton)
**P** – **Parameters** (Einschraenkungen: was NICHT tun)

:::warning
**Merke dir CRISP** – das ist dein Rezept fuer gute Prompts. Je mehr dieser fuenf Elemente du nutzt, desto besser das Ergebnis.
:::

:::notes
Damit ihr das systematisch machen koennt, gibt es das CRISP-Framework. C steht fuer Context – gebt der KI Hintergrund. R steht fuer Role – weist ihr eine Rolle zu, zum Beispiel "Du bist ein erfahrener Marketing-Experte". I steht fuer Instructions – klare Anweisungen, was sie tun soll. S steht fuer Specifics – Format, Laenge, Ton. Und P steht fuer Parameters – Einschraenkungen, also was sie nicht tun soll. Je mehr dieser fuenf Elemente ihr nutzt, desto besser das Ergebnis.
:::endnotes

---slide---

## CRISP in Aktion

```
[Context]
Ich bin Marketing-Manager eines B2B-Unternehmens
in der Schweiz mit 50 Mitarbeitenden. Wir verkaufen
Buchhaltungssoftware an KMU.

[Role]
Agiere als erfahrener Content-Stratege mit
10+ Jahren B2B-Erfahrung im DACH-Raum.

[Instructions]
Erstelle einen LinkedIn-Post ueber den Einsatz
von KI in der Buchhaltung.

[Specifics]
- Max. 150 Woerter
- Professioneller aber zugaenglicher Ton
- Schweizer Hochdeutsch
- Mit einer Frage am Ende fuer Engagement

[Parameters]
- Keine Buzzwords wie "revolutionaer"
- Keine allgemeinen KI-Versprechen, nur konkrete Beispiele
```

:::notes
Hier seht ihr CRISP in Aktion. Beachtet, wie viel Information die KI bekommt: Wer ihr seid, was euer Unternehmen macht, welche Rolle sie einnehmen soll, was genau sie tun soll, in welchem Format und Ton, und was sie vermeiden soll. Mit diesem Prompt bekommt ihr einen deutlich besseren LinkedIn-Post als mit "Schreib mir was ueber KI in der Buchhaltung". Probiert es aus – ihr werdet den Unterschied sofort merken.
:::endnotes

---slide---

## Fortgeschrittene Prompting-Techniken

**1. Chain-of-Thought (Schrittweises Denken)**
> "Bevor du antwortest, denke Schritt fuer Schritt nach und zeige deine Ueberlegungen."

**2. Few-Shot (Beispiele geben)**
> "Hier sind 3 Beispiele guter LinkedIn-Posts unserer Branche: [Beispiele]. Erstelle einen aehnlichen."

**3. Persona + Constraints**
> "Du bist ein skeptischer CFO. Pruefe diesen Investitionsvorschlag und nenne die 5 groessten Risiken."

**4. Iteratives Verfeinern**
> "Das ist gut, aber: Mach den Einstieg provokativer. Kuerze auf 100 Woerter. Ersetze den CTA durch eine Frage."

:::info
**Pro-Tipp:** Nutze die **Reasoning-Stufen** der Modelle. Fuer einen einfachen Social Post: niedrige Stufe. Fuer eine Strategieanalyse: hohe Stufe.
:::

:::notes
Jetzt noch vier fortgeschrittene Techniken. Erstens: Chain-of-Thought. Sagt der KI, sie soll Schritt fuer Schritt nachdenken – das verbessert die Qualitaet bei komplexen Aufgaben enorm. Zweitens: Few-Shot. Gebt der KI Beispiele, dann versteht sie besser, was ihr wollt. Drittens: Persona plus Constraints. Weist ihr eine spezifische Rolle zu UND sagt, was sie beachten muss. Und viertens: Iteratives Verfeinern. Ihr muesst nicht beim ersten Prompt perfekt sein. Gebt Feedback und verfeinert das Ergebnis Schritt fuer Schritt. Das ist voellig normal und sogar empfohlen.
:::endnotes

---slide---

:::exercise{type="fill-blank" id="ex-prompt" title="Prompt verbessern" points="15"}
question: Verbessere diesen Prompt mit dem CRISP-Framework.
text: Du bist ein ___ [Role]. Schreibe einen ___ [Instructions]. Die Zielgruppe ist ___ [Specifics]. Verwende KEINE ___ [Parameters].
blanks:
- erfahrener Schweizer B2B-Content-Stratege
- LinkedIn-Post ueber KI-gestuetzte Buchhaltung (max. 150 Woerter)
- CFOs und Finanzleiter in Schweizer KMU
- Buzzwords oder allgemeine Versprechen
:::

:::notes
Jetzt seid ihr dran. Vervollstaendigt den Prompt mit dem CRISP-Framework. Ueberlegt, welche Rolle, welche Anweisungen, welche Spezifikationen und welche Einschraenkungen sinnvoll waeren. Die Antworten orientieren sich am Beispiel, das wir gerade gesehen haben.
:::endnotes

---slide---

## Fehler 1: Uebervertrauen – der teuerste Fehler

:::warning
**KI-Outputs koennen 2.5-6.2% Halluzinationen enthalten.** Auch die neuesten Modelle mit deutlich weniger Halluzinationen sind nicht fehlerfrei.
:::

**Reale Faelle:**
- Anwalt reicht **6 erfundene Gerichtsfaelle** ein → $5'000 Strafe
- Air Canada haftet fuer **falsche Versprechen** des KI-Chatbots
- Finanzberichte mit **halluzinierten Zahlen** an Investoren

**Die goldene Regel:**
> KI ist ein brillanter Praktikant: schnell, fleissig, kreativ – aber du musst **jedes Ergebnis pruefen**, bevor es nach aussen geht.

:::notes
Jetzt zu den Fehlern. Der teuerste Fehler ist Uebervertrauen. KI-Modelle halluzinieren – das heisst, sie erfinden manchmal Fakten, die ueberzeugend klingen aber falsch sind. Ein Anwalt in den USA hat sechs Gerichtsfaelle zitiert, die ChatGPT komplett erfunden hat. Air Canada musste zahlen, weil ihr Chatbot falsche Erstattungsregeln versprochen hat. Die goldene Regel: Behandelt KI wie einen brillanten Praktikanten. Schnell und kreativ, aber ihr muesst alles pruefen, bevor es nach aussen geht.
:::endnotes

---slide---

## Fehler 2: Datenschutz ignorieren

:::warning
**39% der Mitarbeitenden** haben unwissentlich vertrauliche Arbeitsdaten in KI-Tools eingegeben. Ueber **50%** der KI-Nutzung ist nicht von der IT genehmigt.
:::

**Niemals in kostenlose KI-Tools eingeben:**
- Vertrauliche Kundendaten oder Vertraege
- Geschaeftsgeheimnisse oder Finanzdaten
- Personenbezogene Daten (Namen, Adressen, Gehaelter)
- Passwoerter, API-Keys oder Zugangsdaten
- Unveroeffentlichte Produkt- oder Strategieinformationen

**Loesung:** Enterprise-Versionen nutzen (ChatGPT Team/Enterprise, Claude for Work, Copilot) – diese nutzen deine Daten **nicht** fuers Training.

:::notes
Fehler Nummer zwei: Datenschutz ignorieren. 39 Prozent der Mitarbeitenden haben schon vertrauliche Firmendaten in kostenlose KI-Tools eingegeben, ohne darueber nachzudenken. Das ist ein riesiges Risiko. Die Regel ist einfach: Niemals vertrauliche Daten in kostenlose KI-Tools eingeben. Keine Kundendaten, keine Finanzzahlen, keine Passwoerter. Fuer ernsthafte Nutzung braucht ihr Enterprise-Versionen – die garantieren, dass eure Daten nicht fuers Training verwendet werden.
:::endnotes

---slide---

## Fehler 3: Kein Human-in-the-Loop

**KI soll unterstuetzen, nicht ersetzen!**

**Immer menschliche Pruefung bei:**
- **Kundenkommunikation** – KI kennt deine Beziehung nicht
- **Rechtliche Dokumente** – Halluzinationen koennen teuer werden
- **Finanzentscheidungen** – KI hat kein Haftungsrisiko
- **Personalentscheidungen** – Gesetz verlangt menschliche Ueberpruefung
- **Medizinische Inhalte** – Fehler koennen gefaehrlich sein

:::success
**Best Practice:** Definiere in deiner KI-Policy, welche Outputs **immer** von einem Menschen geprueft werden muessen – und welche "KI-only" gehen duerfen (z.B. interne Zusammenfassungen).
:::

:::notes
Fehler Nummer drei: Kein Mensch im Loop. KI soll unterstuetzen, nicht ersetzen. Es gibt Bereiche, wo ihr immer einen Menschen draufschauen lassen muesst. Kundenkommunikation, weil die KI eure Kundenbeziehung nicht kennt. Rechtliche Dokumente, wegen Halluzinationen. Finanzentscheidungen, weil die KI nicht haftet. Personalentscheidungen, weil das Gesetz eine menschliche Ueberpruefung verlangt. Definiert klar: Was darf KI alleine machen, und was muss immer ein Mensch pruefen?
:::endnotes

---slide---

## Deepfakes & Desinformation

**Die Technologie wird besser – und gefaehrlicher:**

- KI-generierte Videos sind in **Sekunden** erstellbar
- **Stimmenklone** brauchen nur 3 Sekunden Audiomaterial
- Deepfake-Erkennung wird zunehmend schwieriger

**Reale Faelle:**
- Deepfake-CFO in **Hongkong**: Mitarbeiter ueberweist **$25 Mio.** nach Videocall mit KI-generierten Kollegen
- KI-**Robocall imitiert Praesident Biden** → $6 Mio. Strafe
- Deepfake-Audio beschuldigt **Schulleiter** falscher Aussagen

:::warning
**Ab August 2026:** Der EU AI Act verlangt, dass **alle Deepfakes** klar als KI-generiert gekennzeichnet werden.
:::

:::notes
Ein Thema, das immer wichtiger wird: Deepfakes. Die Technologie ist mittlerweile so gut, dass man mit drei Sekunden Audiomaterial eine Stimme klonen kann. In Hongkong hat ein Mitarbeiter 25 Millionen Dollar ueberwiesen, nachdem er in einem Videocall mit fuenf Kollegen war – die alle Deepfakes waren. Das ist kein Science-Fiction, das passiert jetzt. Ab August 2026 muessen laut EU AI Act alle Deepfakes als KI-generiert gekennzeichnet werden. Fuer euer Unternehmen heisst das: Habt ein Verifizierungsprotokoll fuer grosse Transaktionen.
:::endnotes

---slide---

## Bias – KI uebernimmt Vorurteile

**KI lernt aus historischen Daten – und historische Daten sind voller Vorurteile.**

| Fall | Was passiert ist |
|------|-----------------|
| **Amazon (2018)** | KI-Recruiting bevorzugte Maenner – trainiert auf 10 Jahren maennerdominierter Daten |
| **Gesichtserkennung** | Fehlerrate hellhaeutige Maenner: 0.8% / dunkelhaeutige Frauen: 34.7% |
| **Gesundheit USA** | Algorithmus bevorzugte weisse Patienten wegen verzerrter Proxy-Daten |

:::info
**Merke:** KI ist nicht neutral. Sie spiegelt die Vorurteile in den Trainingsdaten wider. Deshalb ist menschliche Aufsicht unverzichtbar.
:::

:::notes
KI ist nicht neutral – sie uebernimmt die Vorurteile aus den Daten, mit denen sie trainiert wurde. Amazon musste sein KI-Recruiting-System einstellen, weil es Maenner bevorzugte. Bei der Gesichtserkennung liegt die Fehlerrate bei dunkelhaeautigen Frauen bei ueber 34 Prozent – gegenueber weniger als einem Prozent bei hellhaeutigen Maennern. Ein Gesundheitsalgorithmus in den USA bevorzugte weisse Patienten, weil er Gesundheitsausgaben als Proxy fuer Bedarf nutzte. Das zeigt: Menschliche Aufsicht ist unverzichtbar.
:::endnotes

---slide---

## Rechtslage Schweiz: Was du wissen musst

:::info
**Die Schweiz setzt auf einen pragmatischen Ansatz:** Kein umfassendes KI-Gesetz, sondern sektorspezifische Regulierung auf Basis bestehender Gesetze.
:::

**Das nDSG (seit September 2023) gilt fuer KI:**
- **Transparenzpflicht** – Nutzer muessen wissen, wenn sie mit KI interagieren
- **Automatisierte Entscheidungen** – Recht auf menschliche Ueberpruefung
- **Datenschutz-Folgenabschaetzung** bei Hochrisiko-Systemen

**Neu 2025:** Die Schweiz hat die **Europarats-Konvention zu KI** unterzeichnet – das weltweit erste voelkerrechtlich bindende KI-Abkommen.

:::notes
Kurz zur Rechtslage in der Schweiz. Die Schweiz hat kein eigenes KI-Gesetz wie die EU, sondern setzt auf bestehende Gesetze. Das nDSG, das neue Datenschutzgesetz, gilt direkt fuer KI. Das heisst: Wenn ihr KI einsetzt, die Personendaten verarbeitet, muesst ihr transparent sein. Bei automatisierten Entscheidungen haben Betroffene das Recht auf menschliche Ueberpruefung. Und 2025 hat die Schweiz die Europarats-Konvention zu KI unterzeichnet – bis Ende 2026 soll ein Gesetzesentwurf kommen.
:::endnotes

---slide---

## EU AI Act – auch fuer die Schweiz relevant

**Wann gilt der EU AI Act fuer Schweizer Firmen?**
Wenn KI-Systeme im **EU-Markt angeboten** werden oder KI-generierte **Outputs in der EU** verwendet werden.

| Risikoklasse | Beispiele | Konsequenz |
|-------------|-----------|------------|
| **Verboten** | Social Scoring, manipulative KI | Nicht erlaubt |
| **Hoch** | Personal-Screening, Kredit-Scoring | Strenge Pruefung |
| **Limitiert** | Chatbots, KI-generierte Inhalte | Kennzeichnungspflicht |
| **Minimal** | Spam-Filter, Empfehlungen | Keine Auflagen |

:::warning
**Sanktionen:** Bis zu **35 Mio. Euro** oder **7% des globalen Umsatzes**. Ab August 2026 muessen alle Chatbots und KI-Inhalte als KI-generiert **gekennzeichnet** werden.
:::

:::notes
Der EU AI Act ist auch fuer Schweizer Firmen relevant, wenn sie Kunden in der EU haben oder KI-Outputs in der EU verwendet werden. Er teilt KI-Systeme in Risikoklassen ein: Von verboten ueber hochriskant und limitiert bis minimal. Ab August 2026 muessen alle Chatbots und KI-generierten Inhalte gekennzeichnet werden. Die Sanktionen sind heftig: bis zu 35 Millionen Euro oder 7 Prozent des globalen Umsatzes. Also nehmt das ernst, auch wenn ihr in der Schweiz sitzt.
:::endnotes

---slide---

:::exercise{type="multiple-choice" id="ex-fehler" title="Fehler vermeiden" points="10"}
question: Was ist das groesste Risiko beim Einsatz von KI fuer Kundenkommunikation?
options:
- KI-generierte Texte direkt an Kunden senden ohne menschliche Pruefung
- Zu kurze Prompts schreiben
- Die kostenlose Version nutzen
- Mehrere KI-Modelle parallel testen
correct: A
hint: Denke an Halluzinationen, falsche Versprechen und den Fall Air Canada.
:::

:::notes
Kurze Uebung: Was ist das groesste Risiko beim Einsatz von KI fuer Kundenkommunikation? Denkt an das, was wir ueber Halluzinationen und den Fall Air Canada besprochen haben.
:::endnotes

---slide---

:::exercise{type="multiple-choice" id="ex-datenschutz" title="Datenschutz-Quiz" points="10"}
question: Welche Daten darfst du NIEMALS in kostenlose KI-Tools eingeben?
options:
- Oeffentlich verfuegbare Informationen
- Allgemeine Branchentrends
- Vertrauliche Kundendaten und Geschaeftsgeheimnisse
- Einen allgemeinen Text zum Umschreiben
correct: C
hint: Denke daran, was passiert, wenn diese Daten in den Trainingsdaten landen.
:::

:::notes
Noch eine Frage zum Datenschutz. Welche Daten duerft ihr auf keinen Fall in kostenlose KI-Tools eingeben? Die Antwort sollte nach unserer Diskussion klar sein.
:::endnotes

---slide---

:::task{id="ethik-guideline" title="KI-Richtlinien fuer dein Buero"}
Bildet **zwei Gruppen** und erarbeitet gemeinsam eine KI-Guideline fuer euer Unternehmen.

**Eure Aufgabe:**
Erstellt eine kurze, praktische Richtlinie (5-10 Regeln), die festlegt, wie KI-Tools im Bueroalltag verantwortungsvoll eingesetzt werden sollen.

**Denkt an:**
- Welche KI-Tools sind erlaubt / verboten?
- Wie gehen wir mit vertraulichen Daten um?
- Wer prueft KI-generierte Inhalte vor der Veroeffentlichung?
- Wie kennzeichnen wir KI-generierte Inhalte?
- Was passiert bei Verstoessen?

**Zeit:** 10 Minuten
:::endtask

:::notes
Jetzt eine Gruppenarbeit. Bildet bitte zwei Gruppen und erarbeitet gemeinsam eine KI-Guideline fuer euer Unternehmen. Ueberlegt: Welche Tools sind erlaubt, wie geht ihr mit Daten um, wer prueft die Ergebnisse? Ihr habt zehn Minuten. Bestimmt einen Schreiber pro Gruppe, der die Ergebnisse eingibt.
:::endnotes

---slide---

## Ergebnisse: KI-Richtlinien

:::taskresults{task="ethik-guideline" title="Eure KI-Richtlinien"}

:::notes
Jede Gruppe stellt kurz ihre Ergebnisse vor, zwei bis drei Minuten pro Gruppe. Wir schauen auf Gemeinsamkeiten und ergaenzen, was fehlt. Eine gute KI-Policy schuetzt das Unternehmen und die Mitarbeitenden.
:::endnotes

:::endmodule
