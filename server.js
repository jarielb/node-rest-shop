const http = require('http');
const app = require('./app');
const io = require('socket.io')(server);

const port = process.env.PORT || 3001;

const server = http.createServer(app);

io.on('some event name here', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
    });
})

server.listen(port);