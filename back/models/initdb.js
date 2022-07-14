//Import des models
const User = require('./userSchema');
const Customers = require('./clientSchema');
const Products = require('./articleSchema');

//Synchronisation de la base de données
const Init = async () => {
    //User.hasMany(Post, {onDelete:'CASCADE'});
    //Post.belongsTo(User, {onDelete: 'CASCADE'});
    //User.hasMany(Comment, {onDelete: 'CASCADE'});
    await User.sync({alter: true});
    await Customers.sync({alter: true});
    await Products.sync({alter: true});
}

module.exports = Init;