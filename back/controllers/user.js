const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AES = require('../middleware/aes-encrypt');
const passwordValidator = require('password-validator');
const fs = require('fs');

//Format imposé du mot de passe
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)                                    // Minimum 8 caractères
    .is().max(100)                                  // Maximum 100 caractères
    .has().uppercase()                              // Doit contenir au moins une majuscule
    .has().lowercase()                              // Doit contenir au moins une minuscule
    .has().digits(2)                                // Doit avoir au moins 2 chiffres
    .has().not().spaces()                           // Ne doit pas avoir d'espaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'azerty1234']); // Liste de mots de passes interdits

//Création d'un utilisateur
exports.signup = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
    }
    if (!passwordSchema.validate(password)) {
        return res.status(400).json({ error: 'Mot de passe incorrect' });
    }
    const cryptedEmail = AES.encrypt(email); //Chiffrage de l'adresse mail
    User.findOne({
        where: {
            email: cryptedEmail
        }
    })
        .then(user => {
            if (user) {
                return res.status(400).json({ error: 'Cet email est déjà utilisé' });
            }
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt); //Chiffrage du mot de passe
            User.create({
                firstName: firstName,
                lastName: lastName,
                email: cryptedEmail,
                password: hashPassword,
            })
                .then(() => { res.status(201).json({ message: 'Utilisateur créé avec succès !' });
                })
                .catch(error => { res.status(400).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur' });
                });
        })
        .catch(error => { res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur', message: error.message });
        });
};

//Connexion d'un utilisateur

exports.login = (req, res, next) =>{
    const cryptedEmail = AES.encrypt(req.body.email);
    User.findOne({ where: { email: cryptedEmail } || { username: req.body.username } })
        .then(user => {
            if (!user) {
                return res.status(400).json({ error: 'Utilisateur non trouvé' });
            }
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(400).json({ error: 'Mot de passe incorrect' });
            }
            res.status(200).json({
                userId: user.id,
                isAdmin: user.isAdmin,
                token: jwt.sign({ userId: user.id, isAdmin: user.isAdmin, sudo: user.isSuperAdmin}, 'process.env.TOKEN',{ expiresIn: '24h' }) //Generation du token d'authentification
            });
        })
        .catch(error => res.status(500).json({ error: 'Une erreur est survenue lors de la connexion', message: error.message }));
};

//Modification de l'utilisateur

exports.modifyUser = (req, res, next) => {
    if(req.file === undefined){ //Changement des données de l'utilisateur sans modification de l'image
        User.findOne({ where: { id : req.params.id } })
            .then(user =>{
                if (user.id === req.token.userId || req.token.isSuperAdmin){
                    User.update({...user, firstName: req.body.firstName, lastName: req.body.lastName}, { where: { id: req.params.id }})
                    .then(() => res.status(201).json({ message: 'Utilisateur modifié !' }))
                    .catch(error => res.status(400).json({ error, message: error.message }));
                } else {
                    res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cet utilisateur !' });
                }
            })
            .catch(error => res.status(500).json({ error, message: error.message }));        
    } else { // Modification de toutes les données de l'utilisateur
        const userImage = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        User.findOne({ where: { id: req.params.id } })
            .then((user) => { 
                if (user.id === req.token.userId){
                    const filename = user.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                    User.update({...user, firstName: req.body.firstName, lastName: req.body.lastName, imageUrl: userImage}, {where: {id: req.params.id}})
                        .then(() => res.status(201).json({ message: 'Utilisateur modifié !' }))
                        .catch(error => res.status(400).json({ error, message: error.message }));
                    });
                } else {
                    res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier cet utilisateur.' });
                }
            })
        .catch(error => res.status(500).json({ error, message: error.message }));
    }
};

//Récuperation de tous les utilisateurs

exports.getAllUsers = (req, res, next) => {
    User.findAll({ order: [['createdAt', 'DESC']],})
        .then((user)=>{
            if (user.id === req.token.userId || req.token.isAdmin){
                res.status(200).json(user);
            } else {
                res.status(403).json({ message: '403: Unauthorized request'});
            }
        })
        .catch(error => res.status(500).json({ error, message: error.message }));
};

//Récupération d'un seul utilisateur

exports.getOneUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id}})
        .then((user) => {
            if (user.id === req.token.userId || req.token.isAdmin){
                res.status(200).json(user);
            } else {
                res.status(403).json({ message: '403: Unauthorized request'});
            }
        })
        .catch(error => res.status(500).json({ error, message: error.message }));
};

//Suppression de l'image d'un utilisateur par l'administrateur ou par l'utilisateur
exports.deleteUserImage = (req, res, next) => {
    User.findOne({ where: { id: req.params.id } })
        .then((user) => {
            if (user.id === req.token.userId || req.token.isAdmin) {
                const filename = user.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    User.update({...user, imageUrl: 'https://i.postimg.cc/MHrVKYGM/default-profil-pict.jpg'}, { where: { id: req.params.id }})
                        .then(() => res.status(201).json({ message: 'Image supprimée !' }))
                        .catch(error => res.status(400).json({ error, message: error.message }));
                });
            } else {
                res.status(403).json({ message: '403: Unauthorized request' });
            }
        })
        .catch(error => res.status(500).json({ error, message: error.message }));
};

//Masquage d'un utilisateur par l'administrateur
exports.hideUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id } })
        .then((user) => {
            if (user.id === req.token.userId || req.token.isAdmin) {
                User.update({...user, isHidden: true}, { where: { id: req.params.id }})
                    .then(() => res.status(201).json({ message: 'Utilisateur masqué !' }))
                    .catch(error => res.status(400).json({ error, message: error.message }));
            } else {
                res.status(403).json({ message: '403: Unauthorized request' });
            }
        })
        .catch(error => res.status(500).json({ error, message: error.message }));
};