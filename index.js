const config = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const booksRouter = require('./routes/booksRouter')


app.use(bodyParser.json());

app.use('/api', booksRouter);

app.listen(config.port);

