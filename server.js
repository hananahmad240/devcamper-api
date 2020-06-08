// all module
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors');
dotenv.config();

// crete app
const app = express();
app.use(express.json());

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

// express all routes
app.use('/api/v1', require('./routes/bootcamp'));
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
