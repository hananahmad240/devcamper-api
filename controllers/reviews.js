const asyncHandler = require('../middleware/async');
const Reviews = require('../models/Reviews');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcampmodel');



// get reviews
// GET /api/v1/reviews

exports.getReviews = asyncHandler(async function (req, res, next) {
    if (req.params.bootcampId) {
        const review = await Reviews.find({
            bootcamp: req.params.bootcampId
        });
        if (!review) {
            return next(new ErrorResponse(`No review for this id ${req.params.id}`, 400));

        } else {
            return res.status(200).json({
                success: true,
                data: review
            });
        }
    } else {
        const reviews = await Reviews.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });

        return res.status(200).json({
            success: true,
            data: reviews
        });

    }

    return next(error);
})

// get single eview
exports.getSingleReview = asyncHandler(async function (req, res, next) {
    const review = await Reviews.findById(
        req.params.id
    ).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!review) {
        return next(new ErrorResponse(`No review for this id ${req.params.id}`, 400));

    } else {
        return res.status(200).json({
            success: true,
            data: review
        });
    }
    return next(error);
});

// add review
// /api/v1/bootcamps/:bootcampId/reviews
// private post
exports.addReview = asyncHandler(async function (req, res, next) {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404));
    } else {
        const review = await Reviews.create(req.body);
        return res.status(201).json({
            success: true,
            data: review
        });
    }
    return next(error);
});

// update review
// /api/v1/reviews/:id
// private put
exports.updateReview = asyncHandler(async function (req, res, next) {
    let review = await Reviews.findById(req.params.id);
    if (!review) {
        return res.send('no')
    } else {
        review = await Reviews.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            data: review
        });
    }
    return next(error);
});


exports.deleteReview = asyncHandler(async function (req, res, next) {
    let review = await Reviews.findById(req.params.id);
    if (!review) {
        return res.send('no')
    } else {
        await Reviews.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            data: {}
        });
    }
    return next(error);
});