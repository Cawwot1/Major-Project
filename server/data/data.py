from data.database import db

sessions = db["sessions"]

def store_session_token(token, email):
    # Save or update session token linked to email
    sessions.update_one(
        {"email": email},
        {"$set": {"session_token": token}},
        upsert=True
    )

def get_email_from_token(token):

    print(f"\nToken Storage")
    for doc in sessions.find():
        print(f"{doc}\n")

    # Find email by session token
    session = sessions.find_one({"session_token": token})
    if session:
        return session.get("email")
    return None

def store_chat_history(token, chat_history):
    # Save or update chat history linked to session token
    sessions.update_one(
        {"session_token": token},
        {"$set": {"chat_history": chat_history}},
        upsert=True
    )

def get_chat_history(token):
    session = sessions.find_one({"session_token": token})
    if session and "chat_history" in session:
        return session["chat_history"]
    return []

def delete_session_token(token):
    # Remove session by token (e.g., on logout)
    sessions.delete_one({"session_token": token})