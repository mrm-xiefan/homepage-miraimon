var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
var util = require('util');

var httpRouter = require('./serve/httpRouter.js');
// var socketRouter = require('./serve/socketRouter.js');
// var dataService = require('./serve/dataService.js').dataService;
// var roomService = require('./serve/roomService.js').roomService;
// var userService = require('./serve/userService.js').userService;
var app = express();
// dataService.init(app);
// roomService.init(app);
// userService.init(app);

// uncomment after placing your favicon in /public
app.set('views', path.join(__dirname, 'public'));
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(httpRouter);

// load json to memory
// fs.readFile('./json/sources.json', 'utf8', function (err, jsonstring) {
//     if (err) {
//         console.error('failed to load sources!');
//         console.error(err);
//     } else {
//         var sources = JSON.parse(jsonstring);
//         app.set('sources', sources);
//         console.log('sources is ready!');
//     }
// });

app.listen(50003);
