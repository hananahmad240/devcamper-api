// create custom error middlewear

const ErrorResponse = require('../utils/errorResponse');

const errorHnadler = (err, req, res, next) => {
    let error = {
        ...err
    };
    // console.log(err.stack.red);
    // console.log(err.value);  gives us the id of a user
    console.log(err.name);
    // console.log(error);


    error.message = err.message; // if id is little bit change it give us err.name = Error

    // mongo bad object id error
    if (err.name == "CastError") {


        const message = `Bootcamp not found with id of ${err.value}`; // err.value give us id
        // console.log(message);
        error = new ErrorResponse(message, 404);

        // res.status(err.statusCode || 500).json({
        //     success: false,
        //     error: message || 'server error'
        // });

    }

    // dublicate key error code of dublicate key is 11000
    if (err.code === 11000) {
        const message = `Dublicate Field or value enter`
        error = new ErrorResponse(message, 400);
    }

    // validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        // console.log(message); gives us array of messages
        error = new ErrorResponse(message, 400);

    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'server error'
    });

}

module.exports = errorHnadler;