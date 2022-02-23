const { Schema, model } = require('mongoose');

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    authors: {
        type: String
    },
    favorites: {
        type: String
    },
    fileCover: {
        type: String
    },
    fileName: {
        type: String
    },
    fileBook: {
        type: String,
        required: true
    }

});

module.exports = model('Book', BookSchema);
