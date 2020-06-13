const ErroeResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const endEmail = require('../utils/sendEmail');
const sendEmail = require('../utils/sendEmail');
const { text } = require('body-parser');

// @desc Register User
// @route POST /api/v1/auth/register
// @access public

exports.userRegister = asyncHandler(async function (req, res, next) {
	const { name, email, role, password } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	// methods will call var  and statics methods will call userscehma
	// create token
	const token = user.getSignedJWTToken();
	const options = {
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};
	// check the development mode
	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}
	return res.status(200).cookie('token', token, options).json({
		success: true,

		token: token,
		data: user,
	});

	return next(error);
});

// @desc  User Login
// @route POST /api/v1/auth/login
// @access public

exports.userLogin = asyncHandler(async function (req, res, next) {
	const { email, password } = req.body;
	const userEmail = await User.findOne({
		email,
	}).select('password');
	if (!userEmail) {
		return next(new ErroeResponse(`Email is not register ${email}`, 404));
	} else {
		// check password
		const isMatch = await userEmail.matchPassword(password);
		if (!isMatch) {
			return next(new ErroeResponse(`invalid password ${password}`, 404));
		} else {
			const token = userEmail.getSignedJWTToken();
			const options = {
				expires: new Date(
					Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
				),
				httpOnly: true,
			};
			if (process.env.NODE_ENV === 'production') {
				options.secure = true;
			}
			return res.status(200).cookie('token', token, options).json({
				success: true,
				data: userEmail,
				token: token,
			});
		}
	}

	return next(error);
});

// @desc get current logged user
// @route  POST /api/v1/auth/me
// @access private

exports.getMe = asyncHandler(async function (req, res, next) {
	const user = await User.findById(req.user.id);
	return res.status(200).json({
		success: true,
		data: user,
	});
});

exports.getAllUser = asyncHandler(async function (req, res, next) {
	const allUser = await User.find();
	res.status(200).json({
		success: true,
		data: allUser,
	});
});

// @desc forgot password
// @route  POST /api/v1/auth/forgotpassword
// @access public

exports.forgotPassword = asyncHandler(async function (req, res, next) {
	// check email
	let user = await User.findOne({
		email: req.body.email,
	});
	if (!user) {
		return next(
			new ErrorResponse(
				`there is no user with this email ${req.body.email}`,
				404
			)
		);
	} else {
		const resetToken = user.getResetToken();
		console.log(resetToken);
		await user.save({
			validateBeforeSave: false,
		});

		// create reset URL
		const resetURL = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/resetpassword/${resetToken}`;
		// message you receive
		const message = `
        You are receiving this email because you has requested the reset password please make a PUT request to:\n\n
        ${resetURL}
        `;

		try {
			await sendEmail({
				email: user.email,
				subject: 'password rest route',
				message: message,
			});
			return res.status(200).json({
				success: true,
				data: 'email sent',
			});
		} catch (error) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			await user.save({
				validateBeforeSave: false,
			});
			return next(new ErroeResponse('Email is not sent'));
		}

		return res.status(200).json({
			success: true,
			data: user,
		});
	}
	return next(error);
});

exports.updateDetials = asyncHandler(async function (req, res, next) {
	const filedToupdate = {
		name: req.body.name,
		email: req.body.email,
	};
	const user = await User.findByIdAndUpdate(req.user.id, filedToupdate, {
		new: true,
		runValidators: true,
	});

	return res.status(200).json({
		success: true,
		data: user,
	});
	return next(error);
});

exports.updatePassword = asyncHandler(async function (req, res, next) {
	const user = await User.findById(req.user.id).select('+password');

	if (!user) {
		return next(new ErrorResponse(`id is not correct}`, 404));
	} else {
		const match = await user.matchPassword(req.body.currentPassword);
		if (!match) {
			return next(new ErrorResponse(`password is in orrect}`, 404));
		} else {
			user.password = req.body.newPassword;
			await user.save();
			return res.status(200).json({
				success: true,
				data: user,
			});
		}
	}

	return next(error);
});

// @Desc logout
// private
// api/v1/auth/logout
exports.logout = asyncHandler(async function (req, res, next) {
	res.cookie('token', 'none', {
		expire: new Date(Date.now() + 10 * 1000),
		httpOnly: true, //expire in 10 second
	});

	return res.status(200).json({
		success: true,
		data: 'logout',
	});
});
