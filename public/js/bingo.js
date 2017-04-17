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
                members: [],
                drewPool: [],
                bingoList: []
            },
            users: data.users,
            rooms: data.rooms
        };
        this.common = new Vue({
            data: commonData,
            computed: {
                isOwner: function() {
                    var check = false;
                    if (this.room.ownername != "" && this.room.ownername == this.user.name) {
                        check = true;
                    }
                    return check;
                }
            },
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
                        if (this.user && this.user.name == data[idx].name) {
                            this.refreshUser(data[idx]);
                        }
                    }
                },
                refreshRoom: function(data) {
                    this.room.name = data.name;
                    this.room.ownername = data.ownername;
                    this.room.status = data.status;
                    this.room.members.splice(0, this.room.members.length);
                    for (var idx = 0; idx < data.members.length; idx ++) {
                        this.room.members.push(data.members[idx]);
                    }
                },
                refreshRooms: function(data) {
                    this.rooms.splice(0, this.rooms.length);
                    for (var idx = 0; idx < data.length; idx ++) {
                        this.rooms.push(data[idx]);
                        if (this.user && this.user.roomname == data[idx].name) {
                            this.refreshRoom(data[idx]);
                        }
                    }
                },
                refreshDrewPool: function(room) {
                    this.room.drewPool.splice(0, this.room.drewPool.length);
                    for (var idx = 0; idx < room.drewPool.length; idx ++) {
                        var drew = ("00" + room.drewPool[idx]).slice(-2);
                        this.room.drewPool.push(drew);
                    }
                    console.log(JSON.stringify(this.room.drewPool));

                    this.room.bingoList.splice(0, this.room.bingoList.length);
                    for (var idx = 0; idx < room.bingoList.length; idx ++) {
                        this.room.bingoList.push(room.bingoList[idx]);
                    }
                    console.log(JSON.stringify(this.room.bingoList));
                }
            }
        });

        this.userInfoInput = new Vue({
            parent: this.common,
            el: '#user-info-input',
            data: function() {
                return {user: this.$parent.user, inputName: ""};
            },
            mounted: function() {
                $('#user-input-box').eq(0).focus();
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
            updated: function() {
                $('#room-input-box').eq(0).focus();
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

        this.controller = new Vue({
            parent: this.common,
            el: '#controller',
            mounted: function() {
                // $.AdminLTE.controlSidebar.activate();

                $('li[data-toggle="tooltip"]').tooltip({
                    animated: 'fade',
                    placement: 'bottom'
                });
            },
            updated: function() {
                // $.AdminLTE.controlSidebar.activate();

                $('li[data-toggle="tooltip"]').tooltip({
                    animated: 'fade',
                    placement: 'bottom'
                });
            },
            methods: {
                draw: function() {
                    bingo.socket.emit('draw', null);
                }
            }
        });

        this.bingoPanel = new Vue({
            parent: this.common,
            el: '#bingo-panel',
            data: function() {
                return {user: this.$parent.user, room: this.$parent.room};
            },
            computed: {
                isDisplay: function() {
                    if (this.user.name != "" && this.room.name != "") {
                        return true;
                    }
                    return false;
                }
            },
            methods: {
                getMyMember: function() {
                    var member = null;
                    for (var idx = 0; idx < this.room.members.length; idx ++) {
                        if (this.room.members[idx].name == this.user.name) {
                            this.stringifyCard(this.room.members[idx].card);
                            member = this.room.members[idx];
                            break;
                        }
                    }
                    return member;
                },
                getOtherMembers: function() {
                    var members = [];
                    for (var idx = 0; idx < this.room.members.length; idx ++) {
                        if (this.room.members[idx].name != this.user.name) {
                            this.stringifyCard(this.room.members[idx].card);
                            members.push(this.room.members[idx]);
                        }
                    }
                    return members;
                },
                stringifyCard: function(card) {
                    if (!card) {
                        card = [];
                        for (var idx = 0; idx < 25; idx ++) {
                            card.push("99");
                        }
                    } else {
                        for (var idx = 0; idx < card.length; idx ++) {
                            card[idx] = ("00" + card[idx]).slice(-2);
                        }
                    }
                },
                isHit: function(number) {
                    if (number == "99") {
                        return true;
                    }
                    for (var idx = 0; idx < this.room.drewPool.length; idx ++) {
                        if (this.room.drewPool[idx] == number) {
                            return true;
                        }
                    }
                    return false;
                },
                getLeftNumber: function(number, hit) {
                    if (hit) {
                        return "./img/" + number[0] + "w.png";
                    } else {
                        return "./img/" + number[0] + ".png";
                    }
                },
                getRightNumber: function(number, hit) {
                    if (hit) {
                        return "./img/" + number[1] + "w.png";
                    } else {
                        return "./img/" + number[1] + ".png";
                    }
                },
                reach: function(member) {
                    var reached = 0;
                    var map = this.getMap(member);
                    for (key in map) {
                        if (map[key] == 4) {
                            reached ++;
                        }
                        if (map[key] == 5) {
                            reached = 0;
                            break;
                        }
                    }
                    return reached;
                },
                bingo: function(member) {
                    var bingoed = 0;
                    var map = this.getMap(member);
                    for (key in map) {
                        if (map[key] == 5) {
                            bingoed ++;
                        }
                    }
                    return bingoed;
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
        this.socket.on('drawDone', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshDrewPool(data.room);
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
