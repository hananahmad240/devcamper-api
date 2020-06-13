const express = require('express');
const {
    userRegister,
    userLogin,
    getMe,
    getAllUser,
    forgotPassword,
    updateDetials,
    logout,
    updatePassword
} = require('../controllers/auth');
const {
    protect
} = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(userRegister);
router.route('/login').post(userLogin);
router.route('/me').get(protect, getMe);
router.route('/alluser').get(getAllUser);
router.route('/forgotpassword').post(forgotPassword);
router.route('/updateme').put(protect, updateDetials);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/logout').get(logout);

module.exports = router;