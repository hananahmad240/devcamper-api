const Bootcamp = require('../models/Bootcampmodel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const NodegeoCoder = require('../utils/geocoder');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// @desc       get all bootcamps
// @route      GET /api/v1/bootcamps
// @access     public

// exports.getAllBootcamps = async (req, res, next) => {

//     // Bootcamp.find({}).then((res) => console.log(res)).catch((err) => console.log(err));

//     try {
//         const bootcamps = await Bootcamp.find({});
//         res.status(200).json({
//             success: true,
//             count: bootcamps.length,
//             data: bootcamps
//         });
//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         next(error);
//     }

// }

exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    console.log(req.query);

    // copy of query
    const reqQuery = {
        ...req.query,
    };

    // remove fileds
    const removeFields = ['select', 'sort', 'limit', 'page'];

    // we remove select from req.query
    removeFields.forEach((params) => delete reqQuery[params]);

    console.log(reqQuery);

    // create query string
    let queryStr = JSON.stringify(reqQuery);

    // add $ sign of lte lt gt etc
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    // select fields like name description

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        // console.log(fields);

        // if we wany to find more than two fileds we put space betwwen them
        // like name description housing
        // not name,description wrong way
        query = query.select(fields);
    }

    // sorting for acss 1 and -1 for desc
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        // console.log(sortBy);
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createAt');
    }

    // for limitiing
    //                                  base 10 default page is 1
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();
    // console.log(endIndex, total);

    query.skip(skip).limit(limit);

    const bootcamps = await query;

    // pagination

    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit: limit,
        };
    }
    if (skip > 0) {
        pagination.prev = {
            page: page - 1,
            limit: limit,
        };
    }

    return res.status(200).json({
        success: true,
        pagination,
        count: bootcamps.length,
        data: bootcamps,
    });

    return next(error);
});

// @desc       get single bootcamps
// @route      GET /api/v1/bootcamps/:id
// @access     public

// exports.getSingBootcamps = async (req, res, next) => {

//     try {
//         const singleBootcamp = await Bootcamp.findById(req.params.id);
//         // if data is not come
//         if (!singleBootcamp) {
//             // return res.status(400).json({
//             //     success: false
//             // })

//             return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
//         } else {
//             res.status(200).json({
//                 success: true,
//                 data: singleBootcamp
//             });
//         }

//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         next(error);
//         // next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
//     }
//     // res.status(200).json({
//     //     success: true,
//     //     msg: `single botcamps with id ${req.params.id}`
//     // })
// }

exports.getSingBootcamps = asyncHandler(async (req, res, next) => {
    const singleBootcamp = await Bootcamp.findById(req.params.id);
    // if data is not come
    if (!singleBootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    } else {
        return res.status(200).json({
            success: true,
            data: singleBootcamp

        });
    }
    return next(error); //whole error
});

// @desc       add new bootcamps
// @route      POST /api/v1/bootcamps
// @access     public

// exports.addBootcamps = async (req, res, next) => {

//     // const newBoot = new Bootcamp(req.body);
//     // newBoot.save().then(() => console.log('added'))
//     //     .catch((err) => console.log(err));

//     try {
//         const bootcamp = await Bootcamp.create(req.body);

//         res.status(201).json({
//             success: true,
//             msg: bootcamp
//         });
//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         next(error);
//     }
// }

