from database import db
from flask import *
import re
import bcrypt #Ecnryption

# Collections
users = db["users"]

# Input validation patterns
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')  # Email format validation
USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_.-]{3,40}$')  # Username validation (3-40 alphanumeric and allowed symbols)
PASSWORD_PATTERN = re.compile(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_]{8,40}$')  # Password validation (length, letter, digit, special char)

def create_account(email, username, password):
    
    email = email.lower() # Normalize email to lowercase -> Capital Letters don't matter

    input_validation(password, username, email) #Input validation -> errors if anything occurs

    existing_user = users.find_one({"email": email})
    existing_name = users.find_one({"username": username})

    if existing_user:
        abort(400, description="existing account (email)")
    elif existing_name:
        abort(400, description="existing account (name)")
    else:

        password = hash_password(password)

        users.insert_one({
            "email": email,
            "username": username,
            "password": password  # HASHED
        })
        return True
    
def login(username, password):
    existing_user = users.find_one({"username": username})
    if existing_user:
        stored_hash = existing_user.get("password")
        if stored_hash and bcrypt.checkpw(password.encode(), stored_hash.encode()):
            return True
        else:
            abort(400, description="Password Incorrect")
    else:
        abort(400, description="User does not exist")

def hash_password(password):

    # Generate a salt and hash the password
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    # Store the hashed password (in your database, for example)
    return hashed_password

def password_verify(entered_password, hashed_password):

    # Compare entered password with stored hash
    if bcrypt.checkpw(entered_password, hashed_password):
        return True
    else:
        return False


def input_validation(password, username, email):

    if email in users:  # Check if the email is already in use
        abort(400, description="Email already exists")

    if not EMAIL_PATTERN.match(email):  # Validate email format
        abort(400, description="Invalid email format (valid example: username@example.com)")
    
    if not PASSWORD_PATTERN.match(password):  # Validate password format
        abort(400, description="Password must be 8-40 characters, include at least one letter, one number")
    
    if not USERNAME_PATTERN.match(username):  # Validate first name format
        abort(400, description="Contains no special characters except . or _ or -")

    # Create and store the new user in the database

#Planning
#1 password input
#2 input validation