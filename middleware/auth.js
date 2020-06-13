const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// protect route
exports.protect = asyncHandler(async function (req, res, next) {
    let token;
    // check tokn=en form header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // check token form cookies
    else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse('Not authorize to access this route', 401));
    } else {
        try {
            // verify token
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(decode);
            req.user = await User.findById(decode.id);
            next();

        } catch (err) {
            return next(new ErrorResponse('Not authorize to access this route', 401));

        }
    }

})

// check the role of user
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if ((!roles.includes(req.user.role))) {
            return next(new ErrorResponse(`Useer role is ${req.user.role} unauthorized`, 401));
        }
        next();
    }
}