const router = require('express').Router()
const Book = require("../models/Book");
const fileMiddleware = require("../middleware/FileMiddleware");

router.get('/:id', (request, response) => {
    const {id} = request.params;
    const result = Book.find(id);
    if (result) {
        response.json(result);
    } else {
        response.status(404).json({'error': 'Книга не найдены'});
    }
})

router.get('/', (request, response) => {
    const result = Book.getList();
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

        const newBook = new Book(bookTitle, description || null, authors || null, favorite || null, fileCover, filename, fileBook);
        newBook.save();

        response.json(newBook);
    } else {
        response.status(400).json({error: 'Нехватает данных'})
    }
})

router.put('/:id', fileMiddleware.single('cover'), (request, response) => {
    const book = Book.find(request.params.id);
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
        book.save();
        response.json(book);
    }
})

router.get('/:id/download', (request, response) => {
    const book = Book.find(request.params.id)
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

router.delete('/:id', (request, response) => {
    const {id} = request.params;
    const result = Book.find(id);
    if (result) {
        result.delete()
        response.json('ok');
    } else {
        response.status(404).json({error: 'Книга не найдены'});
    }
})

module.exports = router;
