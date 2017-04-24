var fs = require('fs');
var path = require('path');
var moment = require("moment");
var uuid = require('uuid');
var formidable = require('formidable');

var UploadService = function() {
};
UploadService.prototype = {
    execute: function(req, next) {
        var fileList = [];
        let form = new formidable.IncomingForm();
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
            next({error: "upload error!", data: null});
        });

        form.parse(req);
    }
};

exports.uploadService = new UploadService();
