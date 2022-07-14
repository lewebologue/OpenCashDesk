const express = require('express');
const path = require('path');

const app = express();

//Initialisation, synchronisation et connexion à la base de données

const InitDB = require('../back/models/initdb');

//CORS

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

InitDB().then(() => {
    app.use(express.json());

    //app.use('/api/auth', userRoutes);

    //app.use('/api/posts', postRoutes);

    //app.use('/api/comment', commentRoutes);

    //app.use('/images', express.static(path.join(__dirname, 'images')));
    
    })
    .catch((error) => { console.log("error" + error);
});


module.exports = app;