var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');
var util = require('util');
var http = require('http');

var port = null;
port = 8090;

var httpRouter = require('./service/httpRouter.js');
var socketRouter = require('./service/socketRouter.js').socketRouter;
// var dataService = require('./service/dataService.js').dataService;
// var roomService = require('./service/roomService.js').roomService;
// var userService = require('./service/userService.js').userService;
var app = express();
// dataService.init(app);
// roomService.init(app);
// userService.init(app);

// uncomment after placing your favicon in /public
app.set('views', path.join(__dirname, 'public'));
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(httpRouter);

var server = http.createServer(app);
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

socketRouter.init(server);
