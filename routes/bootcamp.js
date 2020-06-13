const express = require('express');
const {
    getAllBootcamps,
    getSingBootcamps,
    updateBootcamps,
    deleteBootcamps,
    addBootcamps,
    getBootcampsInRadius,
    bootcampPhoyoUpload
} = require('../controllers/bootcamps');
const courseRouter = require('./courses');
const reviewsRouter = require('./reviews');


const Bootcamp = require('../models/Bootcampmodel');
const {
    protect,
    authorize
} = require('../middleware/auth');

// creat route
const router = express.Router();

// use other routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewsRouter);


router.route('/').get(getAllBootcamps); //get all
router.route('/:id').get(getSingBootcamps); // get single
router.route('/:id').put(protect, authorize('admin', 'publisher'), updateBootcamps); // update single
router.route('/:id').delete(protect, authorize('admin', 'publisher'), deleteBootcamps); // delete single
router.route('/').post(protect, authorize('admin', 'publisher'), addBootcamps); // add new
router.route('/radius/:zipcode/:distance/:unit?').get(getBootcampsInRadius); // unit is km or mi

// photo upload
router.route('/:id/photo').put(protect, authorize('admin', 'publisher'), bootcampPhoyoUpload);


// // get all bootcamp
// router.get('/bootcamps', (req, res) => {
//     res.status(200).json({
//         success: true,
//         msg: "All bootcamps"
//     })
// });


// // get single bootcamp
// router.get('/bootcamps/:id', (req, res) => {
//     res.status(200).json({
//         success: true,
//         msg: `single botcamps with id ${req.params.id}`
//     })
// });


// // add new bootcamp bootcamp
// router.post('/bootcamps', (req, res) => {
//     res.status(200).json({
//         success: true,
//         msg: `add new bootcamp`
//     })
// });


// // update single bootcampbootcamp
// router.put('/bootcamps/:id', (req, res) => {
//     res.status(200).json({
//         success: true,
//         msg: `update botcamps with id ${req.params.id}`
//     })
// });

// // delete single bootcamp
// router.delete('/bootcamps/:id', (req, res) => {
//     res.status(200).json({
//         success: true,
//         msg: ` delete single botcamps with id ${req.params.id}`
//     })
// });


// export
module.exports = router;