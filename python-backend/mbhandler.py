# Provides the handling function for the ManageBac webpage

import handler as hd
from utility import (
    error,
    managebac_dir,
    info,
    success,
    init_log
)
import os

base_url = "https://shsid.managebac.cn/"
login_url = "https://shsid.managebac.cn/login"
req_url = "https://shsid.managebac.cn/student/tasks_and_deadlines"


class MBHandler:
    def __init__(self):
        info("Setting MB Handler...")
        self.driver = hd.init_driver()

    def run(self, username: str):
        info("Loading login page...")

        hd.login(
            username, "mb", self.driver, login_url, "session_login", "session_password",
        )

        info("Loading MB tasks...")
        ann_list = hd.get_targets(self.driver, req_url, ".short-assignment.flex")
        ann_filtered = []
        info("Filtering announcements...")
        for ann in ann_list:
            link = ann.select("a")[0]
            link["onclick"] = "window.open('{}')".format(
                "https://shsid.managebac.cn" + link["href"]
            )
            link["href"] = ""

            content = ""
            for ch in ann.children:
                content += str(ch)

            ann_filtered.append(content)

        info("Buffering MB announcements...")
        hd.write_buf(ann_filtered, os.path.join(managebac_dir, username))
        success("Buffered MB announcements")

    def read_buf(self, username, page):
        buf_dir = os.path.join(managebac_dir, username)
        buffer = hd.get_buf(buf_dir, page)

        return buffer

    def get_info(self):
        mb_info = {
            "base_url": base_url,
            "original_url": req_url
        }
        return mb_info

# init_log()
# crawler = MBHandler()
# crawler.run('zyd')
