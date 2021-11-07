from posixpath import expanduser
from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
import json
import utility as ut
import time
import os
from bs4.element import ResultSet, Tag


def init_driver():
    opt = Options()

    opt.add_argument("blink-settings=imagesEnabled=false")
    opt.add_argument("--headless")
    opt.add_argument("--disable-gpu")
    opt.add_argument('--ignore-certificate-errors')

    return webdriver.Chrome(executable_path=ut.chromedriver_path(), options=opt)


def login(
    username: str,
    name: str,
    driver: webdriver.Chrome,
    login_url: str,
    uname_sel: str,
    pwd_sel: str,
    form_submit: str = "document.getElementsByTagName('form')[0].submit()",
):
    driver.get(login_url)
    page_src = BeautifulSoup(driver.page_source, "html.parser")
    uname_input = page_src.select("#" + uname_sel)

    if len(uname_input) > 0:
        ut.info("Processing {} login...".format(name))

        uname, pwd = ut.get_login_credentials(username, name)

        driver.execute_script('''
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true, true);
            document.getElementById('{uname_sel}').value = '{uname}';
            document.getElementById('{uname_sel}').dispatchEvent(evt);
            document.getElementById('{pwd_sel}').value = '{pwd}';
            document.getElementById('{pwd_sel}').dispatchEvent(evt);
            '''.format(uname_sel=uname_sel, uname=uname, pwd_sel=pwd_sel, pwd=pwd)
        )
        driver.execute_script(form_submit)

    time.sleep(20)


def get_targets(
    driver: webdriver.Chrome, url: str, target_name: str, delay: int = 0,
):
    driver.get(url)
    time.sleep(delay)
    page_src = BeautifulSoup(driver.page_source, "html.parser")
    return page_src.select(target_name)


def to_string(news_list):
    news_filtered = []
    ut.info("Filtering news...")
    for new in news_list:
        content = ""
        for ch in new.children:
            content += str(ch)
        news_filtered.append(content)

    return news_filtered


def write_buf(obj, buf_dir: str):
    if not os.path.exists(buf_dir):
        os.makedirs(buf_dir)

    with open(os.path.join(buf_dir, "cache.json"), "w", encoding="utf-8") as cache_file:
        json.dump(obj, cache_file)


def get_raw_buf(buf_dir: str):
    with open(os.path.join(buf_dir, "cache.json"), "r", encoding="utf-8") as cache_file:
        return json.load(cache_file)

def get_buf(buf_dir: str, page: int):
    news_list = get_raw_buf(buf_dir)
    max_len = len(news_list)
    buf_info = {}
    if page > max_len:
        buf_info = {"head": "stop", "body": "Reached Bottom. Don't Scroll More"}
    else:
        buf_info = {"head": "new", "body": news_list[page : min(page + 10, max_len)]}
    return buf_info

def update(buf_dir: str, name: str, crawler):
    if not os.path.exists(buf_dir):
        os.makedirs(buf_dir)
        return
    
    ut.info('Updating {}'.format(name))

    if name == 'portal':
        try:
            crawler.run('zyd')
        except:
            ut.error('Updating {} failed'.format(name))
            return
    else:
        files = os.listdir(buf_dir)
        for file in files:
            if os.path.isdir(os.path.join(buf_dir, file)):
                try:
                    crawler.run(file)
                except:
                    ut.error('Updating {}:{} failed'.format(name, file))
                    continue
    
