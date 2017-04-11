// var utils = require('../services/utils.js').utils;
// var conf = require('config');
// var dataService = require('../services/dataService.js').dataService;
// var roomService = require('../services/roomService.js').roomService;
// var userService = require('../services/userService.js').userService;

function SocketRouter() {
    this.io = null;
};
SocketRouter.prototype = {
    init: function(server) {
        var self = this;

        self.io = require('socket.io')(server, {path: "/bingo/socket.io"});

        self.io.use(function(socket, next) {
            next();
        });

        self.io.sockets.on('connection', function(socket) {
            console.log("connected:" + socket.id);

            socket.on('disconnect', function() {
                console.log("disconnect:" + socket.id);
            });
        });
    }
}
exports.socketRouter = new SocketRouter();


// // sending to sender-client only
// socket.emit('message', "this is a test");

// // sending to all clients, include sender
// io.emit('message', "this is a test");

// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');
