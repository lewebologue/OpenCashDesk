# OpenCashDesk - Une application de caisse

Projet personnel de création d'une application d'encaissement open source.
Ce projet existe uniquement à des fins de maintien de compétences. L'application n'a pas pour but d'être utilisée par des professionnels.

Il est fortement déconseillé d'utiliser cette application web dans le cadre de votre activité professionnelle.
La responsabilité des/des développeurs ayant participé au projet ne pourra être engagée.

## Technologies utilisées
- NodeJs + express + sequelize
- Mysql(MariaDB)

## Mise en place du projet
Créer une base de données en local. Pour ce faire, vous devez : 
- Créer une base de données mySQL
- Créer un utilisateur et un mot de passe
- Entrer ces informations dans le fichier ".env" aux emplacements prévus

## Déploiement et lancement du Frontend

Ouvrir le dossier Frontend dans le terminal de votre éditeur puis exécuter la commande:

    npm install

puis

    npm run serve

puis rendez-vous à cette adresse:

- http://localhost:8080/

## Déploiement et lancement du Backend

Ouvrir le dossier Backend dans le terminal de votre éditeur puis exécuter la commande:

    npm install

puis

    nodemon server ou node server

## Erreur possibles

Dans le cadre d'un deploiment sous linux, node v18 présentant des dysfonctionnements sur ce sytème d'éxploitation, vous devez lancer le front-end avec la version 16(LTS).