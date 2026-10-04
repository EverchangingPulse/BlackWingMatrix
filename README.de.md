# BlackWingMatrix

<details>
<summary>🌐 Sprache: Deutsch</summary>

- [English](README.md)
- [Italiano](README.it.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Português](README.pt.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
</details>

**BlackWingMatrix** ist eine eigenständige Webanwendung zum Training abstrakten und visuell-räumlichen Denkens mit prozedural erzeugten 3×3-Logikmatrizen.

Aktuelle Version: **1.31.1**.

## Online ausprobieren

**[BlackWingMatrix im Browser öffnen](https://everchangingpulse.github.io/BlackWingMatrix/)**

Die GitHub-Pages-Version läuft direkt im Browser; Download oder Installation sind nicht erforderlich. Für die Offline-Nutzung enthält das Repository zusätzlich die vollständige eigenständige HTML-Datei.

## Was das Programm macht

Jede Aufgabe zeigt eine 3×3-Matrix, bei der das Feld unten rechts fehlt. Aus acht Möglichkeiten muss die passende Kachel gewählt werden. Der Generator erzeugt viele verschiedene Familien visueller Regeln statt eines festen Satzes handgeschriebener Aufgaben.

- Erkennen visueller Muster und Beziehungen zwischen Zeilen und Spalten
- Änderungen von Form, Position, Drehung, Spiegelung und Größe
- Füllungen, Symbolfolgen, Mengen und Zusammensetzungen
- Mini-Gitter sowie Mengen-/Boolesche Operationen
- Aufgaben mit mehreren gleichzeitig zu verfolgenden unabhängigen Regeln

## Sitzungsmodi

Der Sitzungswähler bietet fünf Modi:

- **Einzelaufgabe** — erzeugt eine reproduzierbare Aufgabe mit wählbarer Familie und qualitativer Stufe; je nach Familie auch mit Transformationen oder Booleschen Operationen.
- **Adaptiver Test** — Standardsitzung nach drei Kalibrierungsaufgaben.
- **Adaptiver Test mit schrittweisem Fortschritt** — Standardmodus; er nähert sich der geschätzten Grenze sanfter.
- **Progressiver Übersichtstest** — erhöht die Schwierigkeit schrittweise und wechselt passende Familien, ohne sich an Antworten anzupassen.
- **Test nach logischer Beziehung** — übt eine gewählte Gruppe: räumliche Transformationen, Boolesche Logik, Zeilen-, Spalten-, Diagonal-, Außen-/Innen- oder wiederverwendete Beziehungen.

## Adaptiver Test und Schwierigkeit

Alle Generatoren teilen eine interne **0–60-Skala**. Sie wird in Einzelaufgaben, Kalibrierung und allen Testmodi verwendet; die sechs sichtbaren Bezeichnungen sind nur qualitative Bänder dieser Skala.

Jede adaptive Sitzung beginnt mit drei erzeugten Kalibrierungsaufgaben. Die angeforderten Schwierigkeiten werden auf einem 0,01-Raster gewählt: das mittlere Element liegt bei 23–27, das erste bei 10–16 und das dritte ergänzt eine Kalibrierungssumme von 74–76. Familien werden nur aus Generatoren gewählt, die die angeforderte Schwierigkeit tatsächlich erzeugen können.

Nach der Kalibrierung berücksichtigen die nächsten Aufgaben frühere Leistung, Antwortzeit, Fehlerfolgen, die höchste korrekt gelöste Schwierigkeit und die Nähe einer falschen Option zur Lösung in dieser Familie. Der schrittweise Modus dämpft den frühen Anstieg und vermeidet dauerhafte Eskalation ohne zuverlässige Erfolge auf hohem Niveau.

Vier Optionen sind unabhängig voneinander und standardmäßig deaktiviert: richtig/falsch anzeigen, Erklärung anzeigen, numerische Schwierigkeitswerte während des Tests anzeigen und numerische Werte in der Endauswertung anzeigen.

## Feedback und Erklärungen

Wenn aktiviert, beschreibt BlackWingMatrix die vorgesehene visuelle Regel. Nach einer falschen Antwort konzentriert sich die Erklärung auf die tatsächlich gewählte Option, verwendet sichtbare Belege aus der aktuellen Matrix, nennt korrekt erkannte Eigenschaften und zeigt einen konkreten Widerspruch, der die Wahl ausschließt.

## Aufgabenfamilien

Enthalten sind unter anderem Gitterbewegungen, Beziehungen zwischen Außenform und Innensymbol, Punktanordnungen, Linienkompositionen, Mini-Gitter-Logik, Polyomino-Drehungen, Formen und Füllungen, diagonale Füllungen, Symbolreihenfolgen, radiale Muster, Block- und Punktausgleich, Segmentüberlagerungen und gemischte Transformationen.

## Schwierigkeit, Ergebnisse und Analyse

Die Endauswertung enthält die schwierigste korrekt gelöste gewertete Aufgabe, die Abdeckung der Familien, die Stabilität des Verlaufs und den Grund für das Sitzungsende. Außerdem vergleicht sie den Verlauf nach der Kalibrierung mit simulierten Alles-richtig- und Alles-falsch-Referenzpfaden mit demselben Start. Dies ist weder ein Bevölkerungsperzentil noch ein IQ-Wert.

Der Tab **Gauß** speichert den lokalen Verlauf, kann CSV exportieren und importieren, gespeicherte Schwierigkeitswerte neu berechnen und 200 Referenzprofile simulieren. Adaptive Sitzungen lassen sich zusätzlich als JSON und CSV exportieren.

## Einzelaufgabenmodus

Im Einzelaufgabenmodus lassen sich Familie, Schwierigkeit und – falls relevant – Transformationen oder Boolesche Operationen gezielt auswählen. Das eignet sich zum Üben einer bestimmten visuellen Logik oder zum Reproduzieren einer konkreten Aufgabe.

## Reproduzierbarkeit

Jede erzeugte Matrix besitzt einen Seed. Mit demselben Seed und denselben Einstellungen entsteht dieselbe Aufgabe erneut, was Fehlerberichte und Versionsvergleiche erleichtert.

## Offline-Nutzung

BlackWingMatrix wird außerdem als einzelne HTML-Datei bereitgestellt. `blackwingmatrix.html` kann heruntergeladen und in einem modernen Browser ohne Backend, Konto, Datenbank, Node.js oder Python geöffnet werden.

## Wichtige Einschränkung

BlackWingMatrix ist ein experimentelles Übungs- und relatives Bewertungswerkzeug. Es ist **kein standardisierter Intelligenztest**, liefert keinen validierten IQ-Wert, ersetzt keine offiziellen Raven's Progressive Matrices und sollte nicht allein für klinische oder psychologische Schlussfolgerungen verwendet werden.

## Schnellstart

1. Online-Version oder eigenständige HTML-Datei öffnen.
2. Einen Sitzungsmodus wählen. **Adaptiver Test mit schrittweisem Fortschritt** ist standardmäßig ausgewählt.
3. Zeitlimit und maximale Aufgabenanzahl einstellen oder Familie und Stufe für eine Einzelaufgabe wählen.
4. Sitzung starten und für jede Matrix eine von acht Antworten auswählen.
5. Am Ende die Zusammenfassung ansehen oder Ergebnisse exportieren. Feedback und Erklärungen erscheinen nur, wenn sie aktiviert wurden.

## Lizenz und Namensnennung

Originales BlackWingMatrix-Material, an dem die Repository-Autoren die Rechte besitzen, steht unter der **Apache License 2.0**. Siehe [LICENSE](LICENSE), [NOTICE](NOTICE) und [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix basiert teilweise auf Arbeit und Ideen aus **pyRavenMatrices — Can Mekik**. Rechte an Drittmaterial verbleiben bei den jeweiligen Rechteinhabern; die Apache-2.0-Erklärung gilt nur für Material, über das die Autoren dieses Repositorys verfügen dürfen.

## Probleme melden

Besonders hilfreich sind Meldungen zu mehrdeutigen Matrizen, scheinbar doppelten Antworten, unklaren Erklärungen, Darstellungsfehlern, inkonsistenter Schwierigkeit, nicht ableitbaren Regeln und mobilen Layoutproblemen. Wenn möglich: Seed, Aufgabenfamilie, Stufe, Screenshot und Browser angeben.

---

BlackWingMatrix ist ein experimentelles Projekt zum Studium und Training prozedural erzeugten visuellen Denkens.
