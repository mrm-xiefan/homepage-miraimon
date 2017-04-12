var CONST = {
    BINGO: '/bingo/',
    MESSAGE: {
        '0001': '使用中',
        '0002': 'オフライン',
        '0003': '未使用'
    },
    BUTTON_TITLE: {
        '0001': 'ビンゴ',
        '0002': '作成',
        '0003': '参加',
        '0004': '続ける',
        '0005': '結果確認'
    },
    GAME_STATUS: {
        '0001': '',
        '0002': '新しいゲーム',
        '0003': 'ゲーム準備中',
        '0004': 'ゲーム進行中',
        '0005': 'ゲーム終了'
    }
};

var BingoVM = function() {};
BingoVM.prototype = {
    common: null,
    userInfoInput: null,
    init: function(data) {
        // data.users.push({
        //     name: "dd",
        //     socketid: "ttt",
        //     roomname: "sss"
        // });
        // data.users.push({
        //     name: "ddd",
        //     socketid: "",
        //     roomname: "sss"
        // });
        // data.rooms.push({
        //     name: "r1",
        //     status: "1",
        //     members: ["1","2"]
        // });
        // data.rooms.push({
        //     name: "r2",
        //     status: "1",
        //     members: ["1"]
        // });
        // data.rooms.push({
        //     name: "r3",
        //     status: "2",
        //     members: ["1","2","3","4"]
        // });
        var commonData = {
            user: {
                name: "",
                socketid: "",
                roomname: ""
            },
            room: {
                name: "",
                ownername: "",
                status: "",
                members: []
            },
            users: data.users,
            rooms: data.rooms
        };
        this.common = new Vue({
            data: commonData,
            methods: {
                refreshUser: function(data) {
                    this.user.name = data.name;
                    this.user.socketid = data.socketid;
                    this.user.roomname = data.roomname;
                },
                refreshUsers: function(data) {
                    this.users.splice(0, this.users.length);
                    for (var idx = 0; idx < data.length; idx ++) {
                        this.users.push(data[idx]);
                    }
                },
                refreshRoom: function(data) {
                    this.room.name = data.name;
                    this.room.ownername = data.ownername;
                    this.room.status = data.status;
                    this.room.members = data.members;
                    this.room.members.splice(0, this.room.members.length);
                    for (var idx = 0; idx < data.members.length; idx ++) {
                        this.room.members.push(data.members[idx]);
                    }
                },
                refreshRooms: function(data) {
                    this.rooms.splice(0, this.rooms.length);
                    for (var idx = 0; idx < data.length; idx ++) {
                        this.rooms.push(data[idx]);
                    }
                }
            }
        });

        this.userInfoInput = new Vue({
            parent: this.common,
            el: '#user-info-input',
            data: function() {
                return {user: this.$parent.user, inputName: ""};
            },
            computed: {
                inputCheck: function() {
                    if (this.inputName == "") {
                        return "";
                    }
                    for (var idx = 0; idx < bingo.vm.common.users.length; idx ++) {
                        var user = bingo.vm.common.users[idx];
                        if (this.inputName == user.name) {
                            if (user.socketid != "") {
                                return "0001";
                            } else {
                                return "0002"
                            }
                        }
                    }
                    return "0003";
                },
                checkMessage: function() {
                    return CONST.MESSAGE[this.inputCheck];
                },
                hasSelection: function() {
                    var list = this.getSelection();
                    return list.length > 0;
                }
            },
            methods: {
                getSelection: function() {
                    var list = [];
                    for (var idx = 0; idx < bingo.vm.common.users.length; idx ++) {
                        var user = bingo.vm.common.users[idx];
                        if (user.socketid == "") {
                            list.push(user);
                        }
                    }
                    return list;
                },
                select: function(name) {
                    this.inputName = name;
                },
                login: function() {
                    if (!this.inputName) {
                        return;
                    }
                    if (this.inputCheck == '0001') {
                        return;
                    }
                    bingo.socket.emit('login', JSON.stringify({name: this.inputName}));
                }
            }
        });

        this.roomInfoInput = new Vue({
            parent: this.common,
            el: '#room-info-input',
            data: function() {
                return {room: this.$parent.room, inputName: ""};
            },
            computed: {
                isDisplay: function() {
                    if (bingo.vm.common.user.name != "" && this.room.name == "") {
                        return true;
                    }
                    return false;
                },
                inputCheck: function() {
                    if (this.inputName == "") {
                        return "0001";
                    }
                    var room = null;
                    for (var idx = 0; idx < bingo.vm.common.rooms.length; idx ++) {
                        if (bingo.vm.common.rooms[idx].name == this.inputName) {
                            room = bingo.vm.common.rooms[idx];
                            break;
                        }
                    }
                    if (room) {
                        if (room.status == "1") {
                            return "0003";
                        } else if (room.status == "2") {
                            return "0004";
                        } else if (room.status == "3") {
                            return "0005";
                        } else {
                            return "0001";
                        }
                    } else {
                        return "0002";
                    }
                },
                buttonTitle: function() {
                    return CONST.BUTTON_TITLE[this.inputCheck];
                },
                gameStatus: function() {
                    return CONST.GAME_STATUS[this.inputCheck];
                },
                hasSelection: function() {
                    var list = this.getSelection();
                    return list.length > 0;
                }
            },
            methods: {
                getSelection: function() {
                    var list = [];
                    for (var idx = 0; idx < bingo.vm.common.rooms.length; idx ++) {
                        var room = bingo.vm.common.rooms[idx];
                        if (room.status == "1") {
                            list.push(room);
                        }
                    }
                    return list;
                },
                select: function(name) {
                    this.inputName = name;
                },
                join: function() {
                    if (this.inputCheck == "0001") {
                        return;
                    }
                    bingo.socket.emit('join', JSON.stringify({name: this.inputName}));
                }
            }
        });
    }
};

var Bingo = function() {};
Bingo.prototype = {
    socket: null,
    vm: null,
    init: function() {
        var self = this;
        this.socket = io(location.host, {path: CONST.BINGO + 'socket.io'});
        this.vm = new BingoVM();
        this.socket.on('connectDone', function(msg) {
            var data = JSON.parse(msg);
            self.vm.init(data);
        });
        this.socket.on('loginDone', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshUser(data.user);
        });
        this.socket.on('refreshUsers', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshUsers(data.users);
        });
        this.socket.on('joinDone', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshRoom(data.room);
        });
        this.socket.on('refreshRooms', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshRooms(data.rooms);
        });
    },
    openHomepage: function() {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }
        resurl = resurl.replace(CONST.BINGO, '/');

        window.location.href = resurl;
    },
    closeSidePanel: function() {
        if ($('.control-sidebar').hasClass('control-sidebar-open')) {
            $('.control-sidebar').removeClass('control-sidebar-open');
        }
        if (!$('.navbar-toggle').hasClass('collapsed')) {
            $('.navbar-toggle').click();
        }
    }
};
var bingo = new Bingo();

$(function() {
    bingo.init();
});
