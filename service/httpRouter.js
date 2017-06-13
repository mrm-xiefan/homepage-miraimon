var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var url = require('url');
var qs = require('querystring');
var mimeTypes = {
'.js': 'text/javascript',
'.css': 'text/css',
'.png': 'image/png',
'.jpg': 'image/jpeg',
'.jpeg': 'image/jpeg',
'.gif': 'image/gif',
'.ico': 'image/x-icon',
'.svg': 'image/svg+xml',
'.ttf': 'font/ttf',
'.otf': 'font/opentype',
'.woff': 'application/font-woff',
'.woff2': 'application/font-woff2',
'.eot': 'application/vnd.ms-fontobject'
};
var uploadService = require('./uploadService.js').uploadService;
var utils = require('./utils').utils;

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
router.get('/cn/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'indexcn.html'));
});

router.get('/bingo', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'bingo.html'));
});
router.get('/bingocn', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'bingocn.html'));
});

router.get('/ai', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'ai.html'));
});
router.get('/aicn', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'aicn.html'));
});

router.get('/seg', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'seg.html'));
});

router.get('/seghelp', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'seghelp.html'));
});

router.get('/vendor/*', function(req, res, next) {
    req.url = req.url.replace('/', '/');
    returnResourceFile(req, res);
});
router.get('/img/*', function(req, res, next) {
    req.url = req.url.replace('/', '/');
    returnResourceFile(req, res);
});
router.get('/css/*', function(req, res, next) {
    req.url = req.url.replace('/', '/');
    returnResourceFile(req, res);
});
router.get('/js/*', function(req, res, next) {
    req.url = req.url.replace('/', '/');
    returnResourceFile(req, res);
});

router.get('/bingo/vendor/*', function(req, res, next) {
    req.url = req.url.replace('/bingo/', '/');
    returnResourceFile(req, res);
});
router.get('/bingo/img/*', function(req, res, next) {
    req.url = req.url.replace('/bingo/', '/');
    returnResourceFile(req, res);
});
router.get('/bingo/css/*', function(req, res, next) {
    req.url = req.url.replace('/bingo/', '/');
    returnResourceFile(req, res);
});
router.get('/bingo/js/*', function(req, res, next) {
    req.url = req.url.replace('/bingo/', '/');
    returnResourceFile(req, res);
});

router.get('/bingocn/vendor/*', function(req, res, next) {
    req.url = req.url.replace('/bingocn/', '/');
    returnResourceFile(req, res);
});
router.get('/bingocn/img/*', function(req, res, next) {
    req.url = req.url.replace('/bingocn/', '/');
    returnResourceFile(req, res);
});
router.get('/bingocn/css/*', function(req, res, next) {
    req.url = req.url.replace('/bingocn/', '/');
    returnResourceFile(req, res);
});
router.get('/bingocn/js/*', function(req, res, next) {
    req.url = req.url.replace('/bingocn/', '/');
    returnResourceFile(req, res);
});

router.get('/ai/vendor/*', function(req, res, next) {
    req.url = req.url.replace('/ai/', '/');
    returnResourceFile(req, res);
});
router.get('/ai/img/*', function(req, res, next) {
    req.url = req.url.replace('/ai/', '/');
    returnResourceFile(req, res);
});
router.get('/ai/css/*', function(req, res, next) {
    req.url = req.url.replace('/ai/', '/');
    returnResourceFile(req, res);
});
router.get('/ai/js/*', function(req, res, next) {
    req.url = req.url.replace('/ai/', '/');
    returnResourceFile(req, res);
});
router.get('/ai/upload/*', function(req, res, next) {
    req.url = req.url.replace('/ai/', '/');
    returnResourceFile(req, res);
});

router.get('/aicn/vendor/*', function(req, res, next) {
    req.url = req.url.replace('/aicn/', '/');
    returnResourceFile(req, res);
});
router.get('/aicn/img/*', function(req, res, next) {
    req.url = req.url.replace('/aicn/', '/');
    returnResourceFile(req, res);
});
router.get('/aicn/css/*', function(req, res, next) {
    req.url = req.url.replace('/aicn/', '/');
    returnResourceFile(req, res);
});
router.get('/aicn/js/*', function(req, res, next) {
    req.url = req.url.replace('/aicn/', '/');
    returnResourceFile(req, res);
});
router.get('/aicn/upload/*', function(req, res, next) {
    req.url = req.url.replace('/aicn/', '/');
    returnResourceFile(req, res);
});

router.get('/cn/vendor/*', function(req, res, next) {
    req.url = req.url.replace('/cn/', '/');
    returnResourceFile(req, res);
});
router.get('/cn/img/*', function(req, res, next) {
    req.url = req.url.replace('/cn/', '/');
    returnResourceFile(req, res);
});
router.get('/cn/css/*', function(req, res, next) {
    req.url = req.url.replace('/cn/', '/');
    returnResourceFile(req, res);
});
router.get('/cn/js/*', function(req, res, next) {
    req.url = req.url.replace('/cn/', '/');
    returnResourceFile(req, res);
});

