//Configuration JWT

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        req.token = jwt.decode(token, process.env.TOKEN);
        next()
    } catch (error) { 
        res.status(401).json({ message : error.message });
    }
};