const ErroeResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');


// @desc get all users
// private
// @route /api/v1/auth/users
exports.getUsers = asyncHandler(async function (req, res, next) {
    const users = await User.find();
    return res.status(200).json({
        success: true,
        data: users
    });
    return next(error);
});

// @Desc get single user
// private
// api/v1/auth/user
exports.getUser = asyncHandler(async function (req, res, next) {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`user does not exits of this id ${req.params.id}`, 400));
    } else {
        return res.status(200).json({
            success: true,
            data: user
        });
    }
    return next(error);
});





// @Desc create single user
// private
// api/v1/auth/
exports.createUser = asyncHandler(async function (req, res, next) {
    const user = await User.create(req.body);

    return res.status(200).json({
        success: true,
        data: user
    });

    return next(error);
});


// @Desc update single user
// private
// api/v1/auth/
exports.updateUser = asyncHandler(async function (req, res, next) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new ErrorResponse(`user does not exits of this id ${req.params.id}`, 400));

    } else {
        return res.status(200).json({
            success: true,
            data: user
        });
    }

    return next(error);
});



// @Desc update single user
// private
// api/v1/auth/
exports.deleteUser = asyncHandler(async function (req, res, next) {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`user does not exits of this id ${req.params.id}`, 400));

    } else {
        return res.status(200).json({
            success: true,
            data: {}
        });
    }

    return next(error);
});