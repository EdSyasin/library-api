const router = require('express').Router()
const Book = require("../models/Book");
const fileMiddleware = require("../middleware/FileMiddleware");
const prepareRenderData = require('../utilities/prepareRenderData');
const requester = require("../utilities/request");
const config = require("../config");

router.get('/new', (request, response) => {
    response.render('books/create', prepareRenderData({}))
})

router.get('/:id', async (request, response) => {
    const {id} = request.params;
    const result = await Book.findById(id);
    if (result) {
        try {
            result.showCount = await requester.post(config.counterHost, `/counter/${result.id}/incr`);
        } catch (err) {
            console.log('count err', err);
        }
        response.render('books/edit', prepareRenderData({book: result}))
    } else {
        response.render('errors/404', {error: 'книга не найдена'})
    }
})

router.get('/', async (request, response) => {
    const result = await Book.find();
    response.render('books/index', {books: result})
})

router.post('/', fileMiddleware.fields([{name: 'book', maxCount: 1}, {name: 'cover', maxCount: 1}]), (request, response) => {
    const { book, cover } = request.files;
    if(book){
        const {title, description, authors, favorite} = request.body;
        const bookTitle = title || book[0].originalname
        const filename = book[0].originalname;
        const fileBook = book[0].path;
        const fileCover = cover ? cover[0].path : null

        // const newBook = new Book(bookTitle, description || null, authors || null, favorite || null, fileCover, filename, fileBook);
        const newBook = new Book({
            title: bookTitle,
            description: description,
            authors: authors,
            favorite: favorite,
            fileCover: fileCover,
            fileBook: fileBook
        });

        newBook.save();

        response.redirect(`/books`)
    } else {
        response.render('books/create', prepareRenderData({}, {}, {book: 'Добавьте фаил книги'}))
    }
})

router.post('/:id', fileMiddleware.single('cover'), (request, response) => {
    const book = Book.find(request.params.id);
    if (!book) {
        response.render('errors/404', {error: 'книга не найдена'})
    } else {
        Object.keys(request.body)
            .filter(key => ['title', 'description', 'authors', 'favorite'].includes(key))
            .forEach(key => {
                book[key] = request.body[key];
            })
        if (request.file) {
            book.fileCover = request.file.path;
        }
        book.save();
        response.render('books/edit',  prepareRenderData({book: book }, {bookAdded: 'Книга сохранена'}))
    }
})

router.get('/:id/delete', (request, response) => {
    const {id} = request.params;
    const result = Book.find(id);
    if (result) {
        result.delete();
        response.redirect('/books');
    } else {
        response.render('errors/404', {error: 'книга не найдена'})
    }
})

module.exports = router;
