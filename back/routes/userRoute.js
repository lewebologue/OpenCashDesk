const express = require('express');
const router = express.Router();
const limiter = require('../middleware/expressLimiter');
const auth = require('../middleware/auth');
const userController = require('../controllers/user');
const multer = require('../middleware/multer-config');

router.post ('/signup', userController.signup);
router.post ('/login', userController.login, limiter.max);
router.get('/allusers',auth, userController.getAllUsers);
router.get('/user/:id', auth, userController.getOneUser);
router.put('/update/:id',auth, multer, userController.modifyUser);
router.put('/update/:id/image',auth, multer, userController.deleteUserImage);
router.put('/update/:id',auth, userController.hideUser);
//router.delete('/delete/:id',auth, multer, userController.deleteUser);

module.exports = router;