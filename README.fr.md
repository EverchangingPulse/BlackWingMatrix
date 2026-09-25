# BlackWingMatrix

<details>
<summary>🌐 Langue : Français</summary>

- [English](README.md)
- [Italiano](README.it.md)
- [Français](README.fr.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Português](README.pt.md)
- [Nederlands](README.nl.md)
- [Polski](README.pl.md)
</details>

**BlackWingMatrix** est une application web autonome destinée à l'entraînement au raisonnement abstrait et visuospatial à l'aide de matrices logiques 3×3 générées procéduralement.

Version actuelle : **1.29.16**.

## Essayer en ligne

**[Ouvrir BlackWingMatrix dans le navigateur](https://everchangingpulse.github.io/BlackWingMatrix/)**

La version GitHub Pages s'ouvre directement dans le navigateur : aucun téléchargement ni installation n'est nécessaire. Pour une utilisation hors ligne, le dépôt contient également le fichier HTML autonome complet.

## Fonctionnement

Chaque exercice présente une matrice 3×3 dont la case inférieure droite est manquante. Il faut choisir la bonne tuile parmi huit propositions. Le générateur produit de nombreuses familles de règles visuelles au lieu d'utiliser une liste fixe de questions.

- détection de motifs et relations entre lignes et colonnes
- changements de forme, position, rotation, symétrie et échelle
- remplissages, suites de symboles, quantités et compositions
- opérations sur mini-grilles et logique ensembliste/booléenne
- problèmes combinant plusieurs règles indépendantes

## Test adaptatif

Le test commence par trois exercices d'étalonnage. Ensuite, une bonne réponse tend à augmenter la difficulté interne de l'exercice suivant, tandis qu'une mauvaise réponse tend à la diminuer. Les familles d'exercices varient également afin d'éviter qu'un seul type de motif domine le résultat.

Quatre options sont indépendantes et désactivées par défaut : afficher correct/incorrect, afficher l'explication, afficher les valeurs numériques pendant le test et afficher les valeurs numériques dans le résumé final.

## Retour et explications

Lorsqu'elles sont activées, les explications décrivent la règle visuelle attendue et, après une erreur, se concentrent sur la réponse réellement choisie. Elles s'appuient autant que possible sur des éléments visibles de la matrice, distinguent ce qui est correct dans la réponse et montrent une contradiction concrète qui permet de l'écarter.

## Familles d'exercices

Le générateur comprend notamment des déplacements sur grille, relations forme extérieure/symbole intérieur, dispositions de points, compositions de lignes, logique sur mini-grilles, rotations de polyominos, formes et remplissages, remplissages diagonaux, ordre des symboles, motifs radiaux, équilibrage de blocs et de points, superpositions de segments et transformations mixtes.

## Difficulté et résultats

La difficulté est une échelle interne relative servant à comparer les exercices générés et à choisir le suivant dans le test adaptatif. Le résumé final peut n'afficher que des catégories qualitatives ou inclure les valeurs numériques si l'option correspondante est activée. La difficulté maximale avec réponse correcte correspond à l'exercice évalué le plus difficile auquel vous avez répondu correctement.

## Mode exercice unique

Le mode exercice unique permet de choisir la famille, la difficulté et, lorsqu'elles s'appliquent, les transformations ou opérations booléennes. Il sert à travailler une logique précise ou à reproduire un exercice donné.

## Reproductibilité

Chaque matrice possède une graine (seed). La même graine avec les mêmes réglages reproduit le même exercice, ce qui facilite les rapports de bug et les comparaisons entre versions.

## Utilisation hors ligne

BlackWingMatrix est aussi distribué sous la forme d'un seul fichier HTML. Téléchargez `blackwingmatrix.html` et ouvrez-le dans un navigateur moderne, sans backend, compte, base de données, Node.js ni Python.

## Limite importante

BlackWingMatrix est un outil expérimental d'entraînement et d'évaluation relative. Ce **n'est pas un test d'intelligence standardisé**, il ne fournit pas de QI validé, ne remplace pas les Raven's Progressive Matrices officielles et ne doit pas être utilisé seul pour tirer des conclusions cliniques ou psychologiques.

## Démarrage rapide

1. Ouvrez la version en ligne ou le fichier HTML autonome.
2. Choisissez **Test adaptatif** ou **Exercice unique**.
3. Si nécessaire, réglez la durée et le nombre maximal d'exercices.
4. Lancez la session et choisissez une réponse parmi huit pour chaque matrice.
5. À la fin, consultez le résumé. Le retour et les explications ne s'affichent que si vous les avez activés.

## Licence et attribution

Le contenu original de BlackWingMatrix dont les auteurs du dépôt détiennent les droits est distribué sous **Apache License 2.0**. Voir [LICENSE](LICENSE), [NOTICE](NOTICE) et [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix dérive en partie de travaux et d'idées de **pyRavenMatrices — Can Mekik**. Les droits sur les éléments tiers restent à leurs titulaires respectifs ; la déclaration Apache-2.0 ne couvre que le contenu sur lequel les auteurs de ce dépôt ont autorité.

## Signaler un problème

Les signalements utiles concernent notamment les matrices ambiguës, réponses visuellement dupliquées, explications peu claires, problèmes de rendu, difficulté incohérente, règles non déductibles et problèmes mobiles. Si possible, indiquez la graine, la famille, le niveau, une capture d'écran et le navigateur.

---

BlackWingMatrix est un projet expérimental consacré à l'étude et à l'entraînement du raisonnement visuel généré procéduralement.
