const config = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const booksRouter = require('./routes/booksRouter')
const booksApiRouter = require('./routes/booksApiRouter')

const usersRouter = require('./routes/usersRouter')

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/books', booksRouter);
app.use('/api/books', booksApiRouter);
app.use('/api/users', usersRouter);

app.listen(config.port);

