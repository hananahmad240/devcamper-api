// all module
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
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

// express all routes
app.use('/api/v1', require('./routes/bootcamp'));
// create port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`app is running on localhost:${PORT}`));
