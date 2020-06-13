const express = require('express');
const {
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    createUser
} = require('../controllers/users');
const User = require('../models/User');
const {
    protect,
    authorize
} = require('../middleware/auth');
const router = express.Router();



// router.use(protect);
// router.use(authorize('admin'));
router.route('/').get(protect, authorize('admin'), getUsers).post(protect, authorize('admin'), createUser);
router.route('/:id').put(protect, authorize('admin'), updateUser).delete(protect, authorize('admin'), deleteUser).get(protect, authorize('admin'), getUser);

module.exports = router;