router.get('/seg/vendor/*', function(req, res, next) {
    req.url = req.url.replace('/seg/', '/');
    returnResourceFile(req, res);
});
router.get('/seg/img/*', function(req, res, next) {
    req.url = req.url.replace('/seg/', '/');
    returnResourceFile(req, res);
});
router.get('/seg/css/*', function(req, res, next) {
    req.url = req.url.replace('/seg/', '/');
    returnResourceFile(req, res);
});
router.get('/seg/js/*', function(req, res, next) {
    req.url = req.url.replace('/seg/', '/');
    returnResourceFile(req, res);
});
router.get('/seg/segjs/*', function(req, res, next) {
    req.url = req.url.replace('/seg/', '/');
    returnResourceFile(req, res);
});
router.get('/seg/segup/*', function(req, res, next) {
    req.url = req.url.replace('/seg/', '/');
    returnResourceFile(req, res);
});

router.get('/seghelp/vendor/*', function(req, res, next) {
    req.url = req.url.replace('/seghelp/', '/');
    returnResourceFile(req, res);
});
router.get('/seghelp/img/*', function(req, res, next) {
    req.url = req.url.replace('/seghelp/', '/');
    returnResourceFile(req, res);
});
router.get('/seghelp/css/*', function(req, res, next) {
    req.url = req.url.replace('/seghelp/', '/');
    returnResourceFile(req, res);
});
router.get('/seghelp/js/*', function(req, res, next) {
    req.url = req.url.replace('/seghelp/', '/');
    returnResourceFile(req, res);
});

router.get('/seg/api/getProject', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var name = url_parts.query.name;
    console.log('getProject:' + name);

    utils.getFileList('public/segup/' + name + '/jpg/', 'jpg', function(err, list) {
        res.json({error: err, data: {pictures: list}});
    });
});

router.post('/seg/api/uploadToSeg', function(req, res, next) {
    console.log('uploadToSeg');
    uploadService.uploadToSeg(req, function(result) {
        if (!result.error) {
            console.log("upload and move end:" + JSON.stringify(result));

            utils.getFileList('public/segup/' + result.project + '/jpg/', 'jpg', function(err, list) {
                console.log(JSON.stringify(list));
                res.json({error: err, data: {pictures: list}});
            });
        } else {
            res.json({error: "S010", data: null});
        }
    });
});

router.post('/seg/api/saveSeg', function(req, res, next) {
    console.log('saveSeg:' + req.body.projectname + " | " + req.body.picturename);
    uploadService.saveSeg(req, function(result) {
        console.log('result:' + JSON.stringify(result));
        res.json(result);
    });
});

router.post('/ai/api/uploadImages', function(req, res, next) {
    console.log('uploadImages');
    uploadService.upload(req, function(result) {
        if (!result.error && result.data && result.data[0]) {
            res.json(result);
        } else {
            res.json({error: "S010", data: null});
        }
    });
});

router.post('/aicn/api/uploadImages', function(req, res, next) {
    console.log('uploadImages');
    uploadService.upload(req, function(result) {
        if (!result.error && result.data && result.data[0]) {
            res.json(result);
        } else {
            res.json({error: "S010", data: null});
        }
    });
});

router.get('/ai/api/vggPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('vggPredict:' + image);

    utils.checkLock(function(err, data) {
        if (err) {
            res.json({"error": "S001", "data": null});
        } else if (data) {
            res.json({"error": "B080", "data": data});
        } else {
            var exec = require('child_process').exec;
            var cmd = "cd /opt/lunania-ai/vggtest/;python vggtest.py --image /opt/homepage-miraimon/public/" + image + ";";
            exec(cmd, function(error, stdout, stderr) {
                if (!error) {
                    var pyresult = stdout.replace(/'/g, '"');
                    var rp = JSON.parse(pyresult);
                    res.json(rp);
                } else {
                    res.json({"error": "S001", "data": null});
                }
            });
        }
    });
});

router.get('/ai/api/cvdPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('cvdPredict:' + image);

    utils.checkLock(function(err, data) {
        if (err) {
            res.json({"error": "S001", "data": null});
        } else if (data) {
            res.json({"error": "B080", "data": data});
        } else {
            var exec = require('child_process').exec;
            var cmd = "cd /opt/lunania-ai/catvsdog/01_job/;python predict.py --mode 3 --image /opt/homepage-miraimon/public/" + image + ";";
            exec(cmd, function(error, stdout, stderr) {
                if (!error) {
                    var pyresult = stdout.replace(/'/g, '"');
                    var rp = JSON.parse(pyresult);
                    res.json(rp);
                } else {
                    res.json({"error": "S001", "data": null});
                }
            });
        }
    });
});

