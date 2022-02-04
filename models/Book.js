const uuid = require('uuid');

let booksDatabase = [
    {
        id: "1",
        title: "Книга 1",
        description: "Описание книги 1",
        authors: "Автор книги 1",
        favorite: "favorite",
        fileCover: "imgs/1.jpg",
        fileName: "files/1.epub"
    },
    {
        id: "2",
        title: "Книга 2",
        description: "Описание книги 2",
        authors: "Автор книги 2",
        favorite: "favorite",
        fileCover: "imgs/2.jpg",
        fileName: "files/2.epub"
    },

]

module.exports = class Book {
    constructor(title, description, authors, favorite, fileCover, fileName){
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    }

    static find(id){
        const bookData = booksDatabase.find(bookData => bookData.id === id);
        if(bookData){
            const book = new Book(bookData.title, bookData.description, bookData.authors, bookData.favorite, bookData.fileCover, bookData.fileName);
            book.id = bookData.id;
            return book;
        } else {
            return null;
        }
    }

    static getList() {
        return booksDatabase.map(bookData => {
           const book = new Book(bookData.title, bookData.description, bookData.authors, bookData.favorite, bookData.fileCover, bookData.fileName);
           book.id = bookData.id;
           return book;
        })
    }

    save(){
        /**
         * Проверка на ID лужит для уточнения, сохранена ли книга в "базе"
         */
        if(!this.id){
            this.id = uuid.v1();
            booksDatabase.push({
                id: this.id,
                title: this.title,
                description: this.description,
                authors: this.authors,
                favorite: this.favorite,
                fileCover: this.fileCover,
                fileName: this.fileName
            })
        } else {
            const book = booksDatabase.find(bookData => bookData.id === this.id);
            book.title = this.title,
            book.description = this.description
            book.authors = this.authors
            book.favorite = this.favorite
            book.fileCover = this.fileCover
            book.fileName = this.fileName
        }
    }

    delete(){
        if (!this.id){
            return false;
        } else {
            booksDatabase = booksDatabase.filter(book => book.id !== this.id);
            return true;
        }
    }
}
