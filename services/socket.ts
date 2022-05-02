import { Server } from 'socket.io';
import Comment from "../models/Comment";
import http from 'http'

export default (server: http.Server) => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log('a user connected');

        const { roomName } = socket.handshake.query;
        if (roomName) {
            socket.join(roomName)
        }

        socket.on('comment', async (payload) => {
            console.log(payload)
            const newComment = new Comment({
                book: payload.bookId,
                text: payload.comment
            });
            await newComment.save()
            if (roomName) {
                io.to(roomName).emit('comment', payload.comment)
            }
        })
    });
    return io

}

