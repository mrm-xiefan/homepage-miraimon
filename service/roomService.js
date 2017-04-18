var utils = require('./utils').utils;
var userService = require('./userService.js').userService;

function Room() {
    this.name = null;
    this.owner = null;
    this.status = null;
    this.members = null;
    this.drawPool = null;
    this.drewPool = null;
    this.bingoList = null;
    this.bingoRank = null;
};
Room.prototype = {
    init: function(name, user) {
        this.name = name;
        this.owner = user;
        this.status = '1';
        this.members = [];
        this.drawPool = utils.createArray(75);
        this.drewPool = [];
        this.bingoList = [];
        this.bingoRank = 0;
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
            this.compute();
        }
    },
    kick: function(username) {
        if (username == this.owner.name) {
            return;
        }
        if (this.bingoList.length > 0) {
            return;
        }
        for (var idx = 0; idx < this.members.length; idx ++) {
            if (this.members[idx].name == username) {
                var user = this.members[idx];
                this.members.splice(idx, 1);
                return user;
            }
        }
    },
    draw: function() {
        this.status = '2';
        this.drewPool.push(this.drawPool.pop());
        this.compute();
        var isEnd = true;
        for (var idx = 0; idx < this.members.length; idx ++) {
            var member = this.members[idx];
            if (!member.bingo) {
                isEnd = false;
                break;
            }
        }
        if (isEnd) {
            this.status = '3';
        }
    },
    compute: function() {
        var rank = this.bingoRank + 1;
        for (var idx = 0; idx < this.members.length; idx ++) {
            var member = this.members[idx];
            if (!member.bingo) {
                member.reach = 0;
                var map = this.getMap(member);
                for (key in map) {
                    if (map[key] == 5) {
                        this.bingoRank ++;
                        member.reach = 0;
                        member.rank = rank;
                        member.bingo = true;
                        this.bingoList.push({user: member, rank: rank});
                        break;
                    }
                    if (map[key] == 4) {
                        member.reach ++;
                    }
                }
            }
        }
    },
    getMap: function(member) {
        var row1 = 0;
        var row2 = 0;
        var row3 = 1;
        var row4 = 0;
        var row5 = 0;
        var column1 = 0;
        var column2 = 0;
        var column3 = 1;
        var column4 = 0;
        var column5 = 0;
        var left = 1;
        var right = 1;

        if (this.isHit(member.card[0])) {
            row1 ++;
            column1 ++;
            left ++;
        }
        if (this.isHit(member.card[1])) {
            row1 ++;
            column2 ++;
        }
        if (this.isHit(member.card[2])) {
            row1 ++;
            column3 ++;
        }
        if (this.isHit(member.card[3])) {
            row1 ++;
            column4 ++;
        }
        if (this.isHit(member.card[4])) {
            row1 ++;
            column5 ++;
            right ++;
        }
        if (this.isHit(member.card[5])) {
            row2 ++;
            column1 ++;
        }
        if (this.isHit(member.card[6])) {
            row2 ++;
            column2 ++;
            left ++;
        }
        if (this.isHit(member.card[7])) {
            row2 ++;
            column3 ++;
        }
        if (this.isHit(member.card[8])) {
            row2 ++;
            column4 ++;
            right ++;
        }
        if (this.isHit(member.card[9])) {
            row2 ++;
            column5 ++;
        }
        if (this.isHit(member.card[10])) {
            row3 ++;
            column1 ++;
        }
        if (this.isHit(member.card[11])) {
            row3 ++;
            column2 ++;
        }
        if (this.isHit(member.card[13])) {
            row3 ++;
            column4 ++;
        }
        if (this.isHit(member.card[14])) {
            row3 ++;
            column5 ++;
        }
        if (this.isHit(member.card[15])) {
            row4 ++;
            column1 ++;
        }
        if (this.isHit(member.card[16])) {
            row4 ++;
            column2 ++;
            right ++;
        }
        if (this.isHit(member.card[17])) {
            row4 ++;
            column3 ++;
        }
        if (this.isHit(member.card[18])) {
            row4 ++;
            column4 ++;
            left ++;
        }
        if (this.isHit(member.card[19])) {
            row4 ++;
            column5 ++;
        }
        if (this.isHit(member.card[20])) {
            row5 ++;
            column1 ++;
            right ++;
        }
        if (this.isHit(member.card[21])) {
            row5 ++;
            column2 ++;
        }
        if (this.isHit(member.card[22])) {
            row5 ++;
            column3 ++;
        }
        if (this.isHit(member.card[23])) {
            row5 ++;
            column4 ++;
        }
        if (this.isHit(member.card[24])) {
            row5 ++;
            column5 ++;
            left ++;
        }

        return {
            row1: row1,
            row2: row2,
            row3: row3,
            row4: row4,
            row5: row5,
            column1: column1,
            column2: column2,
            column3: column3,
            column4: column4,
            column5: column5,
            left: left,
            right: right
        };
    },
    isHit: function(number) {
        if (number == 99) {
            return true;
        }
        for (var idx = 0; idx < this.drewPool.length; idx ++) {
            if (this.drewPool[idx] == number) {
                return true;
            }
        }
        return false;
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
        result.reach = this.reach;
        result.bingo = this.bingo;
        result.rank = this.rank;
        result.bingoList = [];
        for (var idx = 0; idx < this.bingoList.length; idx ++) {
            result.bingoList.push({username: this.bingoList[idx].user.name, rank: this.bingoList[idx].rank});
        }
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
