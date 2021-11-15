import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';

const app = express();

const server = createServer(app);

mongoose.connect('mongodb://localhost/chatsocket');

app.use(express.static(path.join(__dirname, '..', 'public')));

const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Socket id: ', socket.id);
})

app.get('/', (req, res, next) => {
    return res.json({
        message: 'Hello',
    });
});

export { server, io }
