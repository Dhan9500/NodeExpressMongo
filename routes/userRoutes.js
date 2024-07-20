const express = require('express');
const userControllers = require('../controllers/userControllers');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);
router.route('/updatepassword').patch(authController.protect, authController.updatePassword);
router.route('/updateme').patch(authController.protect, userControllers.updateMe);
router.route('/deleteme').delete(authController.protect, userControllers.deleteMe);
router.route('/').get(userControllers.getAllUsers);

module.exports = router;
