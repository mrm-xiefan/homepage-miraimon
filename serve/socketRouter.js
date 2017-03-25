var http = require('http');
var dataService = require('../services/dataService.js').dataService;
var roomService = require('../services/roomService.js').roomService;
var userService = require('../services/userService.js').userService;

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end('server connected');
});
var io = require('socket.io').listen(server);
server.listen(8000);

io.sockets.on('connection', function(socket) {
    console.log("connected:" + socket.id);
    var room = null;
    var user = userService.getUserInfo();
    var callback = function(result) {
        result.data.initData.currentBoard = room.toJSON();
        result.data.initData.boards = roomService.getRoomList();
        result.data.initData.user = JSON.stringify(user);
        dataService.getCart(user, function(info) {
            if (!info.err) {
                result.data.initData.carting = info.data.userCart;
                io.to(socket.id).emit('boardInfoToClient', JSON.stringify(result));
            }
        });
    };
    userService.readCommand(user, function(result) {
        if (!result.err) {
            var command = result.data;
            if (command.type == "newroom") {
                var boardWidth = command.key;
                roomService.addRoom(socket.id, user.id, boardWidth, function(result) {
                    room = result;
                    socket.join(room.id);
                    socket.broadcast.emit('refreshBoardList', JSON.stringify(roomService.getRoomList()));
                    roomService.detail();
                    dataService.getBoardInitData(callback);
                });
            } else if (command.type == "joinroom") {
                var roomid = command.key;
                roomService.getRoom(roomid, function(result) {
                    room = result;
                    if (room) {
                        socket.join(room.id);
                        room.join(socket.id);
                        roomService.detail();
                        dataService.getBoardInitData(callback);
                    }
                });
            } else if (command.type == "none") {
                roomService.detail();
            }
        }
    });

    socket.on('disconnect', function() {
        console.log("disconnect:" + socket.id);
        roomService.leave(socket.id, function() {
            roomService.detail();
            socket.broadcast.emit('refreshBoardList', JSON.stringify(roomService.getRoomList()));
        });
    });

    socket.on('saveBoard', function(msg) {
        console.log("saveBoard:" + socket.id);
        io.to(room.id).emit('saveBoardDone', 'okok');
    });

    socket.on('addPicture', function(msg) {
        var data = JSON.parse(msg);
        data.specifyID = room.indexID();
        room.addImage(data, function() {
            io.to(room.id).emit('addPictureDone', JSON.stringify(data));
        });
    });

    socket.on('removePicture', function(msg) {
        var data = JSON.parse(msg);
        var specifyID = "";
        if (data.id.substr(0, 4) == "line") {
            var lineID = data.id;
            specifyID = lineID.substr(4, lineID.length - 4);
        } else if (data.id.substr(0, 7) == "picture") {
            var boxID = data.id;
            var picID = boxID.substr(0, boxID.length - 4);
            specifyID = picID.substr(7, picID.length - 7);
        }
        room.removeImageOrLine(specifyID, function() {
            io.to(room.id).emit('removePictureDone', msg);
        });
    });

    socket.on('clickPicture', function(msg) {
        var data = JSON.parse(msg);
        var boxID = data.id;
        var picID = boxID.substr(0, boxID.length - 4);
        var specifyID = picID.substr(7, picID.length - 7);
        room.resetzIndex(specifyID, function() {
            io.to(room.id).emit('clickPictureDone', msg);
        });
    });

    socket.on('dragPicture', function(msg) {
        socket.broadcast.to(room.id).emit('dragPictureDone', msg);
    });

    socket.on('draggedPicture', function(msg) {
        var data = JSON.parse(msg);
        room.moveImage(data, function() {
            socket.broadcast.to(room.id).emit('dragPictureDone', msg);
        });
    });

    socket.on('resizePicture', function(msg) {
        socket.broadcast.to(room.id).emit('resizePictureDone', msg);
    });

    socket.on('resizedPicture', function(msg) {
        var data = JSON.parse(msg);
        room.resizeImage(data, function() {
            socket.broadcast.to(room.id).emit('resizePictureDone', msg);
        });
    });

    socket.on('addHorizontalLine', function(msg) {
        var data = JSON.parse(msg);
        data.specifyID = room.indexID();
        room.addHorizontalLine(data, function() {
            io.to(room.id).emit('addHorizontalLineDone', JSON.stringify(data));
        });
    });

    socket.on('addVerticalLine', function(msg) {
        var data = JSON.parse(msg);
        data.specifyID = room.indexID();
        room.addVerticalLine(data, function() {
            io.to(room.id).emit('addVerticalLineDone', JSON.stringify(data));
        });
    });

    socket.on('dragLine', function(msg) {
        socket.broadcast.to(room.id).emit('dragLineDone', msg);
    });

    socket.on('draggedLine', function(msg) {
        var data = JSON.parse(msg);
        room.moveLine(data, function() {
            socket.broadcast.to(room.id).emit('dragLineDone', msg);
        });
    });
});


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
