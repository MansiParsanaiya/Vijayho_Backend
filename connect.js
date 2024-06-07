require('dotenv').config();

const mongoose = require('mongoose');

const connection = async () => {
    try {
        // MongoDB Connection URL
        await mongoose.connect(process.env.DB_URL); 
        console.log("Mongo Database Connected!")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connection;
