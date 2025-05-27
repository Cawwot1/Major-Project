from pymongo import MongoClient

# Local MongoDB (default port)
client = MongoClient("mongodb://localhost:27017/")

db = client["mydatabase"] #database creation

app = db["mycollection"]  

users = db["users"]
user_profiles = db["user_profiles"]
cache_data = db["cache_data"]
