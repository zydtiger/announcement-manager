import sys
import socket
import os
import json
import platform

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36",
    # "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
}

proj_root = '..'
db_path = "../db"

buffer_path = '../buffer/'
bb_dir = os.path.join(buffer_path, "bb")
portal_dir = os.path.join(buffer_path, 'pt')
managebac_dir = os.path.join(buffer_path, 'mb')
kog_dir = os.path.join(buffer_path, 'kog')


host = socket.gethostname()
port = 8888

def chromedriver_path():
    if platform.system() == 'Windows':
        return './drivers/chromedriver.exe'
    elif platform.system() == 'Linux':
        return './drivers/chromedriver'

def init_log():
    f = open("./logs/log", "w", encoding="utf-8")
    sys.stdout = f
    sys.stderr = f


CERROR = "[\033[31m" + "ERROR" + "\033[0m]\t"
CWARNING = "[\033[33m" + "WARNING" + "\033[0m]\t"
CINFO = "[\033[34m" + "INFO" + "\033[0m]\t\t"
CSUCCESS = "[\033[32m" + "SUCCESS" + "\033[0m]\t"

ERROR = "ERROR\t"
WARNING = "WARNING\t"
INFO = "INFO\t"
SUCCESS = "SUCCESS\t"


def log(s, stdout=False, begin="", end=None):
    if stdout:
        print(begin, s, file=sys.__stdout__, flush=True, end=end)
    else:
        print(begin, s, flush=True, end=end)


def error(s):
    log(s, begin=ERROR)


def info(s):
    log(s, begin=INFO)


def warning(s):
    log(s, begin=WARNING)


def success(s):
    log(s, begin=SUCCESS)

def get_login_credentials(username, target):
    info('Getting login credentials for {}...'.format(target))
    user_info_path = os.path.join(db_path, 'users/{}.json'.format(username))
    with open(user_info_path, 'r', encoding='utf-8') as user_info_file:
        user_info_json = json.load(user_info_file)
        uname, pwd = user_info_json['accounts'][target + '_uname'], user_info_json['accounts'][target + '_pwd']
        log(uname, pwd)
        return uname, pwd
