# Provides the handling function for the Kognity webpage

from utility import info, success
import handler as hd
import os
from utility import kog_dir, info, success, init_log, log

base_url = "https://app.kognity.com"
login_url = "https://app.kognity.com"
req_url = "https://app.kognity.com/study/app/dashboard"


class KogHandler:
    def __init__(self) -> None:
        info("Setting Kog Handler")
        self.driver = hd.init_driver()

    def run(self, username: str):
        info("Loading login page...")

        hd.login(
            username,
            "kog",
            self.driver,
            login_url,
            "email",
            "password",
            "document.getElementsByClassName('LoginCard-loginButton KogButton KogButton--primary margin-top-l')[0].click()",
        )

        info("Loading Kog Assignments")
        assignments = hd.get_targets(
            self.driver, req_url, ".KogAssignmentList-assignment.padd-m"
        )

        assignments_filtered = []
        info("Filtering Kog assignments...")
        for assignment in assignments[:10]:
            link = assignment.select("a")[0]
            link["onclick"] = "window.open('{}')".format(base_url + link["href"])
            link["href"] = ""
            
            icons = assignment.select('.far')
            for icon in icons:
                icon['class'] = ['fa' if ident == 'far' else ident for ident in icon['class']]

            icons = assignment.select('.fa-pencil-alt')
            for icon in icons:
                icon['class'] = ['fa-pencil' if ident == 'fa-pencil-alt' else ident for ident in icon['class']]

            content = ""
            for ch in assignment.children:
                content += str(ch)

            assignments_filtered.append(content)

        info("Buffering Kog Assignments")
        hd.write_buf(assignments_filtered, os.path.join(kog_dir, username))
        success("Buffered Kog Assignments")

    def read_buf(self, username, page):
        buf_dir = os.path.join(kog_dir, username)
        buffer = hd.get_buf(buf_dir, page)
        return buffer

    def get_info(self):
        kog_info = {
            "base_url": base_url,
            "original_url": req_url,
        }
        return kog_info


# init_log()
# crawler = KogHandler()
# crawler.run("zyd")

