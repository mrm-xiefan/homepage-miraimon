var roomService = require('./roomService.js').roomService;
var userService = require('./userService.js').userService;

roomService.init();
userService.init();

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
            console.log("#########################################################");
            console.log("connected:" + socket.id);
            roomService.queue(socket);
            roomService.detail();
            userService.detail();
            socket.emit('connectDone', JSON.stringify({users: userService.getUserList(), rooms: roomService.getRoomList()}));

            var user = null;
            var room = null;

            socket.on('login', function(msg) {
                console.log("#########################################################");
                console.log("login:" + msg);
                var data = JSON.parse(msg);
                user = userService.login(data.name, socket);
                socket.emit('refreshUser', JSON.stringify({user: user.toJSON()}));
                self.io.emit('refreshUsers', JSON.stringify({users: userService.getUserList()}));
                if (user.room) {
                    console.log("auto join:" + user.room.name);
                    room = user.room;
                    socket.join(room.name);
                    socket.emit('refreshRoom', JSON.stringify({room: room.toJSON()}));
                    self.io.emit('refreshRooms', JSON.stringify({rooms: roomService.getRoomList()}));
                }
                roomService.detail();
                userService.detail();
            });

            socket.on('join', function(msg) {
                console.log("#########################################################");
                console.log("join:" + msg + " | user:" + user.name);
                var data = JSON.parse(msg);
                room = roomService.joinRoom(user, data.name);
                socket.join(room.name);
                self.io.emit('refreshUsers', JSON.stringify({users: userService.getUserList()}));
                socket.emit('refreshRoom', JSON.stringify({room: room.toJSON()}));
                self.io.emit('refreshRooms', JSON.stringify({rooms: roomService.getRoomList()}));
                roomService.detail();
                userService.detail();
            });

            socket.on('draw', function(msg) {
                console.log("#########################################################");
                if (room) {
                    console.log("draw -- room:" + room.name + " | status:" + room.status);
                    var before = room.status;
                    room.draw();
                    self.io.in(room.name).emit('drawAnimation', room.drewPool[room.drewPool.length - 1]);
                    setTimeout(function() {
                        self.io.in(room.name).emit('refreshRoom', JSON.stringify({room: room.toJSON()}));
                        if (room.status != before) {
                            self.io.emit('refreshRooms', JSON.stringify({rooms: roomService.getRoomList()}));
                        }
                        if (room.status == '3') {
                            console.log("game end!!!");
                        }
                    }, 3000);
                }
            });

            socket.on('kick', function(msg) {
                var data = JSON.parse(msg);
                console.log("#########################################################");
                console.log("from:" + room.name + " | kick:" + data.name);
                var kicked = room.kick(data.name);
                kicked.leaveRoom();
                if (!kicked.isBingo() && !kicked.isOnline()) {
                    userService.destoryUser(kicked);
                }
                self.io.emit('kicked', JSON.stringify({kicked: kicked.name, rooms: roomService.getRoomList(), users: userService.getUserList()}));
                roomService.detail();
                userService.detail();
            });

            socket.on('disconnect', function() {
                console.log("#########################################################");
                console.log("disconnect:" + socket.id);
                roomService.dequeue(socket);
                var isRefreshUsers = false;
                var isRefreshRooms = false;
                if (user) {
                    isRefreshUsers = true;
                    if (user.isBingo()) {
                        isRefreshRooms = true;
                    }
                    user.logout();
                    if (!user.isBingo() && !user.isOnline()) {
                        userService.destoryUser(user);
                    }
                }
                if (room && room.needDestory()) {
                    isRefreshUsers = true;
                    isRefreshRooms = true;
                    roomService.destoryRoom(room);
                }
                if (isRefreshUsers == true) {
                    self.io.emit('refreshUsers', JSON.stringify({users: userService.getUserList()}));
                }
                if (isRefreshRooms == true) {
                    self.io.emit('refreshRooms', JSON.stringify({rooms: roomService.getRoomList()}));
                }
                roomService.detail();
                userService.detail();
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
