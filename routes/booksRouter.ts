import {Request, Response} from "express";

const router = require('express').Router()
const Book = require("../models/Book");
const Comment = require("../models/Comment");
const fileMiddleware = require("../middleware/FileMiddleware");
const prepareRenderData = require('../utilities/prepareRenderData');
const requester = require("../utilities/request");
const config = require("../config");

router.get('/new', (request: Request, response: Response) => {
    response.render('books/create', prepareRenderData({}))
})

router.get('/:id', async (request: Request, response: Response) => {
    const {id} = request.params;
    const result = await Book.findById(id);
    const comments = await Comment.find({book: id})
    if (result) {
        response.render('books/view', prepareRenderData({book: result, comments}))
    } else {
        response.render('errors/404', {error: 'книга не найдена'})
    }
})

router.get('/:id/edit', async (request: Request, response: Response) => {
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

router.get('/', async (request: Request, response: Response) => {
    const result = await Book.find();
    response.render('books/index', {books: result})
})

router.post('/', fileMiddleware.fields([{name: 'book', maxCount: 1}, {name: 'cover', maxCount: 1}]), async (request: Request, response: Response) => {
    const files = request.files
    const book = files && !Array.isArray(files) ? files.book : undefined
    const cover = files && !Array.isArray(files) ? files.cover : undefined
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
            fileName: filename,
            fileBook: fileBook
        });

        await newBook.save();

        response.redirect(`/books`)
    } else {
        response.render('books/create', prepareRenderData({}, {}, {book: 'Добавьте фаил книги'}))
    }
})

router.post('/:id', fileMiddleware.single('cover'), async (request: Request, response: Response) => {
    const book = await Book.findById(request.params.id);
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

router.get('/:id/delete', async (request: Request, response: Response) => {
    const {id} = request.params;
    const result = await Book.findById(id);
    console.log(result)
    if (result) {
        result.delete();
        response.redirect('/books');
    } else {
        response.render('errors/404', {error: 'книга не найдена'})
    }
})

export default router;
