import 'reflect-metadata';
import { injectable, inject } from "inversify";
import { IBook, TYPES } from "../types";
import { Types, Model } from "mongoose";

@injectable()
class BookRepository {
	constructor(@inject(TYPES.BookModel) private model: Model<IBook>) {}

	async createBook (book: IBook) {
		const newBook = new this.model(book);
		console.log(newBook)
		await newBook.save();
		return newBook._id;
	}

	async getBook(id: Types.ObjectId) {
		const book = await this.model.findOne(id);
		return book;
	}

	async getBooks() {
		const books = await this.model.find();
		return books;
	}

	async deleteBook(id: Types.ObjectId) {
		const successDelete = await this.model.deleteOne(id);
		return successDelete.deletedCount > 0;
	}

	async updateBook(id: Types.ObjectId, book: IBook) {
		return this.model.findOneAndUpdate(id, book);
	}

}

export default BookRepository;
