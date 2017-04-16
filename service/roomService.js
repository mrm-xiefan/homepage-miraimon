var utils = require('./utils').utils;
var userService = require('./userService.js').userService;

function Room() {
    this.name = null;
    this.owner = null;
    this.status = null;
    this.members = null;
    this.drawPool = null;
    this.drewPool = null;
};
Room.prototype = {
    init: function(name, user) {
        this.name = name;
        this.owner = user;
        this.status = '1';
        this.members = [];
        this.join(user);
        this.drawPool = utils.createArray(75);
        this.drewPool = [];
    },
    equal: function(room) {
        return this.name === room.name;
    },
    spy: function() {
        console.log("  =======================================================");
        console.log("  room name:" + this.name);
        console.log("  members:" + this.members.length);
        for (var idx = 0; idx < this.members.length; idx ++) {
            this.members[idx].spy();
        }
        console.log("  =======================================================");
    },
    join: function(user) {
        user.joinRoom(this);
        var isReJoin = false;
        for (var idx = this.members.length - 1; idx >= 0; idx --) {
            if (this.members[idx].equal(user)) {
                isReJoin = true;
                break;
            }
        }
        if (!isReJoin) {
            this.members.push(user);
        }
    },
    draw: function() {
        this.drewPool.push(this.drawPool.pop());
    },
    needDestory: function() {
        var destory = true;
        for (var idx = this.members.length - 1; idx >= 0; idx --) {
            if (this.members[idx].isOnline()) {
                destory = false;
                break;
            }
        }
        return destory;
    },
    toJSON: function() {
        var result = {};
        result.name = this.name;
        result.ownername = this.owner.name;
        result.status = this.status;
        result.drewPool = this.drewPool;
        result.members = [];
        for (var idx = 0; idx < this.members.length; idx ++) {
            result.members.push(this.members[idx].toJSON());
        }

        return result;
    }
};

function RoomService() {
    this.rooms = null;
    this.lobby = null;
};
RoomService.prototype = {
    init: function() {
        this.rooms = [];
        this.lobby = [];
    },
    detail: function() {
        console.log("rooms:" + this.rooms.length);
        for (var idx = 0; idx < this.rooms.length; idx ++) {
            this.rooms[idx].spy();
        }
        console.log("lobby:" + this.lobby.length);
        if (this.lobby.length > 0) {
            console.log("  ///////////////////////////////////////////////////////");
            for (var idx = 0; idx < this.lobby.length; idx ++) {
                console.log("    socketid:" + this.lobby[idx].id);
            }
            console.log("  ///////////////////////////////////////////////////////");
        }
    },
    queue: function(socket) {
        this.lobby.push(socket);
    },
    dequeue: function(socket) {
        for (var idx = this.lobby.length - 1; idx >= 0; idx --) {
            if (this.lobby[idx].id == socket.id) {
                this.lobby.splice(idx, 1);
                return;
            }
        }
    },
    createRoom: function(user, name) {
        var room = new Room();
        room.init(name, user);
        this.rooms.push(room);
        return room;
    },
    joinRoom: function(user, name) {
        this.dequeue(user.socket);

        for (var i = 0; i < this.rooms.length; i ++) {
            var room = this.rooms[i];
            if (name == room.name) {
                room.join(user);
                return room;
            }
        }
        return this.createRoom(user, name);
    },
    getRoomList: function() {
        var list = [];
        for (var i = 0; i < this.rooms.length; i ++) {
            list.push(this.rooms[i].toJSON());
        }
        return list;
    },
    destoryRoom: function(room) {
        for (var idx = 0; idx < room.members.length; idx ++) {
            userService.destoryUser(room.members[idx]);
        }
        for (var idx = 0; idx < this.rooms.length; idx ++) {
            if (this.rooms[idx].equal(room)) {
                this.rooms[idx] = null;
                this.rooms.splice(idx, 1);
                return;
            }
        }
    }
};
exports.roomService = new RoomService();