exports.addBootcamps = asyncHandler(async (req, res, next) => {

    // add user to req.body
    req.body.user = req.user.id;
    // check the published bootcamp because the publisher add only one bootcamp and admin add many bootcamp
    const publishedBootcamp = await Bootcamp.findOne({
        user: req.user.id
    });

    // check if the user is not admin
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with id ${req.user.id} has already published bootcamp`, 400));
    }


    const bootcamp = await Bootcamp.create(req.body);
    return res.status(201).json({
        success: true,
        msg: bootcamp,
        name: req.user.name
    });
    return next(error);
});

// @desc       update single bootcamps
// @route      PUT /api/v1/bootcamps/:id
// @access     public

// exports.updateBootcamps = async (req, res, next) => {

//     try {
//         const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         });

//         if (!bootcamp) {
//             // simple rrro
//             // return res.status(400).json({
//             //     success: false
//             // })
//             return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

//         } else {
//             res.status(200).json({
//                 success: true,
//                 data: bootcamp
//             });
//         }

//     } catch (error) {
//         // cast error
//         // res.status(400).json({
//         //     success: false,
//         //     message: error.message
//         // })
//         next(error);
//     }
// }

exports.updateBootcamps = asyncHandler(async (req, res, next) => {

    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        // simple rrro
        // return res.status(400).json({
        //     success: false
        // })
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    } else {

        // Make sure  user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`you aree unauthorized to update this bootcamp`, 401));
        } else {
            bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,

            });

            return res.status(200).json({
                success: true,
                data: bootcamp,
            });
        }

    }

    return next(error);
});

// @desc       delete single bootcamps
// @route      DELETE /api/v1/bootcamps/:id
// @access     private

// exports.deleteBootcamps = async (req, res, next) => {
//     try {
//         const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

//         if (!bootcamp) {
//             // return res.status(400).json({
//             //     success: false
//             // })

//             return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

//         } else {
//             res.status(200).json({
//                 success: true,
//                 data: {}
//             });
//         }

//     } catch (error) {
//         // res.status(400).json({
//         //     success: false
//         // })
//         next(error);
//     }
// }

exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
    // const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    } else {



        // Make sure  user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`you aree unauthorized to delete this bootcamp`, 401));
        } else {
            bootcamp.remove();
            return res.status(200).json({
                success: true,
                data: {},
            });
        }



    }

    return next(error);
});

// @desc  get bootcamp with in radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {
        zipcode,
        distance,
        unit
    } = req.params;

    // get lattitude and longituide

    const loc = await NodegeoCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // cal radius using radians
    // divide distance by radius of earth
    // earth radius is 3963mi    or  6378km
    if (unit === 'km') {
        const radius = distance / 6378;
        const bootcamps = await Bootcamp.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [lat, lng], radius
                    ],
                },
            },
        });
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
        });
    } else if (unit === 'mi') {
        const radius = distance / 3963;
        const bootcamps = await Bootcamp.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [lat, lng], radius
                    ],
                },
            },
        });

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
        });
    } else {
        const radius = distance / 3963;
        const bootcamps = await Bootcamp.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [lat, lng], radius
                    ],
                },
            },
        });

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps,
        });
    }
});

// @desc upload photp
// @route  PUT /api/v1/bootcamps/:id/photo
// @access private

exports.bootcampPhoyoUpload = asyncHandler(async function (req, res, next) {
    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    } else {

        // make sure bootcamo owner
        // Make sure  user is bootcamp owner
        if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`you aree unauthorized to update this bootcamp`, 401));
        } else {
            if (!req.files) {
                return next(new ErrorResponse(`Please a upload photo`, 404));
            } else {
                console.log(req.files);
                const file = req.files.file;
                // check the file is image
                // it give us  mimetype: 'video/mp4', mimetype: 'image/jpeg',
                if (!file.mimetype.startsWith('image')) {
                    // if not starts with image
                    return next(new ErrorResponse(`File must be a photo`, 404));
                } else {
                    // check image size
                    if (file.size > process.env.MAX_FILE_SIZE) {
                        return next(new ErrorResponse(`Photo size must be less than ${process.env.MAX_FILE_SIZE}`, 404));

                    }
                    // create custom file name
                    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
                    console.log(file.name);

                    // upload photo store to our project
                    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
                        if (err) {
                            console.log(err);
                            return next(new ErrorResponse(`Problem with file uploads`, 500));
                        } else {
                            // store in Bootcamp



                            await Bootcamp.findByIdAndUpdate(bootcamp._id, {
                                photo: file.name
                            });

                            return res.status(200).json({
                                success: true,
                                name: file.name
                            });
                        }
                    })


                }
            }
        }




    }
    // return next(error);
});


// req.file proprty
// file: {
//     name: 'photo-1584034256047-741246c713e8.jpg',
//     data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff e2 02 1c 49 43 43 5f 50 52 4f 46 49 4c 45 00 01 01 00 00 02 0c 6c 63 6d 73 02 10 00 00 ... 434685 more bytes>,
//     size: 434735,
//     encoding: '7bit',
//     tempFilePath: '',
//     truncated: false,
//     mimetype: 'image/jpeg',
//     md5: '5aab5828af2dcfc71c2403d8111208b5',
//     mv: [Function: mv]
//   }