var fs = require('fs');
var path = require('path');
var moment = require("moment");
var uuid = require('uuid');
var formidable = require('formidable');

var UploadService = function() {
};
UploadService.prototype = {
    upload: function(req, next) {
        var fileList = [];
        var form = new formidable.IncomingForm();
        form.multiples = true;

        form.on('file', function (field, file) {
            const ext = path.extname(file.name);
            const localFileName = file.path;

            const imageId = uuid.v4();
            const fileName = path.join(__dirname, '..', 'public', 'upload', imageId + ext);
            console.log("one file:" + fileName);
            fileList.push('upload/' + imageId + ext);

            fs.rename(localFileName, fileName, function() {});
        });

        form.on('end', function() {
            console.log("upload end:"+JSON.stringify(fileList));
            next({error: null, data: fileList});
        });

        form.on('error', function (err) {
            console.log(err);
            next({error: "S010", data: null});
        });

        form.parse(req);
    },

    uploadToSeg: function(req, next) {
        var project = "";
        var localFileList = [];
        var movedFileList = [];
        var form = new formidable.IncomingForm();
        form.multiples = true;

        form.on('field', function (field, value) {
            console.log("get field:" + value);
            if (field == 'project') {
                project = value;
            }
        });

        form.on('file', function (field, file) {
            console.log("received one file:" + file.path);
            localFileList.push(file.path);
        });

        form.on('end', function() {
            console.log("project:" + project);
            console.log("upload end:"+JSON.stringify(localFileList));
            var all = localFileList.length;
            for (var idx = 0; idx < localFileList.length; idx ++) {
                var imageId = uuid.v4();
                var movedFile = path.join(__dirname, '..', 'public', 'segup', project, 'jpg', imageId + '.jpg');
                fs.rename(localFileList[idx], movedFile, function() {
                    all --;
                    if (all == 0) {
                        console.log("move end.");
                        next({error: null, project: project, count: localFileList.length});
                    }
                });
            }
        });

        form.on('error', function (err) {
            console.log(err);
            next({error: "S010"});
        });

        form.parse(req);
    },

    saveSeg: function(req, next) {
        var imgBase64 = req.body.imgBase64;
        var projectname = req.body.projectname;
        var picturename = req.body.picturename;
        var bitmap = new Buffer(imgBase64, 'base64');
        let localFileName = path.join(__dirname, '..', 'public', 'segup', projectname, 'png', picturename + '.png');
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
