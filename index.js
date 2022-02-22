const config = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const booksRouter = require('./routes/booksRouter')
const booksApiRouter = require('./routes/booksApiRouter')

const usersRouter = require('./routes/usersRouter');

const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/books', booksRouter);
app.use('/api/books', booksApiRouter);
app.use('/api/users', usersRouter);

(async () => {
    try {
        await mongoose.connect('mongodb://libuser:xb46yt@localhost:27017/library');
        app.listen(config.port);
    } catch (error) {
        console.log('error connect', error);
    }
})()

