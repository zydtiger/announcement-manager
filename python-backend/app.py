from handler import update
from koghandler import KogHandler
from portalhandler import PortalHandler
from bbhandler import BBHandler
from mbhandler import MBHandler
from utility import (
    log,
    port,
    init_log,
    bb_dir,
    portal_dir,
    kog_dir,
    managebac_dir,
    proj_root,
)
from flask import Flask
import time
import threading
import os
import json

init_log()

bbcrawler = BBHandler()
portal_crawler = PortalHandler()
mb_crawler = MBHandler()
kog_crawler = KogHandler()

# init flask
app = Flask(__name__)


@app.route("/sync/<target>/<username>")
def sync(target, username):
    if target == "bb":
        bbcrawler.run(username)
    elif target == "portal":
        portal_crawler.run(username)
    elif target == "managebac":
        mb_crawler.run(username)
    elif target == "kognity":
        kog_crawler.run(username)
    return "done"


@app.route("/buf/<string:target>/<string:username>/<int:page>")
def buf(target, username, page):
    if target == "bb":
        return bbcrawler.read_buf(username, page)
    elif target == "portal":
        return portal_crawler.read_buf(username, page)
    elif target == "managebac":
        return mb_crawler.read_buf(username, page)
    elif target == "kognity":
        return kog_crawler.read_buf(username, page)


@app.route("/get_info/<target>/<username>")
def get_info(target, username):
    if target == "bb":
        return bbcrawler.get_info()
    elif target == "portal":
        return portal_crawler.get_info(username)
    elif target == "managebac":
        return mb_crawler.get_info()
    elif target == "kognity":
        return kog_crawler.get_info()


def hourly_update():
    while True:
        minute = time.strftime("%M")
        if minute == "00":
            update(bb_dir, "bb", bbcrawler)
            update(portal_dir, "portal", portal_crawler)
            update(kog_dir, "kog", kog_crawler)
            update(managebac_dir, "mb", mb_crawler)

        time.sleep(60)


if __name__ == "__main__":
    upt = threading.Thread(target=hourly_update)
    upt.start()

    with open(
        os.path.join(proj_root, "config.json"), "r", encoding="utf-8"
    ) as config_file:
        config_json = json.load(config_file)
        port = config_json["flask"]["port"]
        app.run(host="0.0.0.0", port=port)

# 0.0.0.0 open to inet
# 127.0.0.1 localhost
