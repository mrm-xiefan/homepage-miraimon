var fs = require('fs');
var path = require('path');
var getDirName = require("path").dirname;

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
    },
    getFileList: function(filepath, ext, cb) {
        var self = this;
        fs.readdir(filepath, function(err, files) {
            if (!err) {
                var fileList = [];
                var idx = 0;
                self.filterFile(filepath, files, idx, ext, fileList, function() {
                    fileList.sort(function(a, b) {
                        if (a.date > b.date) return -1;
                        if (a.date < b.date) return 1;
                        return 0;
                    });
                    cb(null, fileList);
                });
            } else {
                cb("GETFILELISTERR", null);
            }
        });
    },
    filterFile: function(filepath, files, idx, ext, fileList, cb) {
        var self = this;
        if (idx >= files.length) {
            cb();
            return;
        } else {
            if (!ext || (ext && path.extname(files[idx]) == ('.' + ext))) {
                var filename = path.join(filepath, path.basename(files[idx]));
                var filestat = fs.statSync(filename);
                var name = path.basename(files[idx], path.extname(files[idx]));
                var udate = filestat.mtime.getTime();

                // TODO:not common process
                var list = filepath.split('/');
                if (list[list.length - 1] == "") {
                    list.splice(list.length - 1, 1);
                }
                list[list.length - 1] = 'png';
                var pngPath = list.join('/');
                var pngFullPath = path.join(pngPath, name + '.png');
                fs.exists(pngFullPath, function(exists) {
                    if (exists) {
                        fileList.push({
                            file: filename,
                            name: name,
                            date: udate,
                            png: true
                        });
                        self.filterFile(filepath, files, idx + 1, ext, fileList, cb);
                    } else {
                        fileList.push({
                            file: filename,
                            name: name,
                            date: udate,
                            png: false
                        });
                        self.filterFile(filepath, files, idx + 1, ext, fileList, cb);
                    }
                });
            } else {
                self.filterFile(filepath, files, idx + 1, ext, fileList, cb);
            }
        }
    }
};
exports.utils = new Utils();
