const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
dotenv.config();
const Bootcamp = require('./models/Bootcampmodel');
const Courses = require('./models/CoursesModel');
const Users = require('./models/User');
const Reviews = require('./models/Reviews');
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

// read JSOn file
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'));


// if we want to import all, data in mongoose

// import data
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        // await Courses.create(courses);  we comment it so we check it one by one average cost
        await Courses.create(courses);
        await Users.create(users);
        await Reviews.create(reviews);
        console.log('data imported'.red);
        process.exit()
    } catch (error) {
        console.log(error);

    }
}

// delete all file
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Courses.deleteMany();
        await Users.deleteMany();
        await Reviews.deleteMany();
        console.log('data deleted'.red);
        process.exit();
    } catch (error) {
        console.log(error);

    }
}
// 0     1      2
// node seeder -i                  import data
// node seeder -d                   delete data

if (process.argv[2] === '_i') {
    importData();
} else if (process.argv[2] === '_d') {
    deleteData();
} else {
    process.exit(1);
}