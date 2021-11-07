# README

Based on Nodejs express framework
Uses bootstrap, less, jquery, and more

This is a tool that facilitates the checking of announcements on SHSID notification platforms.

Included functionality:
- Blackboard announcements

- Portal news

- Kognity hw

- Managebac tasks

- ...

## How to boot
### Setup a Nodejs environment
Just search it up, pretty simple
### Setup a python environment
Search it up as well :)
### Boot Nodejs server
```bash
cd PROJ_DIR
# replace PROJ_DIR to the path of nodejs-server
npm i
# installs the packages, make sure you have already configured the nodejs environment
# it it's too slow, use a china mirror
npm config set registry https://registry.npm.taobao.org/

npm start
# starts the server
```

### Boot python flask server
```bash
cd PROJ_DIR
# replace PROJ_DIR to the path of python-backend
pip install flask bs4 selenium
# install the dependencies, if you use conda, maybe this works
conda install flask bs4 selenium

python app.py
# boots the server, logs in logs/log
```

## Config
### config.json
```json
{
    // configuration for nodejs server
    "nodejs": {
        /*
        defines the port of the server

        2000: dev port
        3000: deploy port
        */
        "port": 2000
    },
    // configuration for python flask server
    "flask": {
        /*
        defines the port of the server

        6000: dev port
        5000: deploy port
        */
        "port": 6000
    }
}
```

## Ask me if you have any question

Use typora as your markdown viewer for best performance