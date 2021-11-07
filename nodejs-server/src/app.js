/**
 * @author ZYD
 * @date 2021/09/08
 * Entrance of the server
 * Function:
 *  - Create a website server
 */


const express = require('express')
const cookieParser = require('cookie-parser')
const {
    root,
} = require('./utility')
const path = require('path')
const fs = require('fs')

let config_info = fs.readFileSync(path.join(root, '../config.json'), 'utf-8')
let config_json = JSON.parse(config_info)
const port = config_json['nodejs'].port
global.python_port = config_json['flask'].port

const app = express()

app.use('/public/', express.static(path.join(root, './public/')))
app.use('/buffer/', express.static(path.join(root, '../buffer/')))
app.use('/node_modules/', express.static(path.join(root, '/node_modules/')))
app.use('/libs/', express.static(path.join(root, '/libs/')))
app.use('/scripts/', express.static(path.join(root, '/scripts/')))
app.use('/views/', express.static(path.join(root, '/views/')))

app.set('views', path.join(root, '/views/'))
app.engine('html', require('express-art-template'))

app.use(cookieParser())
app.use(require('./router'))

const server = require('http').createServer(app)
server.listen(port, () => {
    console.log(`Server listening at localhost:${port}`)
})
