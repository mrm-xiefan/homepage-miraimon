var fs = require('fs');
var path = require('path');
var moment = require("moment");
var uuid = require('uuid');
var formidable = require('formidable');
var os = require('os');
if (os.arch() == 'x64') {
    var sharp = require('sharp');
}

var UploadService = function() {
};
UploadService.prototype = {
    upload: function(req, next) {
        var self = this;
        var localFileList = [];
        var movedFileList = [];
        var form = new formidable.IncomingForm();
        form.multiples = true;

        form.on('file', function(field, file) {
            console.log("received one file:" + file.path);
            localFileList.push(file.path);
        });

        form.on('end', function() {
            console.log("upload end:"+JSON.stringify(localFileList));
            self.resizePicture(localFileList, 0, function(error, fileList) {
                if (error) {
                    next({error: "S012"});
                } else {
                    next({error: null, data: fileList});
                }
            });
        });

        form.on('error', function(err) {
            console.log(err);
            next({error: "S010"});
        });

        form.parse(req);
    },

    resizePicture: function(pictures, idx, next) {
        var self = this;
        var fileList = [];
        if (idx > pictures.length - 1) {
            next(null, fileList);
            return;
        }
        console.log("resize:" + pictures[idx]);
        var imageId = uuid.v4();
        var movedFile = path.join(__dirname, '..', 'public', 'upload', imageId + '.jpg');
        fileList.push('upload/' + imageId + '.jpg');
        if (os.arch() == 'x64') {
            sharp(pictures[idx])
                .resize(500, 500)
                .background('black')
                .toFile(movedFile)
                .then(function() {
                    self.trimPicture(pictures, idx + 1, next);
                });
        } else {
            fs.rename(pictures[idx], movedFile, function() {
               self.trimPicture(pictures, idx + 1, next);
            });
        }
    },

    uploadToSeg: function(req, next) {
        var self = this;
        var project = "";
        var localFileList = [];
        var movedFileList = [];
        var form = new formidable.IncomingForm();
        form.multiples = true;

        form.on('field', function(field, value) {
            console.log("get field:" + value);
            if (field == 'project') {
                project = value;
            }
        });

        form.on('file', function(field, file) {
            console.log("received one file:" + file.path);
            localFileList.push(file.path);
        });

        form.on('end', function() {
            console.log("project:" + project);
            console.log("upload end:"+JSON.stringify(localFileList));
            self.trimPicture(localFileList, 0, project, function(error) {
                if (error) {
                    next({error: "S012"});
                } else {
                    next({error: null, project: project, count: localFileList.length});
                }
            });
        });

        form.on('error', function(err) {
            console.log(err);
            next({error: "S010"});
        });

        form.parse(req);
    },

    trimPicture: function(pictures, idx, project, next) {
        var self = this;
        if (idx > pictures.length - 1) {
            next(null);
            return;
        }
        console.log("trim:" + pictures[idx]);
        var imageId = uuid.v4();
        var movedFile = path.join(__dirname, '..', 'public', 'segup', project, 'jpg', imageId + '.jpg');
        if (os.arch() == 'x64') {
            sharp(pictures[idx])
                .resize(500, 500)
                .background('black')
                .toFile(movedFile)
                .then(function() {
                    self.trimPicture(pictures, idx + 1, project, next);
                });
        } else {
            fs.rename(pictures[idx], movedFile, function() {
               self.trimPicture(pictures, idx + 1, project, next);
            });
        }
    },

    saveSeg: function(req, next) {
        var imgBase64 = req.body.imgBase64;
        var projectname = req.body.projectname;
        var picturename = req.body.picturename;
        var bitmap = new Buffer(imgBase64, 'base64');
        var localFileName = path.join(__dirname, '..', 'public', 'segup', projectname, 'png', picturename + '.png');
        console.log("save to:" + localFileName);
        fs.writeFile(localFileName, bitmap, function(err) {
            if (err) {
                next({error: "S011"});
            } else {
                next({error: null});
            }
        });
    }
};

exports.uploadService = new UploadService();
