const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    text: {
        type: String
    }
});

module.exports = model('Comment', CommentSchema);
