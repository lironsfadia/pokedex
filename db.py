import json
import os
import time

QUERY_EXECUTION_TIME = 2  # 🚨 SENSITIVE DO NOT CHANGE OR OUR ENTIRE DATABASE WILL BURN 🚨
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "pokemon_db.json"))


def get():
    time.sleep(QUERY_EXECUTION_TIME)
    with open(DB_PATH, "rb") as f:
        data = f.read()
        return json.loads(data)
