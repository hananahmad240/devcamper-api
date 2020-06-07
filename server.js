// all module
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// crete app
const app = express();
app.use(express.json());

// express all routes
app.use('/api/v1', require('./routes/bootcamp'));
// create port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`app is running on localhost:${PORT}`));