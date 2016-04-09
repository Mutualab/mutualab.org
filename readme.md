#Site internet du mutualab

Site de l'espace de coworking mutualab

 - Le projet est un site statique généré par un build tool (gulp)

##Développement 
Les pré-requis : 
  - nodejs
  - bower
  - gulp

###Installer le projet en développement
 - Cloner le repo : `git clone https://github.com/Mutualab/mutualab.org.git`

 - Installer les dépendances du build tool de développement :  `npm install` à executer à la racine du repo

 - Installer les dépendances du site `bower install`

 - Pour executer le projet en dev :  `gulp watch`

 - Pour builder le projet :  `gulp build`

*cette commande va automatiquement builder pour le déployer facilement*

## Modifier les contenus du site
 - Les contenus se trouvent dans le dossier content, ils sont composé de .json qui permettent de modifier les contenu de l'interface et les configuration et des fichier .md qui concernent les contenus courants du site
 - Pour modifier ces contenu vous devez : avoir un compte github, être autorisé à modifier le projet mutualab.org
 
 - Vous pouvez modifier ces contenu directement sur github, il existe d'autre editeur de fichier .md accessible depuis internet via son compte github ou en passant par le site [prose.io](http://prose.io)
 
