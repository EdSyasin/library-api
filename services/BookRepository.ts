import BookModel from '../models/Book'
import { IBook } from "../types";
import { Types } from "mongoose";

class BookRepository {
	static async createBook (book: IBook) {
		const newBook = new BookModel(book);
		await newBook.save();
		return newBook._id;
	}

	static async getBook(id: Types.ObjectId) {
		const book = await BookModel.findOne(id);
		return book;
	}

	static async getBooks() {
		const books = await BookModel.find();
		return books;
	}

	static async deleteBook(id: Types.ObjectId) {
		const successDelete = await BookModel.deleteOne(id);
		return successDelete.deletedCount > 0;
	}

	static async updateBook(id: Types.ObjectId, book: IBook) {
		return BookModel.findOneAndUpdate(id, book);
	}

}

export default BookRepository;
