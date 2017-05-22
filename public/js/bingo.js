if (!CONST) {
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
        '0005': '結果確認',
        '9999': 'ビンゴ'
    },
    GAME_STATUS: {
        '0001': '',
        '0002': '新しいゲーム',
        '0003': 'ゲーム準備中',
        '0004': 'ゲーム進行中',
        '0005': 'ゲーム終了',
        '9999': '進行中のゲーム'
    },
    GAME_STATUS_TITLE: {
        '1': '準備中',
        '2': '進行中',
        '3': '終了'
    }
};
}

var BingoVM = function() {};
BingoVM.prototype = {
    init: function(data) {
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
                },
                isControllable: function() {
                    var check = this.isOwner;
                    if (this.room.status != "1" && this.room.status != "2") {
                        check = false;
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
                    this.refreshOneRoom(this.room, data);
                },
                refreshRooms: function(data) {
                    // delete rooms which are destroied.
                    for (var i = this.rooms.length - 1; i >= 0; i --) {
                        var isGone = true;
                        for (var j = 0; j < data.length; j ++) {
                            if (data[j].name == this.rooms[i].name) {
                                isGone = false;
                                break;
                            }
                        }
                        if (isGone) {
                            this.rooms.splice(i, 1);
                        }
                    }

                    // update or add rooms.
                    for (var i = 0; i < data.length; i ++) {
                        var isNew = true;
                        for (var j = 0; j < this.rooms.length; j ++) {
                            if (data[i].name == this.room.name) {
                                this.refreshRoom(data[i]);
                            }
                            if (data[i].name == this.rooms[j].name) {
                                isNew = false;
                                this.refreshOneRoom(this.rooms[j], data[i]);
                                break;
                            }
                        }
                        if (isNew) {
                            this.rooms.push(data[i]);
                        }
                    }
                },
                refreshOneRoom: function(target, data) {
                    target.name = data.name;
                    target.ownername = data.ownername;
                    target.status = data.status;

                    target.drewPool.splice(0, target.drewPool.length);
                    for (var idx = 0; idx < data.drewPool.length; idx ++) {
                        var drew = ("00" + data.drewPool[idx]).slice(-2);
                        target.drewPool.push(drew);
                    }

                    target.bingoList.splice(0, target.bingoList.length);
                    for (var idx = 0; idx < data.bingoList.length; idx ++) {
                        target.bingoList.push(data.bingoList[idx]);
                    }

                    // delete members who has gone.
                    for (var i = target.members.length - 1; i >= 0; i --) {
                        var isGone = true;
                        for (var j = 0; j < data.members.length; j ++) {
                            if (data.members[j].name == target.members[i].name) {
                                isGone = false;
                                break;
                            }
                        }
                        if (isGone) {
                            target.members.splice(i, 1);
                        }
                    }

                    // update or add members.
                    for (var i = 0; i < data.members.length; i ++) {
                        var isNew = true;
                        for (var j = 0; j < target.members.length; j ++) {
                            if (data.members[i].name == target.members[j].name) {
                                isNew = false;
                                target.members[j].name = data.members[i].name;
                                target.members[j].socketid = data.members[i].socketid;
                                target.members[j].roomname = data.members[i].roomname;
                                target.members[j].reach = data.members[i].reach;
                                target.members[j].bingo = data.members[i].bingo;
                                target.members[j].rank = data.members[i].rank;
                                target.members[j].drewPool.splice(0, target.members[j].drewPool.length);
                                for (var idx = 0; idx < data.members[i].drewPool.length; idx ++) {
                                    target.members[j].drewPool.push(data.members[i].drewPool[idx]);
                                }
                                break;
                            }
                        }
                        if (isNew) {
                            target.members.push(data.members[i]);
                        }
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
                                return "0002";
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
                return {user: this.$parent.user, room: this.$parent.room, inputName: ""};
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
                        } else if (room.status == "2" && this.isRoomMember(room)) {
                            return "0004";
                        } else if (room.status == "3" && this.isRoomMember(room)) {
                            return "0005";
                        } else {
                            return "9999";
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
                        if (room.status == "1" || ((room.status == "2" || room.status == "3") && this.isRoomMember(room))) {
                            list.push(room);
                        }
                    }
                    return list;
                },
                isRoomMember: function(room) {
                    for (var idx = 0; idx < room.members.length; idx ++) {
                        if (room.members[idx].name == this.user.name) {
                            return true;
                        }
                    }
                    return false;
                },
                select: function(name) {
                    this.inputName = name;
                },
                join: function() {
                    if (this.inputCheck == "0001") {
                        return;
                    }

                    bingo.socket.emit('join', JSON.stringify({name: this.inputName}));
                },
                getGameStatus: function(status) {
                    return CONST.GAME_STATUS_TITLE[status];
                }
            }
        });

        this.controller1 = new Vue({
            parent: this.common,
            el: '#controller1',
            data: function() {
                return {user: this.$parent.user, room: this.$parent.room};
            },
            methods: {
                draw: function() {
                    bingo.socket.emit('draw', null);
                }
            }
        });
        this.controller2 = new Vue({
            parent: this.common,
            el: '#controller2',
            data: function() {
                return {user: this.$parent.user, room: this.$parent.room};
            }
        });
        this.controller3 = new Vue({
            parent: this.common,
            el: '#controller3',
            data: function() {
                return {user: this.$parent.user, room: this.$parent.room};
            },
            mounted: function() {
                $.AdminLTE.controlSidebar.activate();
            },
            updated: function() {
                $.AdminLTE.controlSidebar.activate();
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
                    if (this.user.name != "" && this.room.name != "" && this.getMyMember()) {
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
                isHit: function(number, drewPool) {
                    if (number == "99") {
                        return true;
                    }
                    for (var idx = 0; idx < drewPool.length; idx ++) {
                        if (drewPool[idx] == number) {
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
                }
            }
        });

        this.sideUsers = new Vue({
            parent: this.common,
            el: '#control-sidebar-users-tab',
            data: function() {
                return {user: this.$parent.user, room: this.$parent.room};
            },
            computed: {
                gameStatus: function() {
                    return CONST.GAME_STATUS_TITLE[this.room.status];
                }
            },
            methods: {
                getHref: function(member) {
                    return "javascript:bingo.vm.sideUsers.kick(" + member.name + ");";
                },
                kick: function(membername) {
                    if (!bingo.vm.common.isOwner) {
                        return;
                    }
                    if (this.user.name == membername) {
                        return;
                    }
                    if (this.room.bingoList.length > 0) {
                        return;
                    }
                    bingo.vm.kickConfirmModal.setKickMember(membername);
                    bingo.vm.kickConfirmModal.$nextTick(function() {
                        $('#kick-confirm-modal').modal();
                    });
                }
            }
        });

        this.sideCards = new Vue({
            parent: this.common,
            el: '#control-sidebar-cards-tab',
            data: function() {
                return {user: this.$parent.user, room: this.$parent.room};
            },
            methods: {
                getOtherMembers: function() {
                    var members = [];
                    for (var idx = 0; idx < this.room.members.length; idx ++) {
                        if (this.room.members[idx].name != this.user.name) {
                            bingo.vm.bingoPanel.stringifyCard(this.room.members[idx].card);
                            members.push(this.room.members[idx]);
                        }
                    }
                    return members;
                }
            }
        });

        this.kickConfirmModal = new Vue({
            parent: this.common,
            el: '#kick-confirm-modal',
            data: function() {
                return {name: ""};
            },
            computed: {
                confirmMessage: function() {
                    return "Are you sure to kick [" + this.name + "].";
                }
            },
            methods: {
                setKickMember: function(name) {
                    this.name = name;
                },
                kick: function() {
                    $('#kick-confirm-modal').modal('hide');
                    bingo.socket.emit('kick', JSON.stringify({name: this.name}));
                }
            }
        });

        this.drawAnimater = new Vue({
            parent: this.common,
            el: '#draw-animation-modal',
            data: function() {
                return {number: ""};
            },
            methods: {
                begin: function(number) {
                    var self = this;
                    this.number = "99";
                    var started = new Date().getTime();
                    animationTimer = setInterval(function() {
                        if (new Date().getTime() - started > 2500) {
                            clearInterval(animationTimer);
                            self.number = ("00" + number).slice(-2);
                        } else {
                            self.number = ("00" + (Math.ceil(Math.random() * 99))).slice(-2);
                        }
                    }, 100);
                },
                getLeftNumber: function() {
                    return "./img/" + this.number[0] + ".png";
                },
                getRightNumber: function() {
                    return "./img/" + this.number[1] + ".png";
                }
            }
        });

        this.bingoAnimater = new Vue({
            parent: this.common,
            el: '#bingo-animation-modal',
            data: function() {
                return {bingos: []};
            },
            methods: {
                begin: function(bingos) {
                    this.bingos.splice(0, this.bingos.length);
                    for (var idx = 0; idx < bingos.length; idx ++) {
                        this.bingos.push(bingos[idx]);
                    }
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
        this.socket.on('refreshUser', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshUser(data.user);
        });
        this.socket.on('refreshUsers', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshUsers(data.users);
        });
        this.socket.on('refreshRoom', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshRoom(data.room);

            $('#draw-animation-modal').modal('hide');
            $('#bingo-animation-modal').modal('hide');
        });
        this.socket.on('refreshRooms', function(msg) {
            var data = JSON.parse(msg);
            self.vm.common.refreshRooms(data.rooms);
        });
        this.socket.on('kicked', function(msg) {
            var data = JSON.parse(msg);
            if (data.kicked == bingo.vm.common.user.name) {
                bingo.vm.common.room.name = "";
                bingo.vm.common.room.ownername = "";
                bingo.vm.common.room.status = "";
                bingo.vm.common.room.drewPool.splice(0, bingo.vm.common.room.drewPool.length);
                bingo.vm.common.room.bingoList.splice(0, bingo.vm.common.room.bingoList.length);
                bingo.vm.common.room.members.splice(0, bingo.vm.common.room.members.length);
            }
            self.vm.common.refreshUsers(data.users);
            self.vm.common.refreshRooms(data.rooms);
        });
        this.socket.on('drawAnimation', function(msg) {
            bingo.vm.drawAnimater.begin(msg);
            $('#draw-animation-modal').modal();
        });
        this.socket.on('bingoAnimation', function(msg) {
            var data = JSON.parse(msg);
            bingo.vm.bingoAnimater.begin(data);
            $('#bingo-animation-modal').modal();
        });
        this.socket.on('disconnect', function() {
            self.openBingo();
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
    openBingo: function() {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }

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
