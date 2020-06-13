const mongoosse = require('mongoose');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');

const Bootschema = new mongoosse.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name'],
		unique: true,
		trim: true, // remove sapace from start
		maxlength: [50, 'Name can not be more than 50 characters'],
	},
	slug: String,
	description: {
		type: String,
		required: [true, 'Please add aDescription'],
		maxlength: [500, 'Description can not more than 500 characters'],
	},
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'Please ues a valid URL with HTTP or HTTPS',
		],
	},
	phone: {
		type: String,
		maxlength: [20, 'Phone number can not be longer than 20 characters'],
	},
	email: {
		type: String,
		match: [
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please add a valid email',
		],
	},
	address: {
		type: String,
		required: [true, 'Please add a address'],
	},

	// mongoose geoJSON
	location: {
		type: {
			type: String, // Don't do `{ location: { type: String } }`
			enum: ['Point'], // 'location.type' must be 'Point'
		},
		coordinates: {
			// we add lat and lng
			type: [Number],

			index: '2dsphere',
		},
		formattedAddress: String,
		street: String,
		city: String,
		state: String,
		zipcode: String,
		country: String,
	},
	careers: {
		// Array of String
		type: [String], // this is not a single string is array of string
		required: true,
		enum: [
			'Web Development',
			'Mobile Development',
			'UI/UX',
			'Data Science',
			'Business',
			'Others',
		],
	},
	averageRating: {
		type: Number,
		min: [1, 'Rating must be at leat 1'],
		max: [10, 'Rating must can not be more than 10'],
	},
	averageCost: {
		type: Number,
	},
	photo: {
		type: String,
		default: 'no-photo.jpg', // if client can not upload photo than we add default photo
	},
	housing: {
		type: Boolean,
		default: false,
	},
	jobAssistance: {
		type: Boolean,
		default: false,
	},
	jobGuarantee: {
		type: Boolean,
		default: false,
	},
	acceptGi: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	// admin or publisher wo add bootcamp
	user: {
		type: mongoosse.Schema.ObjectId,
		ref: 'User',
		required: true

	}
}, {
	// this if for foreign key
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
});

// mongoose pre middlewear
Bootschema.pre('save', function (next) {
	// console.log('prev middlewear', this.name);
	// slug remove space and replace it - and convert into lower case
	this.slug = slugify(this.name, {
		lower: true,
	});
	next();
});

// get location for node geo coder and mapquest
Bootschema.pre('save', async function (next) {
	// const loc = geoCoder.geocode(this.address).then((res) => {
	//         console.log(res);

	//     })
	//     .catch((err) => {
	//         console.log(err);

	//     })
	try {
		const loc = await geoCoder.geocode(this.address);
		// console.log(loc); it gives us array

		// [
		//     {
		//       latitude: 48.8698679,
		//       longitude: 2.3072976,
		//       country: 'France',
		//       countryCode: 'FR',
		//       city: 'Paris',
		//       zipcode: '75008',
		//       streetName: 'Champs-Élysées',
		//       streetNumber: '29',
		//       administrativeLevels: {
		//         level1long: 'Île-de-France',
		//         level1short: 'IDF',
		//         level2long: 'Paris',
		//         level2short: '75'
		//       },
		//       provider: 'google'
		//     }
		//   ];
		this.location = {
			type: 'Point',
			coordinates: [loc[0].latitude, loc[0].longitude],
			formattedAddress: loc[0].formattedAddress,
			street: loc[0].streetName,
			city: loc[0].city,
			state: loc[0].stateCode,
			zipcode: loc[0].zipcode,
			country: loc[0].countryCode,
		};
	} catch (err) {
		console.log(err);
	}

	// we not save address
	this.address = undefined;
	next();
});

// cascade delete courses when   a bootcamp deleted

Bootschema.pre('remove', async function (next) {
	console.log(this._id);
	await this.model('Courses').deleteMany({
		bootcamp: this._id,
	});
	return next();
});

// add foreign key
//                name of field you want to enter
Bootschema.virtual('courses', {
	ref: 'Courses',
	localField: '_id',
	foreignField: 'bootcamp', //this is firld we ref befor
	justOne: false,
});

const Bootcampmodel = mongoosse.model('Bootcamp', Bootschema, 'Bootcamp');
module.exports = Bootcampmodel;