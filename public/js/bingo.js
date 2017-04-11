var CONST = {
    BINGO: '/bingo/'
};

var BingoVM = function() {};
BingoVM.prototype = {
    init: function() {

    }
};

var Bingo = function() {};
Bingo.prototype = {
    socket: null,
    vm: null,
    init: function() {
        this.socket = io(location.host, {path: CONST.BINGO + 'socket.io'});
        this.vm = new BingoVM();
        this.vm.init();
        // this.socket.on('refreshBoardList', function(list) {
        //     var boardlist = JSON.parse(list);
        //     boxVM.boardlist.refreshBoardList(boardlist);
        // });
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
