# Provides the handling function for the BB webpage

import threading
from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
import requests
import json
from utility import error, headers, bb_dir, init_log, log, info, success, db_path, get_login_credentials, chromedriver_path
import os
import handler as hd


base_url = "https://shs.blackboardchina.cn/"
login_url = "https://shs.blackboardchina.cn/"
req_url = "https://shs.blackboardchina.cn/webapps/blackboard/execute/announcement?method=search&context=mybb&handle=my_announcements&returnUrl=/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1&tabId=_1_1&forwardUrl=index.jsp"


class BBHandler:
    def __init__(self):
        info('Setting BB Handler...')
        self.driver = hd.init_driver()

    def run(self, username):
        info('Loading login page...')

        hd.login(
            username,
            'bb',
            self.driver,
            login_url,
            'user_id',
            'password',
        )

        info('Loading BB announcements...')
        ann_list = hd.get_targets(self.driver, req_url, "#announcementList > li")
        ann_filtered = []
        info('Filtering announcements...')
        for ann in ann_list:
            imgs = ann.select('img')
            for img in imgs:
                img_src = img["src"]
                if img_src.startswith('blob:'):
                    continue
                img_name = img_src[len("https://shs.blackboardchina.cn/") :].replace(
                    "/", "_"
                )
                self.buf_img(img_src, img_name)
                img["src"] = "/buffer/bb/{}.jpg".format(img_name)

            content = ""
            for ch in ann.children:
                content += str(ch)

            ann_filtered.append(content)
        
        info('Buffering BB announcements...')
        hd.write_buf(ann_filtered, os.path.join(bb_dir, username))
        success('Buffered BB announcements')

    def buf_img(self, img_src: str, img_name: str):
        cookies = {}
        for cookie in self.driver.get_cookies():
            cookies[cookie["name"]] = cookie["value"]

        img_url = img_src.replace("https", "http")

        img_path = os.path.join(bb_dir, img_name + ".jpg")
        if not os.path.exists(img_path):
            info('Buffering image: {}'.format(img_name))
            img = requests.get(img_url, headers=headers, cookies=cookies)
            with open(img_path, "wb") as img_buf:
                img_buf.write(img.content)

    def read_buf(self, username, page):
        buf_dir = os.path.join(bb_dir, username)
        buffer = hd.get_buf(buf_dir, page)

        return buffer

    def get_info(self):
        bb_info = {
            "base_url": base_url,
            "original_url": req_url
        }
        return bb_info

# init_log()
# bb_crawler = BBHandler()
# bb_crawler.run('zyd')