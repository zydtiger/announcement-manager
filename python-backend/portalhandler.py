# Provides the handling function for the BB webpage

from bs4 import BeautifulSoup
import json

from requests import NullHandler
from utility import (
    error,
    portal_dir,
    info,
    success,
    db_path,
    init_log
)
import os
import time
import threading
import handler as hd

base_url = "https://one.shs.cn/"
login_url = "https://tpass.shs.cn/"
req_url = {
    "chi": "https://one.shs.cn/tp_nup/index.html#contentid=153472&ownerid=1444152287&typeid=&act=sems-tp-nup_002",
    "eng": "https://one.shs.cn/tp_nup/index.html#contentid=154321&ownerid=1477072902&typeid=&act=sems-tp-nup_002",
}


def get_lang_pref(username):
    info("Getting user lang preference...")
    user_info_path = os.path.join(db_path, "users/{}.json".format(username))
    with open(user_info_path, "r", encoding="utf-8") as user_info_file:
        user_info_json = json.load(user_info_file)
        return user_info_json["lang"]["pt"]


class PortalHandler(threading.Thread):
    def __init__(self):
        info("Setting Portal Handler...")
        self.driver = hd.init_driver()

    def run(self, username):
        info("Loading login page...")

        hd.login(
            username,
            "pt",
            self.driver,
            login_url,
            "un",
            "pd",
            "document.getElementById('index_login_btn').click()",
        )

        info("Loading Portal news {}...".format(req_url["chi"]))
        chi_news = hd.to_string(
            hd.get_targets(self.driver, req_url["chi"], "li.contents-details-list-item", 5)
        )

        info("Loading Portal news {}...".format(req_url["eng"]))
        eng_news = hd.to_string(
            hd.get_targets(self.driver, req_url["eng"], "li.contents-details-list-item", 5)
        )

        news_obj = {
            "chi": chi_news,
            "eng": eng_news,
        }

        info("Buffering Portal news...")
        # hd.write_buf(news_obj, os.path.join(portal_dir, username))
        hd.write_buf(news_obj, portal_dir)
        success("Buffered Portal news")

    def read_buf(self, username, page):
        lang_pref = get_lang_pref(username)
        news_json = hd.get_raw_buf(portal_dir)

        buf_info = {}
        max_len = len(news_json[lang_pref])
        if max_len < page:
            buf_info = {"head": "stop", "body": "Reached Bottom. Don't Scroll More"}
        else:
            buf_info = {
                "head": "new",
                "body": news_json[lang_pref][page : min(page + 10, max_len)],
            }

        return buf_info

    def get_info(self, username):
        lang_pref = get_lang_pref(username)
        portal_info = {"base_url": base_url, "original_url": req_url[lang_pref]}
        return json.dumps(portal_info)


# init_log()
# crawler = PortalHandler()
# crawler.run('zyd')
