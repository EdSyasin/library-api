import { IBook } from "../types";
import { Schema, model } from 'mongoose';

const BookSchema = new Schema<IBook>({
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

export default model<IBook>('Book', BookSchema);
