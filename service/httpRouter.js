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

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
router.get('/cn/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', 'public', 'indexcn.html'));
});

router.get('/bingo', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'public', 'bingo.html'));
});
router.get('/bingocn', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'public', 'bingocn.html'));
});

router.get('/ai', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'public', 'ai.html'));
});
router.get('/aicn', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'public', 'aicn.html'));
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

router.post('/ai/api/uploadImages', function(req, res, next) {
    console.log('uploadImages');
    uploadService.execute(req, function(result) {
        if (!result.error && result.data && result.data[0]) {
            res.json(result);
        } else {
            res.json({error: "S010", data: null});
        }
    });
});

router.post('/aicn/api/uploadImages', function(req, res, next) {
    console.log('uploadImages');
    uploadService.execute(req, function(result) {
        if (result.data && result.data[0]) {
            console.log('begin recog:'+JSON.stringify(result));
            var spawn = require('child_process').spawn;
            var py = spawn('python', ['vggtest/vggtest.py']);
            var data = ['public/' + result.data[0]];
            var pyresult = null;

            py.stdout.on('data', function(data) {
                var a = data.toString().replace(/'/g, '"');
                a = "[" + a.replace(/}\r?\n{/g, "},{") + "]";
                pyresult = JSON.parse(a);
            });

            py.stdout.on('end', function() {
                console.log('res:', JSON.stringify(pyresult));
                result.recog = pyresult;
                res.json(result);
            });
            py.stdin.write(JSON.stringify(data));
            py.stdin.end();
        }
    });
});

router.get('/ai/api/vggPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('vggPredict:' + image);

    // call vggtest/vggtest.py. params are: --image image.
    setTimeout(function() {
        // var dummy = "{'data': [{'percentage': '66.3982629776', 'name': 'Labrador_retriever'}, {'percentage': '9.4870463014', 'name': 'Chesapeake_Bay_retriever'}, {'percentage': '4.1787553579', 'name': 'Great_Dane'}, {'percentage': '3.8375608623', 'name': 'German_short-haired_pointer'}, {'percentage': '3.4991543740', 'name': 'flat-coated_retriever'}], 'error': ''}";
        var dummy = "{'data': [], 'error': 'B999'}";
        dummy = dummy.replace(/'/g, '"');
        var rp = JSON.parse(dummy);
        res.json(rp);
    }, 2000);
});

router.get('/ai/api/cvdPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('cvdPredict:' + image);

    // call catvsdog/01_job/predict.py. params are: --image image --mode 3.
    setTimeout(function() {
        // var dummy = "{'data': {'value': '0.5020517707'}, 'error': ''}";
        var dummy = "{'data': [], 'error': 'B999'}";
        dummy = dummy.replace(/'/g, '"');
        var rp = JSON.parse(dummy);
        res.json(rp);
    }, 2000);
});

router.get('/ai/api/flowerPredict', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var image = url_parts.query.image;
    console.log('flowerPredict:' + image);

    // call flower/01_job/predict.py. params are: --image image.
    setTimeout(function() {
        // var dummy = "{'data': [{'percentage': '66.3982629776', 'name': 'Cowslip'}, {'percentage': '19.4870463014', 'name': 'Windflower'}, {'percentage': '4.1787553579', 'name': 'Snowdrop'}, {'percentage': '3.8375608623', 'name': 'Iris'}, {'percentage': '3.4991543740', 'name': 'Pansy'}], 'error': ''}";
        var dummy = "{'data': [], 'error': 'B999'}";
        dummy = dummy.replace(/'/g, '"');
        var rp = JSON.parse(dummy);
        res.json(rp);
    }, 2000);
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
