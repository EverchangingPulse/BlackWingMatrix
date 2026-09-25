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

Aktuelle Version: **1.29.18**.

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

## Adaptiver Test

Der adaptive Test beginnt mit drei Kalibrierungsaufgaben. Danach verschiebt eine richtige Antwort die nächste Aufgabe tendenziell zu einer höheren internen Schwierigkeit, eine falsche Antwort zu einer niedrigeren. Zusätzlich werden die Aufgabenfamilien variiert, damit das Ergebnis nicht von nur einem Mustertyp abhängt.

Vier Optionen sind unabhängig voneinander und standardmäßig deaktiviert: richtig/falsch anzeigen, Erklärung anzeigen, numerische Schwierigkeitswerte während des Tests anzeigen und numerische Werte in der Endauswertung anzeigen.

## Feedback und Erklärungen

Wenn aktiviert, beschreibt BlackWingMatrix die vorgesehene visuelle Regel. Nach einer falschen Antwort konzentriert sich die Erklärung auf die tatsächlich gewählte Option, verwendet sichtbare Belege aus der aktuellen Matrix, nennt korrekt erkannte Eigenschaften und zeigt einen konkreten Widerspruch, der die Wahl ausschließt.

## Aufgabenfamilien

Enthalten sind unter anderem Gitterbewegungen, Beziehungen zwischen Außenform und Innensymbol, Punktanordnungen, Linienkompositionen, Mini-Gitter-Logik, Polyomino-Drehungen, Formen und Füllungen, diagonale Füllungen, Symbolreihenfolgen, radiale Muster, Block- und Punktausgleich, Segmentüberlagerungen und gemischte Transformationen.

## Schwierigkeit und Ergebnisse

Die Schwierigkeit ist eine interne relative Skala, mit der erzeugte Aufgaben verglichen und die nächste Aufgabe im adaptiven Test ausgewählt wird. Die Endauswertung kann nur qualitative Kategorien oder zusätzlich numerische Werte anzeigen. Die maximale Schwierigkeit mit richtiger Antwort bezeichnet die schwierigste gewertete Aufgabe, die korrekt beantwortet wurde.

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
2. **Adaptiver Test** oder **Einzelaufgabe** wählen.
3. Bei Bedarf Zeitlimit und maximale Aufgabenanzahl einstellen.
4. Sitzung starten und für jede Matrix eine von acht Antworten auswählen.
5. Am Ende die Zusammenfassung ansehen. Feedback und Erklärungen erscheinen nur, wenn sie aktiviert wurden.

## Lizenz und Namensnennung

Originales BlackWingMatrix-Material, an dem die Repository-Autoren die Rechte besitzen, steht unter der **Apache License 2.0**. Siehe [LICENSE](LICENSE), [NOTICE](NOTICE) und [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix basiert teilweise auf Arbeit und Ideen aus **pyRavenMatrices — Can Mekik**. Rechte an Drittmaterial verbleiben bei den jeweiligen Rechteinhabern; die Apache-2.0-Erklärung gilt nur für Material, über das die Autoren dieses Repositorys verfügen dürfen.

## Probleme melden

Besonders hilfreich sind Meldungen zu mehrdeutigen Matrizen, scheinbar doppelten Antworten, unklaren Erklärungen, Darstellungsfehlern, inkonsistenter Schwierigkeit, nicht ableitbaren Regeln und mobilen Layoutproblemen. Wenn möglich: Seed, Aufgabenfamilie, Stufe, Screenshot und Browser angeben.

---

BlackWingMatrix ist ein experimentelles Projekt zum Studium und Training prozedural erzeugten visuellen Denkens.
