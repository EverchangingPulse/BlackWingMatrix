# BlackWingMatrix Adaptive Test

**BlackWingMatrix** è un'applicazione web standalone per esercizi di ragionamento astratto e visuospaziale basati su matrici logiche 3×3.

Versione corrente: **1.29.10**.

Genera dinamicamente problemi visivi nei quali bisogna individuare la figura mancante scegliendo fra otto possibili risposte. Include numerose famiglie di esercizi, livelli di difficoltà differenti, spiegazioni degli errori e una modalità di **test adattivo** che modifica progressivamente la complessità degli esercizi in funzione delle risposte date.

BlackWingMatrix funziona interamente nel browser: dopo il download non richiede server, installazione, account o connessione Internet.

> **Importante:** BlackWingMatrix è uno strumento sperimentale di esercitazione e valutazione relativa del ragionamento visivo. Non è un test di intelligenza standardizzato. I suoi punteggi non devono essere interpretati come IQ, diagnosi cliniche o valutazioni psicometriche certificate.

## Download diretto

**[Scarica BlackWingMatrix](https://raw.githubusercontent.com/EverchangingPulse/BlackWingMatrix/main/blackwingmatrix.html)**

Il link sopra punta direttamente al file HTML standalone corrente. Dopo il download, apri `blackwingmatrix.html` con un browser moderno.

Il repository contiene anche `index.html`, equivalente alla build standalone corrente.

## A cosa serve

BlackWingMatrix è progettato per esercitare e osservare diverse componenti del ragionamento astratto:

- identificazione di regole visive;
- ragionamento visuospaziale;
- rotazione mentale;
- trasformazioni geometriche;
- memoria di lavoro visiva;
- confronto simultaneo di più proprietà;
- composizione e decomposizione di figure;
- riconoscimento di sequenze;
- logica insiemistica e booleana;
- individuazione di relazioni fra righe e colonne;
- controllo di più regole indipendenti nello stesso problema.

Alcuni esercizi richiedono di seguire una sola trasformazione, mentre quelli più complessi combinano più proprietà contemporaneamente.

## Modalità disponibili

### Test adattivo

La modalità principale è il **Test adattivo**.

Il test inizia con esercizi di calibrazione e successivamente sceglie esercizi vicini alla difficoltà stimata per la persona. Una risposta corretta tende a spostare la selezione verso esercizi più complessi, mentre una risposta errata tende a spostarla verso esercizi meno complessi.

Il sistema varia inoltre le famiglie di esercizi per evitare che il risultato dipenda eccessivamente da un solo tipo di matrice.

Per impostazione predefinita, durante il test i valori di difficoltà e la stima adattiva sono nascosti, così l'interfaccia non suggerisce indirettamente se la risposta precedente fosse corretta. L'utente può scegliere di mostrarli tramite l'apposita opzione.

Il test può essere configurato con un limite temporale e un numero massimo di esercizi.

### Esercizio singolo

La modalità **Esercizio singolo** permette di scegliere direttamente:

- tipo di esercizio;
- livello di difficoltà;
- eventuale operazione booleana;
- specifiche trasformazioni.

È utile per esercitarsi su una categoria particolare o per studiare una regola nel dettaglio.

## Tipi di esercizi

BlackWingMatrix contiene numerose categorie generate proceduralmente, fra cui:

- Operazioni su Griglie
- Logica con Copertura Mobile
- Trasformazioni su Griglia
- Operazioni sul Contorno
- Progressioni di Figure
- Cicli di Trasformazione
- Spostamenti su Griglia
- Disposizioni di Punti
- Composizioni di Linee
- Operazioni su Mini-Griglie
- Blocchi e Rotazioni
- Forme e Riempimenti
- Riempimenti Diagonali
- Ordine dei Simboli
- Composizione di Figure
- Raggi e Orientamenti
- Sequenze e Quantità
- Riempimenti su Mini-Griglia
- Motivi Radiali
- Bilanciamento di Blocchi
- Bilanciamento di Punti
- Sovrapposizione di Segmenti

Gli esercizi possono combinare rotazione, traslazione, specchiatura, scala, composizione, sovrapposizione, operazioni logiche e trasformazioni di pattern.

## Logica booleana e inferibilità

Alcune matrici applicano una funzione fra due gruppi di elementi. Le operazioni disponibili possono includere:

- OR / unione;
- XOR / presenza in uno solo dei due gruppi;
- AND / intersezione;
- sottrazione;
- somma con molteplicità.

Il generatore è progettato affinché i comportamenti necessari per risolvere la riga finale siano già inferibili dai gruppi completi precedenti.

La copertura mobile può nascondere parte dell'informazione, ma non deve eliminare contemporaneamente causa ed effetto dello stesso caso discriminante. La trasformazione deve quindi rimanere deducibile da ciò che è visibile.

Ai livelli superiori aumenta il carico visuospaziale e di memoria di lavoro, evitando però densità così elevate da rendere più semplice seguire soltanto le poche celle vuote.

## Operazioni sul contorno

Alcuni problemi distribuiscono simboli lungo il perimetro di una figura e possono combinare:

- rotazione;
- specchiatura;
- spostamento dei simboli lungo il contorno;
- scambio fra figura esterna e simbolo ripetuto;
- variazioni di riempimento;
- coperture mobili.

Le spiegazioni usano riferimenti visivi naturali come **alto**, **alto-destra**, **destra**, **basso-destra**, **basso**, **basso-sinistra**, **sinistra** e **alto-sinistra**, evitando la nomenclatura interna del generatore.

## Risposte e distrattori

Ogni esercizio presenta otto possibili risposte.

Il generatore applica controlli automatici affinché:

- la risposta corretta sia presente;
- compaia una sola volta;
- tutte le alternative siano visivamente distinguibili;
- proprietà completamente nascoste non distinguano artificialmente due alternative che appaiono uguali;
- siano presenti distrattori vicini alla soluzione;
- la soluzione non sia riconoscibile tramite giveaway visivi accidentali.

Diverse famiglie producono deliberatamente **near-miss**, cioè alternative quasi corrette che differiscono dalla soluzione per una sola proprietà significativa.

## Spiegazioni delle risposte

Quando il feedback è abilitato, BlackWingMatrix può spiegare:

- quale regola era richiesta;
- quali proprietà della risposta scelta erano corrette;
- quali erano sbagliate;
- dove dovevano comparire punti, segmenti o simboli;
- quale rotazione, posizione, riempimento o trasformazione era necessaria;
- quali elementi mancavano;
- quali elementi erano presenti in più.

Le spiegazioni sono formulate in termini dell'aspetto effettivo della figura e non dei nomi interni usati nel codice.

## Difficoltà adattiva

BlackWingMatrix usa una scala interna di difficoltà relativa per:

- confrontare gli esercizi;
- scegliere il prossimo esercizio nel test adattivo;
- stimare la zona di difficoltà alla quale la persona riesce a lavorare.

La difficoltà può essere presentata anche in categorie qualitative, ad esempio **Molto facile**, **Facile**, **Media**, **Difficile** e **Molto difficile**.

La scala numerica interna **non è un punteggio IQ** e non deve essere convertita direttamente in IQ o percentili senza una validazione psicometrica appropriata.

## Visibilità di punteggi e difficoltà

Durante il test adattivo è possibile scegliere se visualizzare la difficoltà dell'esercizio e la stima adattiva corrente.

Con la visualizzazione disattivata, questi valori restano nascosti per evitare che un aumento o una diminuzione suggerisca indirettamente l'esito della risposta precedente.

Con la visualizzazione attivata, il programma può mostrare i valori numerici e le relative categorie qualitative anche durante il test. La stessa preferenza controlla il dettaglio numerico del riepilogo finale.

## Risposte troppo rapide

Il programma utilizza una soglia minima di latenza per evitare che click accidentali o risposte praticamente istantanee influenzino la stima adattiva.

Le risposte al di sotto della soglia possono essere conservate nei dati della sessione ma escluse dalla valutazione e dall'adattamento.

## Riproducibilità

Ogni matrice possiede un **seed**.

Usando lo stesso seed e le stesse impostazioni è possibile ricreare lo stesso esercizio. Questo facilita debugging, analisi degli errori, confronto fra versioni e segnalazione di matrici problematiche.

## Utilizzo offline

BlackWingMatrix è contenuto in un singolo file HTML e non richiede:

- backend;
- database;
- installazione;
- Node.js;
- Python;
- account utente;
- connessione a servizi esterni.

La logica del test viene eseguita localmente nel browser.

## Browser consigliati

È consigliata una versione recente di:

- Chrome / Chromium;
- Microsoft Edge;
- Firefox;
- Safari.

L'interfaccia è progettata anche per smartphone.

## Come iniziare

1. Scarica `blackwingmatrix.html`.
2. Aprilo con il browser.
3. Seleziona **Test adattivo** oppure **Esercizio singolo**.
4. Nel test adattivo imposta durata e numero massimo di esercizi, se necessario.
5. Avvia la sessione.
6. Seleziona una delle otto risposte per ogni matrice.
7. Consulta il riepilogo al termine.

## Interpretazione dei risultati

BlackWingMatrix non deve essere utilizzato da solo per formulare conclusioni cliniche o psicologiche.

In particolare:

- non fornisce un IQ standardizzato;
- non sostituisce Raven's Progressive Matrices ufficiali;
- non sostituisce una valutazione neuropsicologica;
- non fornisce diagnosi;
- non dispone ancora di norme rappresentative della popolazione generale.

Il risultato adattivo va interpretato come una misura **interna e relativa alla banca di esercizi generata dal programma**.

## Qualità del generatore

Il progetto include controlli automatici destinati a prevenire problemi tipici delle matrici generate proceduralmente:

- risposte duplicate;
- soluzione mancante;
- più soluzioni apparentemente corrette;
- stati interni differenti ma immagini finali identiche;
- indizi accidentali che rendono la soluzione troppo facile;
- casi logici presenti soltanto nella riga da completare;
- regole non inferibili dai gruppi di controllo;
- coperture che eliminano l'informazione necessaria;
- distrattori troppo lontani dalla soluzione.

Durante lo sviluppo il generatore è stato sottoposto a test automatici su grandi quantità di seed e, per le famiglie più delicate, anche a controlli sul rendering visivo.

## Licenza

Il materiale originale di BlackWingMatrix per il quale gli autori di questo repository possiedono i diritti è distribuito secondo la **Apache License 2.0**.

Consulta:

- [LICENSE](LICENSE)
- [NOTICE](NOTICE)
- [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)

La licenza Apache-2.0 **non pretende di rilicenziare materiale di terzi** sul quale gli autori di questo repository non possiedono autorità.

## Attribuzioni e materiale precedente

BlackWingMatrix deriva in parte da lavoro e idee presenti in:

**pyRavenMatrices — Can Mekik**  
https://github.com/cmekik/pyRavenMatrices

Una fase iniziale di BlackWingMatrix ha analizzato e adattato alcune geometrie e strutture provenienti da quel progetto.

I diritti sul materiale originale rimangono dei rispettivi titolari. Al momento della preparazione di questo repository non è stata verificata nel repository upstream una licenza software esplicita che autorizzi a considerare quel materiale Apache-2.0.

Per questo motivo il presente repository conserva esplicitamente l'attribuzione e limita la propria dichiarazione di licenza al materiale per il quale i suoi autori hanno effettivamente autorità.

Per i dettagli consulta [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Segnalare problemi

Le segnalazioni più utili riguardano:

- matrici ambigue;
- soluzioni apparentemente duplicate;
- spiegazioni poco chiare;
- problemi di rendering;
- difficoltà incoerente;
- regole non inferibili;
- problemi su dispositivi mobili.

Quando possibile, includi:

- seed;
- tipo di esercizio;
- livello;
- screenshot;
- browser utilizzato.

Questo permette di riprodurre esattamente la matrice.

---

BlackWingMatrix è un progetto sperimentale dedicato allo studio e all'esercizio del ragionamento visivo generato proceduralmente.
