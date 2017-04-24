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

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.get('/bingo', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'public', 'bingo.html'));
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

router.get('/api/test', function(req, res, next) {
    var spawn = require('child_process').spawn;
    var py = spawn('python', ['vggtest/vggtest.py']);
    var data = ["vggtest/dog.2969.jpg"];
    var dataString = '';

    py.stdout.on('data', function(data) {
        dataString += data.toString();
    });

    py.stdout.on('end', function() {
        console.log('res:', dataString);
    });
    py.stdin.write(JSON.stringify(data));
    py.stdin.end();

    res.json({data: "ok"});
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
