const config = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const booksRouter = require('./routes/booksRouter')


app.use(bodyParser.json());

app.use('/api/books', booksRouter);

app.listen(config.port);

