const config = require('./config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const booksRouter = require('./routes/booksRouter');
const booksApiRouter = require('./routes/booksApiRouter');

const userRoutes = require('./routes/userRoutes');

const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/user', userRoutes);
app.use('/books', booksRouter);
app.use('/api/books', booksApiRouter);

(async () => {
    try {
        //await mongoose.connect(`mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPort}/${config.mongoDb}`);
        await mongoose.connect(`mongodb://${config.mongoHost}:${config.mongoPort}`, {
            user: config.mongoUser,
            pass: config.mongoPassword,
            dbName: config.mongoDb,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(config.port);
    } catch (error) {
        console.log('error connect', error);
    }
})()

