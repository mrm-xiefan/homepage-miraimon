var utils = require('./utils').utils;
var roomService = require('./roomService.js').roomService;

function User() {
    this.name = null;
    this.socket = null;
    this.room = null;
    this.card = null;
    this.rank = null;
    this.reach = null;
    this.bingo = null;
    this.drewPool = null;
};
User.prototype = {
    init: function(name) {
        this.name = name;
        this.socket = null;
        this.room = null;
        this.rank = 0;
        this.reach = 0;
        this.bingo = false;
        this.drewPool = [];
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
        this.getCard();
    },
    leaveRoom: function() {
        if (this.socket) {
            this.socket.leave(this.room.name);
        }
        this.room = null;
        this.card = null;
        this.rank = 0;
        this.reach = 0;
        this.bingo = false;
        this.drewPool = [];
    },
    getCard: function() {
        this.card = utils.createArray(75);
        this.card = this.card.splice(0, 25);
        this.card[12] = 99;
    },
    draw: function(number) {
        this.drewPool.push(number);
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
            roomname: (this.room ? this.room.name : ""),
            card: this.card,
            rank: this.rank,
            reach: this.reach,
            bingo: this.bingo,
            drewPool: this.drewPool
        };
    },
    spy: function() {
        if (process.env.NODE_ENV != 'development') {
            return;
        }
        console.log("    name:" + this.name + " | socket:" + (this.socket ? this.socket.id : "Offline") + " | room:" + (this.room ? this.room.name : "Lobby"));
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
        if (process.env.NODE_ENV != 'development') {
            return;
        }
        console.log("users:" + this.users.length);
        if (this.users.length > 0) {
            console.log("  -------------------------------------------------------");
            for (var idx = 0; idx < this.users.length; idx ++) {
                this.users[idx].spy();
            }
            console.log("  -------------------------------------------------------");
        }
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
