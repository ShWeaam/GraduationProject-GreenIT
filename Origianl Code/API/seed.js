require('dotenv').config();
const mongoose = require('mongoose');
const userManager = require('./managers/user');
const crypto = require('./utils/crypto');

// create an array of all the supervisors you want to add in the system
const supervisors = [
    {
        name: "",
        username: "",
        email: "",
        password: "",
        type: 1,
        active: true
    }
];

// connecting with database
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    poolSize: 5,
    useUnifiedTopology: true
})
    .then(db => console.log('Connected with MongoDB for Seeding.'))
    .catch(err => console.log(`Unable to connect with MongoDB: ${err.message}`));

// function that would insert our supervisors array into database
const saveSupervisors = () => new Promise(async (resolve, reject) => {
    // deleting all first, just cleaning up the database
    await userManager.deleteAll();
    // loop through all the supservisors
    for(let i=0; i < supervisors.length; i++) {
        let t = supervisors[i];
        // use manager method to save it in the database
        await userManager.create({
            name: t.name,
            username: t.username,
            email: t.email,
            type: t.type,
            password: await crypto.hash(t.password) // encrypt password before saving
        });
    }
    resolve();
});

// calling above method in a function
(async () => {
    await saveSupervisors();
    console.log('Seeding completed.\nDisconnecting Seeder.');
    mongoose.disconnect(); // disconnect DB connection at the end
})();