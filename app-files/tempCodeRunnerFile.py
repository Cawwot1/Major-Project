users = db["users"]

# Print every document in the collection
for doc in users.find():
    print(doc)


"""
username = "testuser"
email = "test@example.com"
password = "Password123"

create_account(email, username, password)
"""