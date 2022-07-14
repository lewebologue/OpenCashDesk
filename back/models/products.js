const DataTypes = require('sequelize');
const db = require('../config/db');

const Products = db.define('Products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    vat: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
},{
    freezeTableName : true,
});

module.exports = Products;