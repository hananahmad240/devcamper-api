const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'please add a title for reviews'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'please add a text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 to 10']
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

// prevent user frim submitting more than one review
reviewsSchema.index({
    bootcamp: 1,
    user: 1
}, {
    unique: true
});

// calculating average rating
reviewsSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([{
            $match: {
                bootcamp: bootcampId
            }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: {
                    $avg: '$rating'
                }
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        });
    } catch (err) {
        console.log(err);
    }
};

reviewsSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp);
})

reviewsSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp);
})
const Reviews = mongoose.model('Review', reviewsSchema, 'Review');
module.exports = Reviews;