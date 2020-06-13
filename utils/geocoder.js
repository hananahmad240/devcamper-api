const NodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCEODER_PROVIDER,
    apiKey: process.env.GEOCEODER_API_KEY,
    formatter: null

}

const geoCoder = NodeGeocoder(options);
module.exports = geoCoder;




// const options = {
//     provider: 'google',

//     // Optional depending on the providers
//     fetch: customFetchImplementation,
//     apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
//     formatter: null // 'gpx', 'string', ...
//   };