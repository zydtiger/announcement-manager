"use strict";

$(function () {
  // define the list vue elem
  var list = new Vue({
    el: '#list',
    delimiters: ['${', '}'],
    data: {
      announcements: []
    },
    methods: {}
  }); // request for the bb announcements from server

  var socket = io();
  socket.on('connect', function () {
    return console.log('Socket.io connection built');
  });
  socket.on('data', function (data) {
    console.log(data);
    bb_info = JSON.parse(data); // set the cookies from the crawler to correctly get images and static resources
    // console.log(bb_info['cookies'])

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = bb_info['cookies'][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var cookie = _step.value;
        var key = cookie['name'];
        var val = cookie['value'];
        var config = {};

        for (tag in cookie) {
          if (tag != 'name' && tag != 'value') config[tag] = cookie[tag];
        } // console.log('hey')


        Cookies.set(key, val, config);
        console.log(key, val, config, '\n\n\n'); // document.cookie = `${key}=${val}` + config_str
      } // console.log(test)

    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    list.announcements = bb_info.list;
  });
});