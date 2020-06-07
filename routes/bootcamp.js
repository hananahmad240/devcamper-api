const express = require('express');
const router = express.Router();


// get all bootcamp
router.get('/bootcamps', (req, res) => {
    res.status(200).json({
        success: true,
        msg: "All bootcamps"
    })
});


// get single bootcamp
router.get('/bootcamps/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `single botcamps with id ${req.params.id}`
    })
});


// add new bootcamp bootcamp
router.post('/bootcamps', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `add new bootcamp`
    })
});


// update single bootcampbootcamp
router.put('/bootcamps/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: `update botcamps with id ${req.params.id}`
    })
});

// delete single bootcamp
router.delete('/bootcamps/:id', (req, res) => {
    res.status(200).json({
        success: true,
        msg: ` delete single botcamps with id ${req.params.id}`
    })
});


// export
module.exports = router;