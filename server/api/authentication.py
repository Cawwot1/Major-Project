from data.database import db
from data.data import *
from flask import *
import re
import bcrypt #Ecnryption
import secrets
import base64

# Collections
users = db["users"]

# Input validation patterns
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$')
USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_.-]{3,40}$')  # Username validation (3-40 alphanumeric and allowed symbols)
PASSWORD_PATTERN = re.compile(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_.]{8,40}$')

def create_account(email, username, password):

    email = email.lower() # Normalize email to lowercase -> Capital Letters don't matter

    input_validation(password, username, email) #Input validation -> errors if anything occurs

    existing_user = users.find_one({"email": email})

    if existing_user:
        print("existing account (email)")
        abort(400, description="Email has already been registered")
    elif users.find_one({"username": username}):
        abort(400, description="Username has already been taken")
    else:

        password = hash_password(password)

        users.insert_one({
            "email": email,
            "username": username,
            "password": password  # HASHED
        })

        session_token = generate_session_token()
        store_session_token(session_token, email)

        return True, generate_csrf_token(), session_token
    
def auth_login(email, password):
    existing_user = users.find_one({"email": email.lower()})
    if existing_user:
        stored_hash = existing_user.get("password")
        if stored_hash and bcrypt.checkpw(password.encode(), stored_hash.encode()):

            session_token = generate_session_token()
            store_session_token(session_token, email)
            
            return True, generate_csrf_token(), session_token #Returns generated Tokens
        else:
            abort(400, description="Password Incorrect")
    else:
        abort(400, description="User does not exist")

def hash_password(password):

    # Generate a salt and hash the password
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    # Store the hashed password (in your database, for example)
    return hashed_password

def password_verify(entered_password, hashed_password):

    # Compare entered password with stored hash
    if bcrypt.checkpw(entered_password, hashed_password):
        return True
    else:
        return False


def input_validation(password, username, email):

    print(email)

    if not EMAIL_PATTERN.match(email):  # Validate email format
        print("Email not right")
        abort(400, description="Invalid email format (valid example: username@example.com)")

    if not PASSWORD_PATTERN.match(password):  # Validate password format
        print("Password not right")
        abort(400, description="Password must be 8-40 characters, include at least one letter, one number")

    if not USERNAME_PATTERN.match(username):  # Validate first name format
        print("Username not right")
        abort(400, description="Contains no special characters except . or _ or -")

    # Create and store the new user in the database

def generate_csrf_token():
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()

def generate_session_token():
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()

def verify_username_with_email(email, username):
    email = email.lower()  # Normalise email
    user = users.find_one({"email": email})

    if user:
        return user.get("username") == username
    return False

def change_user_password(email, new_password):
    email = email.lower()  # Normalize email

    # Validate password
    if not PASSWORD_PATTERN.match(new_password):
        abort(400, description="Password must be 8-40 characters, include at least one uppercase letter and one number")

    # Find the user
    user = users.find_one({"email": email})
    if not user:
        abort(400, description="User with this email does not exist")

    # Hash the new password
    hashed = hash_password(new_password)

    # Update the password in the database
    users.update_one({"email": email}, {"$set": {"password": hashed}})

    return True

#CSRF MANAGEMENT
def store_csrf_token(csrf_token):
    session["csrf-token"] = csrf_token

def get_csrf_token():
    return session.get("csrf-token")

def verify_csrf_token(csrf_token_from_request):
    stored_token = get_csrf_token()
    return csrf_token_from_request == stored_token

# Print every document in the collection
for doc in users.find():
    print(doc)


