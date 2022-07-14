const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AES = require('../middleware/aes-encrypt');
const passwordValidator = require('password-validator');
const Customer = require('../models/clientSchema');

//Password format
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)                                    // Minimum 8 caractères
    .is().max(100)                                  // Maximum 100 caractères
    .has().uppercase()                              // Doit contenir au moins une majuscule
    .has().lowercase()                              // Doit contenir au moins une minuscule
    .has().digits(2)                                // Doit avoir au moins 2 chiffres
    .has().not().spaces()                           // Ne doit pas avoir d'espaces
    .is().not().oneOf(['Passw0rd', 'Password123', 'azerty1234']); // Liste de mots de passes interdits

//Create user
exports.signup = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
    }
    if (!passwordSchema.validate(password)) {
        return res.status(400).json({ error: 'Mot de passe incorrect' });
    }
    const cryptedEmail = AES.encrypt(email); //Chiffrage de l'adresse mail
    Customer.findOne({where: { email: cryptedEmail}})
    .then(customer =>{
        if(customer) {
            return res.status(400).json({error : 'Email already exist'});
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        Customer.create({
            firstName: firstName,
            lastName: lastName,
            email: cryptedEmail,
            password: hashPassword,
        })
        .then(() =>{ res.status(200).json({message: "Customer created"});
        })
        .catch(error => { res.status(400).json({ error: 'An error was occured, please try again later' });
        });
    })
    .catch(error => { res.status(500).json({error: 'Internal server error'})
    })
};

exports.login = (req, res, next) => {
    const cryptedEmail = AES.encrypt(req.body.email);
    Customer.findOne({where: {email: cryptedEmail}})
    .then(customer =>{
        if(!customer){
            return res.status(400).json({error: 'Customer not found'});
        }
        if (!bcrypt.compareSync(req.body.password, customer.password)) {
            return res.status(401).json({error: 'Incorrect password'});
        }
        if (customer.isActive === false) {
            return res.status(403).json({error: 'Inactive account'});
        }
        res.status(200).json({
            customerId: customer.id,
            token: jwt.sign({ customerId: customer.id}, 'process.env.TOKEN',{ expiresIn: '24h' })
        })
    })
    .catch(error => res.status(500).json({ error: 'Internal server error', message: error.message }));
};

exports.modifyCustomer = (req, res, next) => {
    Customer.findOne({where: {id: req.params.id}})
    .then(customer =>{
        if (customer.id === req.token.customerId || req.token.isAdmin === true){
            Customer.update({...customer, firstName: req.body.firstName, lastName: req.body.lastName}, {where: {id: req.params.id}})
                .then(() => res.status(201).json({ message: 'UCustomer modified' }))
                .catch(error => res.status(400).json({ error, message: error.message }));
        } else {
            return res.status(403).json({message: 'Unauthorized request'});
        }
    })
    .catch(error => res.status(500).json({error, message: error.message}));
};

exports.deleteCustomer = (req, res, next) => {
    Customer.findOne({where: {id: req.params.id}})
    .then(customer =>{
        if (customer.id === req.token.customerId || req.token.isAdmin === true){
            Customer.destroy({ where: { id: req.params.id } })
            .then(() => res.status(201).json({message: 'Cutommer deleted'}))
            .catch(error =>res.status(403).json({error, message: 'Unauthorized request'}));
        } else{
            return res.status(403).json({message: 'Unauthorized request'});
        }
    })
    .catch(error => res.status(500).json({error, message: error.message}));
};

exports.getOneCustomer = (req, res, next) => {
    Customer.findOne({where: {id: req.params.id}})
        .then((user)=>{
            if (user.id === req.token.userId && req.token.isAdmin){
                res.status(200).json(user);
            } else{
                res.status(403).json({ message: 'Unauthorized request'});
            }
        })
    .catch(error => res.status(500).json({error, message: error.message}));
};