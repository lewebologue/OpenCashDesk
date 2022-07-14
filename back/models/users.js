const DataTypes = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DataTypes.fn('CONCAT', DataTypes.col('firstName'), ' ', DataTypes.col('lastName'))
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'https://i.postimg.cc/MHrVKYGM/default-profil-pict.jpg'
    },
    hide: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
},{
    freezeTableName : true,
});

module.exports = User;