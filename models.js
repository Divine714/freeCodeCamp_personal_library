const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: { type: String, required: true },
    comments: [String],
});

const bookModel = mongoose.model("Book", bookSchema);

exports.bookModel = bookModel;