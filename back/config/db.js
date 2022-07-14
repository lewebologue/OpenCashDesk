const {Sequelize} = require('sequelize');
//Parametres de connexion
const db = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD, {
    dialect: 'mariadb',
    host: process.env.DB_HOST,
    //loggin: true,
});

//Connection à la base de données
try {
    db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = db;