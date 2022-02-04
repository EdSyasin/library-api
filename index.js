const config = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Book = require('./models/Book');

app.use(bodyParser.json());
app.listen(config.port);

app.get('/api/books/:id', (request, response) => {
    const {id} = request.params;
    const result = Book.find(id);
    if (result) {
        response.json(result);
    } else {
        response.status(404).send('Книга не найдены');
    }
})

app.get('/api/books', (request, response) => {
    const result = Book.getList();
    if (result.length > 0) {
        response.json(result);
    } else {
        response.status(404).send('Книги не найдены');
    }
})

app.post('/api/books', (request, response) => {
    const {title, description, authors, favorite, fileCover, filename} = request.body;
    const book = new Book(title, description, authors, favorite, fileCover, filename);
    book.save();
    response.json(book);
})

app.put('/api/books/:id', (request, response) => {
    const book = Book.find(request.params.id);
    if (!book) {
        response.status(404).send('Книга не найдена');
    } else {
        Object.keys(request.body)
            .forEach(key => {
                book[key] = request.body[key];
            })
        book.save();
        response.json(book);
    }
})

app.delete('/api/books/:id', (request, response) => {
    const {id} = request.params;
    const result = Book.find(id);
    if (result) {
        result.delete()
        response.json('ok');
    } else {
        response.status(404).send('Книга не найдены');
    }
})


