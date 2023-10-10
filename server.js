const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let votes = {};

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('vote', (data) => {
        votes[socket.id] = { user: data.user, value: data.value };
        io.emit('voteCount', Object.keys(votes).length);
    });

    socket.on('reveal', () => {
        let results = {};
    for (let id in votes) {
        results[votes[id].user] = votes[id].value;
    }
    io.emit('revealVotes', results);
    });

    socket.on('disconnect', () => {
        delete votes[socket.id];
        io.emit('voteCount', Object.keys(votes).length);
    });
});

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
