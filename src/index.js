const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New connection');

    socket.emit('message', 'Welcome');
    socket.broadcast.emit('message', 'New user has joined');

    socket.on('message', (message, callback) => {
        io.emit('message', message);
        callback('Delivered');
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        callback('Location shared');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected');
        io.emit('message', 'A user has leaved');
    });
});

server.listen(port, () => {
    console.log(`${Date()}
Server is up on port ${port}`)
});