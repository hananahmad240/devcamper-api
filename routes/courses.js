const {
    getCourse,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');
const {
    protect,
    authorize
} = require('../middleware/auth');
const express = require('express');
const router = express.Router({
    mergeParams: true
});


router.route('/').get(getCourse).post(protect, authorize('admin', 'publisher'), addCourse);
router.route('/:id').get(getSingleCourse).put(protect, authorize('admin', 'publisher'), updateCourse).delete(protect, authorize('admin', 'publisher'), deleteCourse);





module.exports = router;