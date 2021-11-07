"use strict";

/**
 * @author ZYD
 * @date 2021/09/08
 * Entrance of the server
 * Function:
 *  - Create a website server and socket server (for python)
 */
var express = require('express');

var cookieParser = require('cookie-parser');

var _require = require('./utility'),
    root = _require.root;

var path = require('path');

var fs = require('fs');

var config_info = fs.readFileSync(path.join(root, '../config.json'), 'utf-8');
var config_json = JSON.parse(config_info);
var port = config_json['nodejs'].port;
global.python_port = config_json['flask'].port;
var app = express();
app.use('/public/', express["static"](path.join(root, './public/')));
app.use('/buffer/', express["static"](path.join(root, '../buffer/')));
app.use('/node_modules/', express["static"](path.join(root, '/node_modules/')));
app.use('/libs/', express["static"](path.join(root, '/libs/')));
app.use('/scripts/', express["static"](path.join(root, '/scripts/')));
app.use('/views/', express["static"](path.join(root, '/views/')));
app.set('views', path.join(root, '/views/'));
app.engine('html', require('express-art-template'));
app.use(cookieParser());
app.use(require('./router'));

var server = require('http').createServer(app);

server.listen(port, function () {
  console.log("Server listening at localhost:".concat(port));
});