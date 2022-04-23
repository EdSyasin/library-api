import config from './config';
import express from 'express';
import http from 'http';
import bodyParser from "body-parser";
import booksRouter from './routes/booksRouter'

const app = express();
const server = http.createServer(app);

// const booksRouter = require();
const booksApiRouter = require('./routes/booksApiRouter');

const userRoutes = require('./routes/userRoutes');

const mongoose = require('mongoose');
const passport = require('./services/passport');
const io = (require('./services/socket'))(server);


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session())

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

        server.listen(config.port);
    } catch (error) {
        console.log('error connect', error);
    }
})()

