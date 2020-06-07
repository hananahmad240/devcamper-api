const express = require('express');
const {
    getAllBootcamps,
    getSingBootcamps,
    updateBootcamps,
    deleteBootcamps,
    addBootcamps
} = require('../controllers/bootcamps');


// creat route
const router = express.Router();

router.route('/bootcamps').get(getAllBootcamps); //get all
router.route('/bootcamps/:id').get(getSingBootcamps); // get single
router.route('/bootcamps/:id').put(updateBootcamps); // update single
router.route('/bootcamps/:id').delete(deleteBootcamps); // delete single
router.route('/bootcamps').post(addBootcamps); // add new




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