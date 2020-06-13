// all module
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize'); // mongodb security for getting data
const helmet = require('helmet'); // http security
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
dotenv.config();

// crete app
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
);
app.use(cookieParser());

// middlewear
// app.use(require('./middleware/logger'));
if (process.env.NODE_ENV === 'development') {
	// morgab is third paty middlewear
	app.use(morgan('dev'));
} else {
	app.use(require('./middleware/logger'));
}

// database
connectDB();

// express file upload
app.use(fileUpload());
// database security
app.use(mongoSanitize());
// helemet for  http security
app.use(helmet());

// publisher boot 2<script>alert(2)</script>", befor
// "name": "publisher boot 2&lt;script>alert(2)&lt;/script>", after
app.use(xssClean());

// rate limiting 100 request in 10 minute
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, //10 minute
	max: 100,
});
app.use(limiter);

// prevent hpp polution
app.use(hpp());

// if more than two domain we use and it accessed 100 request in 10 minute so solve this issue
app.use(cors());

// express all routes
app.use('/api/v1/bootcamps', require('./routes/bootcamp'));
app.use('/api/v1/courses', require('./routes/courses'));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/reviews', require('./routes/reviews'));
// place error handler middlewear
app.use(errorHandler);
// create port
const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
	console.log(`app is running on localhost:${PORT}`.yellow.bold)
);

// if mongodb wrong password error is come

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	server.close(() => {
		process.exit(1);
	});
});

// mongodb+srv://hanan1:developer18nayyab@hanandeveloper-93jhi.mongodb.net/test
