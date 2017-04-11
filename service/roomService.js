var userService = require('./userService.js').userService;

function Room() {
    this.status = null;
    this.name = null;
    this.members = null;
    this.owner = null;
};
Room.prototype = {
    init: function(name, user) {
        this.status = "準備中";
        this.name = name;
        this.owner = user;
        this.members = [];
        this.join(user);
    },
    equal: function(room) {
        return this.name === room.name;
    },
    spy: function() {
        console.log("  =======================================================");
        console.log("  room name:" + this.name);
        console.log("  members:" + this.members.length);
        for (var idx = 0; idx < this.members.length; idx ++) {
            console.log("      " + this.members[idx].spy());
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
        result.owner = this.owner.name;
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
        console.log("#########################################################");
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
        console.log("#########################################################");
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
    isDuplicate: function(name) {
        for (var idx = 0; idx < this.rooms.length; idx ++) {
            if (name == this.rooms[idx].name) {
                return true;
            }
        }
        return false;
    },
    createRoom: function(user, name) {
        this.dequeue(user.socket);
        if (this.isDuplicate(name)) {
            return null;
        }

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
        return null;
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
