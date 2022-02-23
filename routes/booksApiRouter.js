const router = require('express').Router()
const Book = require("../models/Book");
const fileMiddleware = require("../middleware/FileMiddleware");
const requester = require('../utilities/request');
const config = require('../config');

router.get('/:id', async (request, response) => {
    const {id} = request.params;
    const result = await Book.findById(id);
    if (result) {
        try {
            result.showCount = await requester.post(config.counterHost, `/counter/${result.id}/incr`);
        } catch (err) {
            console.log('count err', err);
        }
        response.json(result);
    } else {
        response.status(404).json({'error': 'Книга не найдены'});
    }
})

router.get('/', async (request, response) => {
    const result = await Book.find();
    if (result.length > 0) {
        response.json(result);
    } else {
        response.status(404).json({error: 'Книги не найдены'});
    }
})

router.post('/', fileMiddleware.fields([{name: 'book', maxCount: 1}, {name: 'cover', maxCount: 1}]), async (request, response) => {
    const { book, cover } = request.files;
    if(book){
        const {title, description, authors, favorite} = request.body;
        const bookTitle = title || book[0].originalname
        const filename = book[0].originalname;
        const fileBook = book[0].path;
        const fileCover = cover ? cover[0].path : null

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

        response.json(newBook);
    } else {
        response.status(400).json({error: 'Нехватает данных'})
    }
})

router.put('/:id', fileMiddleware.single('cover'), async (request, response) => {
    const book = await Book.findById(request.params.id);
    if (!book) {
        response.status(404).json({error: 'Книга не найдена'});
    } else {
        Object.keys(request.body)
            .filter(key => ['title', 'description', 'authors', 'favorite'].includes(key))
            .forEach(key => {
                book[key] = request.body[key];
            })
        if (request.file) {
            book.fileCover = request.file.path;
        }
        await book.save();
        response.json(book);
    }
})

router.get('/:id/download', async (request, response) => {
    const book = await Book.findById(request.params.id)
    if (!book) {
        response.status(404).json({error: 'Книга не найдена'});
    } else {
        response.download(book.fileBook, book.fileName, err=>{
            if (err){
                response.status(404).json({error: 'Проблема с загрузкой файла'});
            }
        });
    }
});

router.delete('/:id', async (request, response) => {
    const {id} = request.params;
    const result = await Book.findById(id);
    if (result) {
        await result.delete()
        response.json('ok');
    } else {
        response.status(404).json({error: 'Книга не найдены'});
    }
})

module.exports = router;
