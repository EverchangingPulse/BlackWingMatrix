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

Version actuelle : **1.31.1**.

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

## Modes de session

Le sélecteur propose cinq modes :

- **Exercice unique** — génère un exercice reproductible, avec le choix de la famille, de la plage qualitative et, selon le cas, des transformations ou opérations booléennes.
- **Test adaptatif** — session adaptative standard après trois exercices d'étalonnage.
- **Test adaptatif à progression graduelle** — mode par défaut ; il atteint plus doucement la frontière estimée.
- **Test panoramique progressif** — augmente progressivement la difficulté en alternant les familles adaptées, sans adaptation au résultat.
- **Test par relation logique** — entraîne un groupe choisi : transformations spatiales, logique booléenne, relations de lignes, colonnes, diagonales, extérieur/intérieur ou relations réutilisées.

## Test adaptatif et difficulté

Tous les générateurs partagent une échelle interne de difficulté **0–60**, utilisée en exercice unique, en étalonnage et dans tous les tests ; les six étiquettes visibles ne sont que des catégories qualitatives de cette échelle.

Chaque session adaptative commence avec trois exercices générés. Les difficultés demandées sont tirées sur une grille de 0,01 : l'élément central vaut 23–27, le premier 10–16, et le troisième complète un total d'étalonnage de 74–76. Les familles sont choisies parmi les générateurs capables de produire réellement le niveau demandé.

### Étalonnage des familles par le temps

L'étalonnage relatif d'une famille utilise **uniquement le temps de réponse** des rapports exportés. La justesse et la réponse choisie en sont volontairement exclues : elles servent au test adaptatif, pas à conclure qu'un générateur est intrinsèquement facile ou difficile.

Pour un temps de réponse `t` en secondes, la difficulté relative observée est convertie dans l'échelle interne par la courbe exponentielle négative bornée :

`D(t) = 5 + 55 × (1 − exp(−max(0, t − 1.364) / 8.7216))`.

Le délai initial écarte les réponses instantanées non plausibles ; le terme exponentiel modélise la saturation des temps de réponse en haut de l'échelle 0–60. Pour chaque famille, le résidu `D(t) − difficultéDemandée` est estimé localement (poids gaussiens, bande de 9 points) et par une courbe régularisée dépendante du niveau. La correction est bornée à ±10, multipliée par `(difficultéDemandée − 5) / 55` et appliquée continûment sur toute la plage de la famille.

Le générateur emploie ensuite le profil calibré inverse : pour une difficulté cible, il recherche le niveau structurel brut dont le score calibré est le plus proche. Les modes calibration, exercice unique et adaptatifs utilisent donc la même logique ; aucune famille n'occupe une position fixe dans le test.

La [spécification technique complète](docs/TIME_CALIBRATION.md) contient toutes les formules de correction et d'inversion, un graphique haute définition généré en Python, le code reproductible et les sources scientifiques du modèle.

Après l'étalonnage, le niveau demandé tient compte des résultats précédents, du temps de réponse, des séries d'erreurs, de la difficulté la plus élevée réussie et de la proximité de la réponse erronée avec la solution dans cette famille. Le mode graduel amortit la montée initiale et évite une escalade persistante sans réussite fiable aux hauts niveaux.

Quatre options sont indépendantes et désactivées par défaut : afficher correct/incorrect, afficher l'explication, afficher les valeurs numériques pendant le test et afficher les valeurs numériques dans le résumé final.

## Retour et explications

Lorsqu'elles sont activées, les explications décrivent la règle visuelle attendue et, après une erreur, se concentrent sur la réponse réellement choisie. Elles s'appuient autant que possible sur des éléments visibles de la matrice, distinguent ce qui est correct dans la réponse et montrent une contradiction concrète qui permet de l'écarter.

## Familles d'exercices

Le générateur comprend notamment des déplacements sur grille, relations forme extérieure/symbole intérieur, dispositions de points, compositions de lignes, logique sur mini-grilles, rotations de polyominos, formes et remplissages, remplissages diagonaux, ordre des symboles, motifs radiaux, équilibrage de blocs et de points, arithmétique ternaire avec retenue, superpositions de segments et logique distincte pour périmètre et segments intérieurs. Les familles de segments conservent des formes connexes, peuvent comporter des cycles et évaluent le nombre de segments générés et disponibles ainsi que l'opération booléenne.

## Difficulté, résultats et analyse

Le résumé final indique l'exercice évalué le plus difficile réussi, la couverture des familles, la stabilité du parcours et la raison de fin de session. Il compare aussi le parcours après étalonnage à des références simulées tout-correct et tout-faux avec le même départ ; ce n'est ni un percentile de population ni un score de QI.

L'onglet **Gaussien** conserve l'historique local, permet l'export et l'import CSV, le recalcul des difficultés et la simulation de 200 profils de référence. Les sessions adaptatives s'exportent également en JSON et CSV.

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
2. Choisissez un mode de session. **Test adaptatif à progression graduelle** est sélectionné par défaut.
3. Réglez la durée et le nombre maximal d'exercices, ou choisissez une famille et une plage pour un exercice unique.
4. Lancez la session et choisissez une réponse parmi huit pour chaque matrice.
5. À la fin, consultez le résumé ou exportez les résultats. Le retour et les explications ne s'affichent que si vous les avez activés.

## Licence et attribution

Le contenu original de BlackWingMatrix dont les auteurs du dépôt détiennent les droits est distribué sous **Apache License 2.0**. Voir [LICENSE](LICENSE), [NOTICE](NOTICE) et [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

BlackWingMatrix dérive en partie de travaux et d'idées de **pyRavenMatrices — Can Mekik**. Les droits sur les éléments tiers restent à leurs titulaires respectifs ; la déclaration Apache-2.0 ne couvre que le contenu sur lequel les auteurs de ce dépôt ont autorité.

## Signaler un problème

Les signalements utiles concernent notamment les matrices ambiguës, réponses visuellement dupliquées, explications peu claires, problèmes de rendu, difficulté incohérente, règles non déductibles et problèmes mobiles. Si possible, indiquez la graine, la famille, le niveau, une capture d'écran et le navigateur.

---

BlackWingMatrix est un projet expérimental consacré à l'étude et à l'entraînement du raisonnement visuel généré procéduralement.
