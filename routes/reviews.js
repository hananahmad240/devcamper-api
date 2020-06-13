const express = require('express');
const {
    getReviews,
    getSingleReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews');
const Reviews = require('../models/Reviews');
const {
    protect,
    authorize
} = require('../middleware/auth');
const router = express.Router({
    mergeParams: true
});



// router.use(protect);
// router.use(authorize('admin'));


router.route('/').get(getReviews).post(protect, authorize('user', 'admin'), addReview);
router.route('/:id').get(getSingleReview);
router.route('/:id').put(protect, authorize('user', 'admin'), updateReview);
router.route('/:id').delete(protect, authorize('user', 'admin'), deleteReview);
module.exports = router;