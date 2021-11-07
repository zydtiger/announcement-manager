const express = require('express')
const {
    root,
} = require('./utility')
const fs = require('fs')
const path = require('path')
const sha256 = require('sha256')
const bodyParser = require('body-parser')
const axios = require('axios')

/*
GET vars exists inside the url
e.g. /welcome?init=true&derp=false

POST vars do not exists
e.g. /welcome
hidden form:
init=true
derp=false
*/

const users_dir = path.join(root, '../db/users')

/**
 * Verifies the user info
 * 
 * @param {string} username 
 * @param {string} pwd 
 * @param {Function} suc_handle
 * @param {Function} err_handle 
 */
function verify_user(username, pwd, suc_handle, err_handle) {
    try {
        // try verify info with the database
        let users = fs.readdirSync(users_dir)
        // if the username exists in database
        let user_filename = username + '.json'
        if (users.indexOf(user_filename) != -1) {
            // get stored hash
            let user_data = fs.readFileSync(path.join(users_dir, user_filename), 'utf-8')
            let pwd_hash = JSON.parse(user_data)['pwd']
            // verification succeed
            if (sha256(pwd) == pwd_hash) suc_handle()
            // fails
            else err_handle('Wrong password!')
        } else {
            // if username does not exist
            err_handle('Username does not exists!')
        }
    } catch (e) {
        console.error(e)
        err_handle('Database failure')
    }
}

/**
 * Sets the cookie for the user
 * 
 * @param {string} username 
 * @param {string} pwd 
 * @param {*} res 
 */
function set_cookie(cookies, res) {
    for (tag in cookies) {
        // console.log(tag, cookies[tag])
        res.cookie(tag, cookies[tag], {
            maxAge: 21600000
        })
    }
}

const router = express.Router()

// **************************
// #region File router init
// **************************

router.get('/', (req, res) => {
    let cookies = req.cookies
    if (cookies) {
        verify_user(cookies.username, cookies.pwd, () => {
            res.render('index.html')
        }, () => res.redirect('/login'))
    } else {
        // if cookie does not exist
        res.redirect('/login')
    }
})

router.get('/login', (req, res) => {
    res.render('login.html', {
        login_err_msg: '',
        signup_err_msg: ''
    })
})

let urlencodedParser = bodyParser.urlencoded({
    extended: false
})

router.post('/login', urlencodedParser, (req, res) => {
    username = req.body.username
    pwd = req.body.pwd

    //verify the login info
    verify_user(username, pwd, () => {
        set_cookie({
            username: username,
            pwd: pwd
        }, res)
        res.redirect(global.redirect ?? '/')
    }, (e) => {
        res.render('login.html', {
            login_err_msg: e
        })
    })
})

router.post('/signup', urlencodedParser, (req, res) => {
    username = req.body.username
    pwd = req.body.pwd

    console.log(req.body)

    try {
        let users = fs.readdirSync(users_dir);
        let user_filename = username + '.json'
        if (users.indexOf(user_filename) == -1) {
            let user_data = {
                'pwd': sha256(pwd)
            }

            fs.writeFileSync(path.join(users_dir, user_filename), JSON.stringify(user_data), 'utf-8')

            set_cookie({
                'username': username,
                'pwd': pwd
            }, res)

            res.redirect('/settings?init=true')
        } else {
            res.render('login.html', {
                signup_err_msg: 'User already exists, plz try again',
                pipe_msg: 'signup'
            })
        }
    } catch (e) {
        res.render('login.html', {
            signup_err_msg: 'Database failure, maybe try again',
            pipe_msg: 'signup'
        })
    }
})

router.get('/settings', (req, res) => {
    let is_init = req.query['init']
    let is_index = req.query['index']

    let cookies = req.cookies
    if (!is_init) users_curpage[cookies.username] = req.url

    if (cookies) {

        let user_filename = cookies.username + '.json'

        verify_user(cookies.username, cookies.pwd, () => {
            fs.readFile(path.join(users_dir, user_filename), 'utf-8', (err, data) => {
                // console.log(data)
                if (err) res.render('login.html', {
                    login_err_msg: 'Login before changing account settings'
                })
                else {
                    res.render('settings.html', {
                        username: cookies.username,
                        subtitle: is_init ? 'Not required to enter all' : '',
                        style_file: is_index ? '/scripts/settings/iframe.less' : '/scripts/settings/index.less',
                        form_action: is_index ? '/account_set?index=true' : '/account_set',
                        accounts: is_init ? {} : JSON.parse(data).accounts,
                        pt_lang: is_init ? 'eng' : JSON.parse(data).lang['pt'],
                        chg_pwd_enabled: is_init ? false : true
                    })
                }
            })

        }, () => {
            global.redirect = '/settings'
            res.redirect('/login')
        })
    }

})

router.get('/version', (req, res) => {
    let package_info = fs.readFileSync(path.join(root, 'package.json'), 'utf-8')
    let package_json = JSON.parse(package_info)
    res.end(package_json.version)
})

