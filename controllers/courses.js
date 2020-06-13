const Course = require('../models/CoursesModel');
const Bootcamp = require('../models/Bootcampmodel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc get course
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampsId/courses
// @access public

exports.getCourse = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        console.log(req.params.bootcampId);

        query = Course.find({
            bootcamp: req.params.bootcampId
        });
    } else {
        query = Course.find({}).populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const Allcourses = await query;
    return res.status(200).json({
        success: true,
        count: Allcourses.length,
        data: Allcourses
    });

    return next(error);

});


// @desc get single  course
// @route GET /api/v1//:id
// @access public

exports.getSingleCourse = asyncHandler(async (req, res, next) => {



    const singleCourse = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: "name description"
    });
    if (!singleCourse) {
        return next(new ErrorResponse(`Course can not found with id of ${req.params.id}`, 404));
    } else {
        return res.status(200).json({
            success: true,
            data: singleCourse
        });
    }


    return next(error);

});


// @desc add cource
// @route POST /api/v1/bootcamps/:bootcampsId/courses
// @access private

exports.addCourse = asyncHandler(async (req, res, next) => {

    // if we add a bootcamp we know this is foreign key so we set the id of boot camp we added in new and put the id in here
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    let bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        // if we want to add a cource with bootcamp id is not in real bootcamp
        return next(new ErrorResponse(`No Bootcamp with id of ${req.params.bootcampId}`, 404))
    } else {
        // check the owner of course
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`you aree unauthorized to update add a  course`, 401));

        }

        const course = await Course.create(req.body);
        return res.status(200).json({
            success: true,
            data: course
        })
    }
    return next(error);

});



// @desc update cource
// @route PUT /api/v1/courses/:id
// @access private

exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);
    if (!course) {
        // if not course is 
        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404));
    } else {
        course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            data: course
        });
    }

    return next(error);

});



// @desc delete cource
// @route DELETE /api/v1/courses/:id
// @access private

exports.deleteCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);
    if (!course) {
        // if not course is 
        return next(new ErrorResponse(`No course with id of ${req.params.id}`, 404));
    } else {
        course = await Course.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            data: {}
        });
    }

    return next(error);

});