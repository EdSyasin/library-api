import { Schema, model } from 'mongoose';

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

export default model('Comment', CommentSchema);
