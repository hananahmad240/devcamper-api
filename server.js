// all module
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// crete app
const app = express();
// create port
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`app is running on localhost:${PORT}`));