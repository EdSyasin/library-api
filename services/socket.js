const { Server } = require('socket.io');
const Comment = require('../models/Comment')

module.exports = server => {
    const io = new Server(server);
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
    return io

}

