# BlackWingMatrix

<details>
<summary>🌐 Taal: Nederlands</summary>

- [English](README.md)
- [Italiano](README.it.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Português](README.pt.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
</details>

**BlackWingMatrix** is een zelfstandige webapp voor het oefenen van abstract en visuospatieel redeneren met procedureel gegenereerde 3×3-logische matrices.

Huidige versie: **1.29.16**.

## Online proberen

**[BlackWingMatrix in de browser openen](https://everchangingpulse.github.io/BlackWingMatrix/)**

De GitHub Pages-versie opent rechtstreeks in de browser; downloaden of installeren is niet nodig. Voor offline gebruik bevat de repository ook het volledige zelfstandige HTML-bestand.

## Wat het programma doet

Elke oefening toont een 3×3-matrix waarvan het vak rechtsonder ontbreekt. Je kiest de juiste tegel uit acht alternatieven. De generator maakt veel verschillende families van visuele regels in plaats van een vaste verzameling handmatig geschreven vragen.

- visuele patronen en relaties tussen rijen en kolommen herkennen
- veranderingen in vorm, positie, rotatie, spiegeling en schaal
- vullingen, symboolreeksen, aantallen en composities
- mini-rasterbewerkingen en verzamelingen-/Booleaanse logica
- opgaven waarin meerdere onafhankelijke regels tegelijk gevolgd moeten worden

## Adaptieve test

De adaptieve test begint met drie kalibratieoefeningen. Daarna verschuift een correct antwoord de volgende oefening doorgaans naar een hogere interne moeilijkheid, terwijl een fout antwoord die doorgaans verlaagt. Ook worden verschillende oefenfamilies afgewisseld zodat het resultaat niet door één patroontype wordt bepaald.

Vier opties zijn onafhankelijk en standaard uitgeschakeld: correct/fout tonen, uitleg tonen, numerieke waarden tijdens de test tonen en numerieke waarden in het eindoverzicht tonen.

## Feedback en uitleg

Wanneer ingeschakeld legt BlackWingMatrix de bedoelde visuele regel uit. Na een fout antwoord richt de uitleg zich op de daadwerkelijk gekozen optie, gebruikt waar mogelijk zichtbaar bewijs uit de huidige matrix, benoemt wat wel klopt en wijst een concrete tegenspraak aan waarmee de keuze kan worden verworpen.

## Oefenfamilies

De generator bevat onder meer rasterbewegingen, relaties tussen buitenvorm en binnensymbool, puntpatronen, lijncomposities, mini-rasterlogica, polyomino-rotaties, vormen en vullingen, diagonale vullingen, symboolvolgorde, radiale patronen, blok- en puntbalans, segmentoverlays en andere gemengde transformaties.

## Moeilijkheid en resultaten

Moeilijkheid is een interne relatieve schaal om gegenereerde oefeningen te vergelijken en het volgende item in de adaptieve test te kiezen. Het eindoverzicht kan alleen kwalitatieve categorieën tonen of ook numerieke waarden. De maximale moeilijkheid met een correct antwoord is de moeilijkste beoordeelde oefening die correct is beantwoord.

## Modus enkele oefening

In de modus enkele oefening kun je familie, moeilijkheid en waar relevant transformaties of Booleaanse bewerkingen kiezen. Dat is nuttig om één type visuele logica te oefenen of een specifieke puzzel opnieuw te maken.

## Reproduceerbaarheid

Elke gegenereerde matrix heeft een seed. Met dezelfde seed en dezelfde instellingen ontstaat dezelfde oefening opnieuw, wat bugmeldingen en vergelijkingen tussen versies eenvoudiger maakt.

## Offline gebruik

BlackWingMatrix wordt ook als één HTML-bestand geleverd. Download `blackwingmatrix.html` en open het in een moderne browser zonder backend, account, database, Node.js of Python.

## Belangrijke beperking

BlackWingMatrix is een experimenteel oefen- en relatief beoordelingsinstrument. Het is **geen gestandaardiseerde intelligentietest**, levert geen gevalideerde IQ-score, vervangt de officiële Raven's Progressive Matrices niet en mag niet op zichzelf worden gebruikt voor klinische of psychologische conclusies.

## Snel beginnen

1. Open de online versie of het zelfstandige HTML-bestand.
2. Kies **Adaptieve test** of **Enkele oefening**.
3. Stel indien nodig de tijdslimiet en het maximale aantal oefeningen in.
4. Start de sessie en kies voor elke matrix één van de acht antwoorden.
5. Bekijk aan het einde het overzicht. Feedback en uitleg verschijnen alleen wanneer je ze hebt ingeschakeld.

## Licentie en naamsvermelding

Origineel BlackWingMatrix-materiaal waarop de auteurs van de repository de rechten bezitten, wordt verspreid onder de **Apache License 2.0**. Zie [LICENSE](LICENSE), [NOTICE](NOTICE) en [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix is gedeeltelijk gebaseerd op werk en ideeën uit **pyRavenMatrices — Can Mekik**. Rechten op materiaal van derden blijven bij de respectieve rechthebbenden; de Apache-2.0-verklaring geldt alleen voor materiaal waarover de auteurs van deze repository bevoegdheid hebben.

## Problemen melden

Nuttige meldingen gaan onder meer over dubbelzinnige matrices, antwoorden die er hetzelfde uitzien, onduidelijke uitleg, weergaveproblemen, inconsistente moeilijkheid, niet-afleidbare regels en mobiele layoutproblemen. Vermeld waar mogelijk seed, oefenfamilie, niveau, screenshot en browser.

---

BlackWingMatrix is een experimenteel project voor het bestuderen en oefenen van procedureel gegenereerd visueel redeneren.
