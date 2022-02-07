const config = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const booksRouter = require('./routes/booksRouter')
const usersRouter = require('./routes/usersRouter')

app.use(bodyParser.json());

app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);

app.listen(config.port);

