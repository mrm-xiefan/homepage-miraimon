var CONST = {
    BINGO: '/bingo/',
    MESSAGE: {
        '0001': 'すでに使用されています。',
        '0002': 'Bingoを続けることができます。',
        '0003': 'Bingoを始めることができます。'
    }
};

var BingoVM = function() {};
BingoVM.prototype = {
    common: null,
    userInfoInput: null,
    init: function(data) {
        var commonData = {
            user: {
                name: "",
                socketid: "",
                roomname: ""
            },
            room: {
                name: "",
                status: "",
                members: []
            },
            users: data.users
        };
        this.common = new Vue({
            data: commonData,
            methods: {
                refreshUser: function(data) {
                    this.user.name = data.name;
                    this.user.socketid = data.socketid;
                    this.user.roomname = data.roomname;
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
                    for (var i = 0; i < bingo.vm.common.users.length; i ++) {
                        var user = bingo.vm.common.users[i];
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
                }
            },
            methods: {
                login: function() {
                    if (!this.inputName) {
                        return;
                    }
                    bingo.socket.emit('login', JSON.stringify({name: this.inputName}));
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
    },
    openHomepage: function() {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }
        resurl = resurl.replace(CONST.BINGO, '/');

        window.location.href = resurl;
    },
};
var bingo = new Bingo();

$(function() {
    bingo.init();
});
