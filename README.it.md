# BlackWingMatrix

<details>
<summary>🌐 Lingua: Italiano</summary>

- [English](README.md)
- [Italiano](README.it.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Português](README.pt.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
</details>

**BlackWingMatrix** è un'applicazione web standalone per esercitare il ragionamento astratto e visuospaziale con matrici logiche 3×3 generate proceduralmente.

Versione corrente: **1.29.15**.

## Provalo online

**[Apri BlackWingMatrix nel browser](https://everchangingpulse.github.io/BlackWingMatrix/)**

La versione GitHub Pages si apre direttamente nel browser: non serve scaricare o installare nulla. Se vuoi usarlo offline, nel repository è disponibile anche il file HTML standalone completo.

## Cosa fa il programma

Ogni esercizio mostra una matrice 3×3 con la casella in basso a destra mancante. Devi scegliere la tessera corretta fra otto alternative. Il generatore crea molte famiglie di regole visive invece di basarsi su un insieme fisso di domande preparate a mano.

- riconoscimento di pattern visivi e relazioni fra righe e colonne
- cambiamenti di forma, posizione, rotazione, specchiatura e scala
- riempimenti, sequenze di simboli, quantità e composizioni
- operazioni su mini-griglie e logica insiemistica/booleana
- problemi a più regole nei quali bisogna seguire contemporaneamente proprietà indipendenti

## Test adattivo

Il test adattivo inizia con tre esercizi di calibrazione. Dopo la calibrazione, una risposta corretta tende a spostare l'esercizio successivo verso una difficoltà interna maggiore, mentre una risposta errata tende a ridurla. Il sistema varia anche le famiglie di esercizi per evitare che il risultato dipenda troppo da un solo tipo di pattern.

Quattro opzioni sono indipendenti e disattivate per impostazione predefinita: mostra corretto/errato, mostra spiegazione, mostra valori numerici durante il test e mostra valori numerici nel riepilogo finale.

## Feedback e spiegazioni

Quando sono abilitati, BlackWingMatrix spiega la regola visiva prevista e, dopo una risposta errata, si concentra sulla risposta effettivamente scelta. La spiegazione cerca di usare prove visibili nella matrice corrente, distinguere ciò che la risposta ha di corretto e indicare una contraddizione concreta che permette di scartarla.

## Famiglie di esercizi

Il generatore comprende spostamenti su griglia, relazioni fra forma esterna e simbolo interno, disposizioni di punti, composizioni di linee, logica su mini-griglie, rotazioni di polimini, forme e riempimenti, riempimenti diagonali, ordine dei simboli, motivi radiali, bilanciamento di blocchi e punti, sovrapposizioni di segmenti e altre trasformazioni miste.

## Difficoltà e risultati

La difficoltà è una scala interna relativa usata per confrontare gli esercizi generati e scegliere il successivo nel test adattivo. Il riepilogo finale può mostrare solo categorie qualitative oppure anche valori numerici se l'opzione corrispondente è attiva. La difficoltà massima con risposta corretta indica l'esercizio valutato più difficile a cui hai risposto correttamente.

## Modalità esercizio singolo

La modalità esercizio singolo permette di scegliere famiglia, difficoltà e, quando disponibili, trasformazioni o operazioni booleane. È utile per allenare una logica specifica o riprodurre un esercizio preciso.

## Riproducibilità

Ogni matrice generata possiede un seed. Usando lo stesso seed e le stesse impostazioni si ricrea lo stesso esercizio, facilitando segnalazioni di bug e confronti fra versioni.

## Utilizzo offline

BlackWingMatrix è distribuito anche come singolo file HTML. Puoi scaricare `blackwingmatrix.html` e aprirlo con un browser moderno senza backend, account, database, Node.js o Python.

## Limite importante

BlackWingMatrix è uno strumento sperimentale di esercitazione e valutazione relativa. **Non è un test di intelligenza standardizzato**, non fornisce un IQ validato, non sostituisce le Raven's Progressive Matrices ufficiali e non deve essere usato da solo per conclusioni cliniche o psicologiche.

## Come iniziare

1. Apri la versione online oppure il file HTML standalone.
2. Scegli **Test adattivo** oppure **Esercizio singolo**.
3. Nel test adattivo imposta, se necessario, limite di tempo e numero massimo di esercizi.
4. Avvia la sessione e scegli una delle otto risposte per ogni matrice.
5. Al termine consulta il riepilogo. Feedback e spiegazioni compaiono solo se li hai abilitati.

## Licenza e attribuzioni

Il materiale originale di BlackWingMatrix per il quale gli autori del repository possiedono i diritti è distribuito secondo la **Apache License 2.0**. Consulta [LICENSE](LICENSE), [NOTICE](NOTICE) e [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix deriva in parte da lavoro e idee presenti in **pyRavenMatrices — Can Mekik**. I diritti sul materiale di terzi rimangono dei rispettivi titolari; la dichiarazione Apache-2.0 riguarda solo il materiale sul quale gli autori di questo repository hanno autorità.

## Segnalare problemi

Sono particolarmente utili segnalazioni di matrici ambigue, risposte apparentemente duplicate, spiegazioni poco chiare, problemi di rendering, difficoltà incoerente, regole non inferibili e problemi su dispositivi mobili. Quando possibile includi seed, famiglia, livello, screenshot e browser.

---

BlackWingMatrix è un progetto sperimentale dedicato allo studio e all'esercizio del ragionamento visivo generato proceduralmente.
