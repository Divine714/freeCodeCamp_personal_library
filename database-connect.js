const mongoose = require("mongoose");
const database = process.env.DB;
const connectDB = mongoose.connect(database);

module.exports = connectDB;