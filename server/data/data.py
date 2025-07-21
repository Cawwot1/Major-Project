from data.database import db
from api.authentication import *

sessions = db["sessions"]
favourites = db["favourites"]

def store_session_token(token, email):
    sessions.update_one(
        {"email": email},
        {"$set": {"session_token": token}},
        upsert=True
    )

def get_email_from_token(token):
    print(f"\nToken Storage")
    for doc in sessions.find():
        print(f"{doc}\n")

    session = sessions.find_one({"session_token": token})
    return session.get("email") if session else None

def store_chat_history(token, chat_history):
    sessions.update_one(
        {"session_token": token},
        {"$set": {"chat_history": chat_history}},
        upsert=True
    )

def get_chat_history(token):
    session = sessions.find_one({"session_token": token})
    return session.get("chat_history", []) if session else []

def delete_session_token(token):
    sessions.delete_one({"session_token": token})

def store_favourite(email, favourite_username, is_favourited):
    if is_favourited:
        favourites.update_one(
            {"email": email, "username": favourite_username},
            {"$set": {"email": email, "username": favourite_username}},
            upsert=True
        )
    else:
        favourites.delete_one({"email": email, "username": favourite_username})

def remove_all_favourites(email):
    """
    Remove all favourite entries for the given user email.
    Ensures only one favourite can exist at a time.
    """
    favourites.delete_many({"email": email})


def remove_favourite(email, favourite_username):
    """
    Remove a specific favourite username for the given user email.
    """
    favourites.delete_one({"email": email, "username": favourite_username})
