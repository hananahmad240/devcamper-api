const monggose = require('mongoose');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const jsonwebToken = require('jsonwebtoken');
const dotenv = require('dotenv');
const cryptojs = require('crypto-js');
dotenv.config();

const UserSchema = new monggose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'please add a email'],
        unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email',
        ],
    },
    role: {
        type: String,
        enum: ['user', 'publisher', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please a Password'],
        minlength: [6, 'password is not less then 6 digit'],
        select: false, // we do not show password if we get all data
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// encrypt password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    // this ionly run wehen password is modified
    const slat = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, slat);
    next();
});

// sign JWT and return

UserSchema.methods.getSignedJWTToken = function () {
    return jsonwebToken.sign({
            id: this._id,
        },
        process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};

// macth password
UserSchema.methods.matchPassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};


// reset password token methods
UserSchema.methods.getResetToken = function () {
    // generate resetToekn
    const resetToekn = crypto.randomBytes(20).toString('hex');

    // hash token and set it resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToekn).digest('hex');

    //  set expire in 10 minute
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToekn;



};
const User = monggose.model('User', UserSchema, 'User');
module.exports = User;