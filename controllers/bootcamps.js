// @desc       get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     public

exports.getAllBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: "All bootcamps",
        name: req.name
    })
}



// @desc       get single bootcamps
// @route      GET /api/v1/bootcamps/:id
// @access     public

exports.getSingBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `single botcamps with id ${req.params.id}`
    })
}



// @desc       add new bootcamps
// @route      POST /api/v1/bootcamps
// @access     public

exports.addBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `add new bootcamp`
    });
}


// @desc       update single bootcamps
// @route      PUT /api/v1/bootcamps/:id
// @access     public

exports.updateBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `update botcamps with id ${req.params.id}`
    })
}


// @desc       delete single bootcamps
// @route      DELETE /api/v1/bootcamps/:id
// @access     public

exports.deleteBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: ` delete single botcamps with id ${req.params.id}`
    })
}