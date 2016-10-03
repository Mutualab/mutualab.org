# Site internet du mutualab
[![Build Status](https://travis-ci.org/Mutualab/mutualab.org.svg?branch=master)](https://travis-ci.org/Mutualab/mutualab.org)

Site de l'espace de coworking mutualab




## Modifier les contenus du site
### Généralités 
 - Pour modifier les contenus vous devez : avoir un compte github et [soumettre une modification](#Soumettre-une-modification)

Vous pouvez modifier les contenus directement sur github, ou **en vous connectant à ce site [prose.io](http://prose.io) avec votre compte github**

Les contenus modifiables du site se trouvent dans le dossier [`contents`](contents/)

Ce dossier est composé de :

    - fichiers `.json` qui permettent de modifier des configurations et les textes génériques de l'interface ( boutons, navigation etc.) [Syntaxe Json](https://en.wikipedia.org/wiki/JSON#Example).

    - fichiers `.md` qui permettent de modifier les contenus enrichis, à l'aide de la syntaxe [Markdown](https://fr.wikipedia.org/wiki/Markdown) ([documentation](https://guides.github.com/features/mastering-markdown/#examples))
    - un dossier `pages` qui contient des pages de contenu enrichi qui seront générées par le site.

### Soumettre une modification
 - Cliquer sur le bouton (Fork en haut à droite) 
 - Effectuer les corrections et les enregistrer
 - Dans github cliquer sur **new pull-request** 
 - Décrire les modifications, si necessaire, et cliquer sur **create pull-request** 


### À propos des pages générées automatiquement
Pour chaque fichier `.md` que vous créez dans le dossier [`contents/pages`](contents/pages/) le moteur va générer une page `nom-du-fichier-md.html`vous pourrez alors l'utiliser comme lien dans un autre fichier `.md`.
Les pages utilisent le système de configuration [Front Matter](https://jekyllrb.com/docs/frontmatter/) pour définir les métadonnées de la page (titre de la page, description pour les moteurs de recherche etc.)

le modèle à respecter est le suivant :
```
---
title: Titre de la page
description: description pour les moteurs de recherche
nofollow: false ( optionnel )
---
```
**title** et **description** sont obligatoires, *nofollow* est optionnel

### Ajouter une image
Allez dans le dossier [`src/images`](src/images/) ajoutez le fichier (ou uploadez la sur github), vous pouvez ensuite vous servir de cette image dans un fichier `.md` 
le chemin relatif vers l'image commence par `images/<nom-du-fichier-avec-son-extension>`

### Utiliser un composant
Vous pouvez utiliser des composants dans les fichiers `.md` pour utiliser un composant vous devez employer la syntaxe suivante
```
[%components.<nom-du-composant>({"foo":"bar","lorem":"ipsum"})%]
```

#### Composants utilisables actuellement
##### components.pricingTable(configuration)
permet d'afficher le tableau des tarifs
```
[%components.pricingTable(<nom-du-fichier-de-configuration-du-tableau-sans-extension>)%]
```

##### components.callToAction({label,url})
permet d'afficher un gros bouton 
```
[%components.callToAction({label:"<texte-du-bouton>",url:"<adresse-du-bouton>"%]
```


## Contribuer

### Pré-requis : 
  - Nodejs
  - Bower
  - Gulp


### Installer le projet en développement
 - Cloner le repo : `git clone https://github.com/Mutualab/mutualab.org.git`
 - Installer les dépendances du build tool de développement :  `npm install` à executer à la racine du repo
 - Installer les dépendances du site `bower install`



### Commandes Gulp
 - Tâche de développement :  `gulp watch`
 - Pour générer le site :  `gulp build`
 - Pour générer le projet en local et lancer le serveur de test : `gulp build:serve`
 - Pour publier le site sur une page github :  `gulp build:gh-pages`
 

### Structure du projet

```
.
|-contents                ->  Contenus modifiables 
|---pages                 ->  Pages dynamiques
|-gulp                    ->  Taches Gulp
|-src                     ->  Sources du site
|---fonts                 ->  Typographies
|---images                ->  Images du site 
|---ng                    ->  Logique cliente ( AngularJs )
|-----templates           ->  Templates client ( AngularJs )
|---render                ->  Pages serveur ( Nunjucks )
|-----components          ->  Composant utilisable dans les fichier `.md` ( Nunjucks )
|-----templates           ->  Templates des pages dynammiques ( Nunjucks )
|-----views               ->  Templates serveur ( Nunjucks )
|---sass                  ->  Styles de l'application ( Scss )
|-----components          ->  Styles des composants ( Scss )
|-----pages               ->  Styles des pages ( Scss )
```



