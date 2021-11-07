const path = require('path')

exports.root = path.join(__dirname, '..')

/**
 * makes socket writing global
 * @param {string} msg 
 * @param {Function} err_handle 
 */
exports.socket_write = function (msg, err_handle) {
    if (global.socket)
        global.socket.write(msg)
    else err_handle('Socket not created')
}

/**
 * makes websocket writing global
 * @param {string} msg 
 * @param {Function} err_handle 
 */
exports.websocket_write = function (msg, err_handle) {
    if (global.websocket)
        global.websocket.emit('data', msg)
    else err_handle('WebSocket not created')
}