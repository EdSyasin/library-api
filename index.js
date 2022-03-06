const config = require('./config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const booksRouter = require('./routes/booksRouter');
const booksApiRouter = require('./routes/booksApiRouter');

const userRoutes = require('./routes/userRoutes');

const mongoose = require('mongoose');
const passport = require('./services/passport');

const { Server } = require('socket.io')
const server = require('http').createServer(app)
const io = new Server(server);
const Comment = require('./models/Comment')

io.on('connection', (socket) => {
    console.log('a user connected');

    const { roomName } = socket.handshake.query;
    socket.join(roomName)

    socket.on('comment', async (payload) => {
        console.log(payload)
        const newComment = new Comment({
            book: payload.bookId,
            text: payload.comment
        });
        await newComment.save()
        io.to(roomName).emit('comment', payload.comment)
    })
});

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

