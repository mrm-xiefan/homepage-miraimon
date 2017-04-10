var Bingo = function() {};
Bingo.prototype = {
    openHomepage: function() {
        window.location.href = this.setParameter("", {});
    },
    setParameter: function(additional, paramsArray) {
        var resurl = location.href.replace(/\?.*$/, "");
        if (resurl.substr(resurl.length - 1, 1) === '#') {
            resurl = resurl.substr(0, resurl.length - 1);
        }
        if (additional != "") {
            resurl += additional + '/';
        }
        resurl = resurl.replace(/bingo\//, "");
        for (key in paramsArray) {
            resurl += (resurl.indexOf('?') == -1) ? '?':'&';
            resurl += key + '=' + paramsArray[key];
        }
        return resurl;
    },
};
var bingo = new Bingo;

$(function() {

});
