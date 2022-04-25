export interface IBook {
	title: string,
	description: string,
	authors: string,
	fileCover: string | null,
	fileName: string,
	fileBook: string,
	favorites: string
}

export const TYPES = {
	BookModel: Symbol.for("BookModel"),
	BookRepository: Symbol.for('BookRepository')
};
