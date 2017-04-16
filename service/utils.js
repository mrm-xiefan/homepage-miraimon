function Utils() {
};
Utils.prototype = {
    createArray: function(cnt) {
        var array = [];
        for (var idx = 0; idx < cnt; idx ++) {
            array.push({number: idx + 1, rnd: Math.random()});
        }

        // sort by rnd
        for (var i = 0; i < cnt; i ++) {
            for (var j = 0; j < cnt - i - 1; j ++) {
                if (array[j].rnd > array[j + 1].rnd) {
                    array.splice(j, 2, array[j + 1], array[j])
                }
            }
        }

        var result = [];
        for (var idx = 0; idx < cnt; idx ++) {
            result.push(array[idx].number);
        }

        return result;
    }
};
exports.utils = new Utils();
