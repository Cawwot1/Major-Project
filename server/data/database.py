from pymongo import MongoClient

# Local MongoDB (default port)
client = MongoClient("mongodb://localhost:27017/")

db = client["mydatabase"] #database creation

app = db["mycollection"]