// **************************
// #endregion File router init
// **************************



// **************************
// #region Announcement router init
// **************************

router.post('/chg_pwd', urlencodedParser, (req, res) => {
    let username = req.cookies.username
    let pwds = req.body
    console.log(pwds)

    verify_user(username, pwds.opwd, () => {
        let user_filename = username + '.json'
        let user_data_str = fs.readFileSync(path.join(users_dir, user_filename), 'utf-8')
        let user_data = JSON.parse(user_data_str)

        if (pwds.npwd == pwds['npwd-1']) {
            user_data.pwd = sha256(pwds.npwd)
            set_cookie({
                'username': username,
                'pwd': pwds.npwd
            }, res)
        }
        else res.end("Passwords don't match!")

        fs.writeFileSync(path.join(users_dir, user_filename), JSON.stringify(user_data), 'utf-8')
        res.redirect('/welcome')
    }, (e) => res.end(e))
})

router.post('/account_set', urlencodedParser, (req, res) => {

    let username = req.cookies.username
    let accounts = req.body

    let is_index = req.query['index']
    console.log(accounts)

    try {
        let user_filename = username + '.json'
        let users = fs.readdirSync(users_dir)
        if (users.indexOf(user_filename) != -1) {
            let user_data_str = fs.readFileSync(path.join(users_dir, user_filename), 'utf-8')
            let user_data = JSON.parse(user_data_str)

            user_data.accounts = {
                'bb_uname': accounts['bb-uname'],
                'bb_pwd': accounts['bb-pwd'],
                'pt_uname': accounts['pt-uname'],
                'pt_pwd': accounts['pt-pwd'],
                'mb_uname': accounts['mb-uname'],
                'mb_pwd': accounts['mb-pwd'],
                'kog_uname': accounts['kog-uname'],
                'kog_pwd': accounts['kog-pwd']
            }
            user_data.lang = {
                'pt': accounts['pt-lang']
            }
            fs.writeFileSync(path.join(users_dir, user_filename), JSON.stringify(user_data), 'utf-8')
            res.redirect(is_index ? '/welcome' : '/')
        } else {
            global.redirect = '/settings'
            res.render('login.html', {
                login_err_msg: 'username does not exist'
            })
        }
    } catch (e) {
        res.end('failed to set info, maybe try again')
    }
})

let users_curpage = {}

router.get('/announce', (req, res) => {
    console.log(req.ip)

    let username = req.cookies.username
    let target = req.query['target']

    users_curpage[username] = req.url

    const abbrev_map = {
        'bb': 'Blackboard',
        'portal': 'Portal',
        'managebac': 'ManageBac',
        'kognity': 'Kognity'
    }

    console.log('requesting...')

    axios
        .get(`http://localhost:${global.python_port}/get_info/${target}/${username}`)
        .then(ret => {
            if (ret.status == 200) {
                res.render('announce.html', {
                    type: target,
                    original_url: ret.data.original_url,
                    base_url: ret.data.base_url,
                    title: abbrev_map[target]
                })
            }
        })
        .catch(err => console.error(err))
})

router.get('/buf', (req, res) => {
    let username = req.cookies.username
    let target = req.query['target']
    let page = req.query['page']

    axios
        .get(`http://localhost:${global.python_port}/buf/${target}/${username}/${page}`)
        .then(ret => {
            // console.log(ret.data.body)
            if (ret.status == 200) {
                res.end(JSON.stringify(ret.data))
            }
        })
        .catch(err => {
            // console.error(err.response.status)
            res.status(err.response.status)
            res.end(JSON.stringify(err))
        })
})

router.get('/welcome', (req, res) => {
    let username = req.cookies.username

    if (users_curpage[username])
        res.redirect(users_curpage[username])
    else
        res.render('welcome.html', {
            username: username
        })
})

router.get('/sync', (req, res) => {
    let username = req.cookies.username
    let target = req.query['target']

    // console.log(username, target)
    axios
        .get(`http://localhost:${global.python_port}/sync/${target}/${username}`)
        .then(ret => {
            console.log(ret)
            if (ret.status == 200) {
                res.end(ret.data)
            }
        })
        .catch(err => {
            res.status(err.response.status)
            res.end(JSON.stringify(err))
        })
})

router.get('/logout', (req, res) => {
    let username = req.cookies.username

    // delete cookie info
    set_cookie({
        username: '',
        pwd: ''
    }, res)

    if (users_curpage[username]) delete users_curpage[username]

    res.redirect('/login')
})

// **************************
// #endregion Announcement router init
// **************************




// **************************
// #region Todo router init
// **************************

router.post('/tag/create', (req, res) => {

})

router.post('/tag/remove', (req, res) => {

})

router.get('/tag/get/all', (req, res) => {

})

// **************************
// #endregion Todo router init
// **************************

module.exports = router