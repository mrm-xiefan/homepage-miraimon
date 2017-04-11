var roomService = require('./roomService.js').roomService;

function User() {
    this.name = null;
    this.socket = null;
    this.room = null;
};
User.prototype = {
    init: function(name) {
        this.name = name;
        this.socket = null;
        this.room = null;
    },
    login: function(socket) {
        this.socket = null;
        this.socket = socket;
    },
    logout: function() {
        this.socket = null;
    },
    joinRoom: function(room) {
        this.room = null;
        this.room = room;
    },
    equal: function(user) {
        return this.name === user.name;
    },
    isBingo: function() {
        return this.room != null;
    },
    isOnline: function() {
        return this.socket != null;
    },
    toJSON: function() {
        return {
            name: this.name,
            socketid: (this.socket ? this.socket.id : ""),
            roomname: (this.room ? this.room.name : "")
        };
    },
    spy: function() {
        console.log("name:" + this.name + " | socket:" + (this.socket ? this.socket.id : "Offline") + " | room:" + (this.room ? this.room.name : "Lobby"));
    }
};

function UserService() {
    this.users = null;
};
UserService.prototype = {
    init: function() {
        this.users = [];
    },
    detail: function() {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        console.log("users:" + this.users.length);
        for (var idx = 0; idx < this.users.length; idx ++) {
            this.users[idx].spy();
        }
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    },
    getUserList: function() {
        var list = [];
        for (var i = 0; i < this.users.length; i ++) {
            list.push(this.users[i].toJSON());
        }
        return list;
    },
    login: function(name, socket) {
        for (var idx = 0; idx < this.users.length; idx ++) {
            if (this.users[idx].name == name) {
                if (this.users[idx].isOnline()) {
                    return null;
                }
                this.users[idx].login(socket);
                return this.users[idx];
            }
        }

        var user = new User();
        user.init(name);
        user.login(socket);
        this.users.push(user);
        return user;
    },
    destoryUser: function(user) {
        for (var idx = 0; idx < this.users.length; idx ++) {
            if (this.users[idx].equal(user)) {
                this.users[idx] = null;
                this.users.splice(idx, 1);
                return;
            }
        }
    }
};
exports.userService = new UserService();