router.get('/ai/api/flowerPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('flowerPredict:' + image);

    var exec = require('child_process').exec;
    utils.checkLock(function(err, data) {
        if (err) {
            res.json({"error": "S001", "data": null});
        } else if (data) {
            res.json({"error": "B080", "data": data});
        } else {
            var cmd = "cd /opt/lunania-ai/flowers/01_job/;python predict.py --image /opt/homepage-miraimon/public/" + image + ";";
            exec(cmd, function(error, stdout, stderr) {
                if (!error) {
                    var pyresult = stdout.replace(/'/g, '"');
                    var rp = JSON.parse(pyresult);
                    res.json(rp);
                } else {
                    res.json({"error": "S001", "data": null});
                }
            });
        }
    });
});

router.get('/aicn/api/vggPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('vggPredict:' + image);

    utils.checkLock(function(err, data) {
        if (err) {
            res.json({"error": "S001", "data": null});
        } else if (data) {
            res.json({"error": "B080", "data": data});
        } else {
            var exec = require('child_process').exec;
            var cmd = "cd /opt/lunania-ai/vggtest/;python vggtest.py --image /opt/homepage-miraimon/public/" + image + ";";
            exec(cmd, function(error, stdout, stderr) {
                if (!error) {
                    var pyresult = stdout.replace(/'/g, '"');
                    var rp = JSON.parse(pyresult);
                    res.json(rp);
                } else {
                    res.json({"error": "S001", "data": null});
                }
            });
        }
    });
});

router.get('/aicn/api/cvdPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('cvdPredict:' + image);

    utils.checkLock(function(err, data) {
        if (err) {
            res.json({"error": "S001", "data": null});
        } else if (data) {
            res.json({"error": "B080", "data": data});
        } else {
            var exec = require('child_process').exec;
            var cmd = "cd /opt/lunania-ai/catvsdog/01_job/;python predict.py --mode 3 --image /opt/homepage-miraimon/public/" + image + ";";
            exec(cmd, function(error, stdout, stderr) {
                if (!error) {
                    var pyresult = stdout.replace(/'/g, '"');
                    var rp = JSON.parse(pyresult);
                    res.json(rp);
                } else {
                    res.json({"error": "S001", "data": null});
                }
            });
        }
    });
});

router.get('/aicn/api/flowerPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('flowerPredict:' + image);

    utils.checkLock(function(err, data) {
        if (err) {
            res.json({"error": "S001", "data": null});
        } else if (data) {
            res.json({"error": "B080", "data": data});
        } else {
            var exec = require('child_process').exec;
            var cmd = "cd /opt/lunania-ai/flowers/01_job/;python predict.py --image /opt/homepage-miraimon/public/" + image + ";";
            exec(cmd, function(error, stdout, stderr) {
                if (!error) {
                    var pyresult = stdout.replace(/'/g, '"');
                    var rp = JSON.parse(pyresult);
                    res.json(rp);
                } else {
                    res.json({"error": "S001", "data": null});
                }
            });
        }
    });
});

router.get('/aicn/api/segPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('segPredict:' + image);

    utils.checkLock(function(err, data) {
        if (err) {
            res.json({"error": "S001", "data": null});
        } else if (data) {
            res.json({"error": "B080", "data": data});
        } else {
            var exec = require('child_process').exec;
            var cmd = "cd /opt/lunania-ai/seg/01_job/;python predict.py --image /opt/homepage-miraimon/public/" + image + ";";
            exec(cmd, function(error, stdout, stderr) {
                if (!error) {
                    var pyresult = stdout.replace(/'/g, '"');
                    var rp = JSON.parse(pyresult);
                    res.json(rp);
                } else {
                    res.json({"error": "S001", "data": null});
                }
            });
        }
    });
});

function returnResourceFile(req, res) {
    var publicDirectory = fs.realpathSync('public');
    var decodedUri = decodeURI(req.url);
    var fileFullPathArray = path.join(publicDirectory, decodedUri).split('?');
    var fileFullPath = fileFullPathArray[0];
    var st = fs.statSync(fileFullPath);
    var etag = '"' + st.size + '-' + Number(st.mtime) + '"';
    if (req.headers['if-none-match'] === etag) {
        res.writeHead(304);
        res.end();
    } else {
        var ext = path.extname(path.basename(decodedUri).split('?')[0]);
        var mimeType = 'application/octet-stream';
        if (mimeTypes[ext]) {
            mimeType = mimeTypes[ext];
        }
        fs.exists(fileFullPath, function(exists) {
            if (exists) {
                fs.readFile(fileFullPath, function(err, data) {
                    if (err) {
                        res.writeHead(500);
                        res.end('Internal Server Error');
                    } else {
                        var headers = {
                            'Content-Type': mimeType,
                            'Etag': etag
                        };
                        res.writeHead(200, headers);
                        res.end(data);
                    }
                });
            } else {
                res.writeHead(404);
                res.end('Nod found.');
            }
        });
    }
};

module.exports = router;
