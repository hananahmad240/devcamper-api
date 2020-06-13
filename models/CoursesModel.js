const mongoose = require('mongoose');
const Bootcamp = require('./Bootcampmodel');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add course title'],
	},
	description: {
		type: String,
		required: [true, 'Please add  a description'],
	},
	weeks: {
		type: String,
		required: [true, 'Please add number of weeks'],
	},
	tuition: {
		type: Number,
		required: [true, 'Please add a tution cost'],
	},
	minimumSkill: {
		type: String,
		required: [true, 'Please add a minimum skills'],
		enum: ['beginner', 'intermediate', 'advanced'],
	},
	scholarhipsAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	// reference from Bootcamp
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp', // data base name we want to populate it
		required: true,
	},
	// reference from User
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User', // data base name we want to populate it
		required: true,
	},
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
	console.log('calculating');

	const obj = await this.aggregate([{
			$match: {
				bootcamp: bootcampId
			},
		},
		{
			$group: {
				_id: '$bootcamp', // for uniqueness
				averageCost: {
					$avg: '$tuition'
				},
			},
		},
	]);

	console.log(obj);
	// [ { _id: 5d725a037b292f5f8ceff787, averageCost: 14250 } ]
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (error) {
		console.log(error);
	}
};

// call getAverageCose after save
CourseSchema.post('save', function () {
	this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCose before remove
CourseSchema.pre('save', function () {
	this.constructor.getAverageCost(this.bootcamp);
});

const Courses = mongoose.model('Courses', CourseSchema, 'Courses');
module.exports = Courses;