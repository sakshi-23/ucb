# from app import app
from flask import session
from pymongo import MongoClient
from bson.code import Code
from bson.son import SON


class DBUtils:

    def __init__(self):
        pass

    def get_db(self):
        client = MongoClient("mongodb://ucb:ucb@ds133450.mlab.com:33450/ucb")

        return client["ucb"]

    def get_collection_obj(self,collection_name):
        db = self.get_db()
        return db[collection_name]

