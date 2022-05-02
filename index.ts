import config from './config';
import express from 'express';
import http from 'http';
import bodyParser from "body-parser";
import booksRouter from './routes/booksRouter';
import booksApiRouter from './routes/booksApiRouter';
import socketService from './services/socket';
import passport from './services/passport';
import userRoutes from './routes/userRoutes';
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);

const io = socketService(server);


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

try {
    mongoose.connect(`mongodb://${config.mongoHost}:${config.mongoPort}`, {
        user: config.mongoUser,
        pass: config.mongoPassword,
        dbName: config.mongoDb,
    });

    server.listen(config.port);
} catch (error) {
    console.log('error connect', error);
}

