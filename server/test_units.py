import pytest
from unittest.mock import patch
import bcrypt

import api.authentication as auth
import data.data as session_mgmt  # Assuming this is your second file's module name

from app import app  # Or whatever your main Flask app filename/module is
from markupsafe import escape

#XSS Testing
@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_xss_input_sanitised(client):
    # Fake session and CSRF setup
    token_cookie = "fake-session-token"
    xss_payload = '<script>alert("XSS")</script>'
    expected_sanitised = escape(xss_payload)

    # Stub session/token lookup functions if needed
    # e.g., monkeypatch get_email_from_token to always return a dummy email

    # Store empty history or bypass that logic if needed
    response = client.post(
        "/chat",
        json={"message": xss_payload},
        headers={"Content-Type": "application/json"},
        cookies={"session_token": token_cookie}
    )

    # Ensure the dangerous script tags don’t appear in raw form
    assert xss_payload not in response.get_data(as_text=True)
    assert expected_sanitised in response.get_data(as_text=True)


@pytest.fixture(autouse=True)
def clear_session(monkeypatch):
    # Mock Flask session dictionary for CSRF token tests
    monkeypatch.setattr(auth, "session", {})

"""
authentication.py tests
"""

def test_input_validation_valid():
    # Test that valid username, email, and password pass validation without errors
    auth.input_validation(
        password="StrongP4ssword1",
        username="valid_user-name.123",
        email="test@example.com"
    )

def test_input_validation_invalid_email():
    # Test validation fails with invalid email format
    with pytest.raises(Exception) as e:
        auth.input_validation("StrongP4ssword1", "validusername", "bad-email")
    assert "Invalid email format" in str(e.value)

def test_input_validation_invalid_password():
    # Test validation fails with weak/short password
    with pytest.raises(Exception) as e:
        auth.input_validation("weakpass", "validusername", "test@example.com")
    assert "Password must be 8-40 characters" in str(e.value)

def test_input_validation_invalid_username():
    # Test validation fails if username contains invalid characters
    with pytest.raises(Exception) as e:
        auth.input_validation("StrongP4ssword1", "invalid username!", "test@example.com")
    assert "Contains no special characters" in str(e.value)

def test_hash_and_verify_password():
    # Test password hashing returns string and verifies correctly with bcrypt
    password = "StrongP4ssword1"
    hashed = auth.hash_password(password)
    assert isinstance(hashed, str)
    assert bcrypt.checkpw(password.encode(), hashed.encode())

def test_password_verify_true_false():
    # Test password_verify returns True for correct password, False otherwise
    password = "StrongP4ssword1"
    hashed = auth.hash_password(password)
    assert auth.password_verify(password.encode(), hashed.encode()) is True
    assert auth.password_verify("WrongPass".encode(), hashed.encode()) is False

@patch("api.authentication.users")
def test_create_account_success(mock_users):
    # Test account creation succeeds when no duplicate email or username found
    mock_users.find_one.side_effect = [None, None]
    mock_users.insert_one.return_value = None

    with patch("api.authentication.generate_session_token", return_value="sessiontoken123"), \
         patch("api.authentication.generate_csrf_token", return_value="csrftoken456"), \
         patch("api.authentication.store_session_token") as mock_store_session:

        result = auth.create_account("TEST@Example.com", "testuser", "StrongP4ssword1")
        assert result == (True, "csrftoken456", "sessiontoken123")
        mock_store_session.assert_called_once_with("sessiontoken123", "test@example.com")

@patch("api.authentication.users")
def test_create_account_email_exists(mock_users):
    # Test account creation raises error if email already registered
    mock_users.find_one.side_effect = [{"email": "test@example.com"}, None]
    with pytest.raises(Exception) as e:
        auth.create_account("test@example.com", "testuser", "StrongP4ssword1")
    assert "Email has already been registered" in str(e.value)

@patch("api.authentication.users")
def test_create_account_username_exists(mock_users):
    # Test account creation raises error if username already taken
    mock_users.find_one.side_effect = [None, {"username": "testuser"}]
    with pytest.raises(Exception) as e:
        auth.create_account("test2@example.com", "testuser", "StrongP4ssword1")
    assert "Username has already been taken" in str(e.value)

@patch("api.authentication.users")
def test_auth_login_success(mock_users):
    # Test successful login returns correct session and CSRF tokens
    hashed_pw = auth.hash_password("StrongP4ssword1")
    mock_users.find_one.return_value = {"email": "test@example.com", "password": hashed_pw}

    with patch("api.authentication.generate_session_token", return_value="sessiontoken123"), \
         patch("api.authentication.generate_csrf_token", return_value="csrftoken456"), \
         patch("api.authentication.store_session_token") as mock_store_session:

        success, csrf, session = auth.auth_login("test@example.com", "StrongP4ssword1")
        assert success is True
        assert csrf == "csrftoken456"
        assert session == "sessiontoken123"
        mock_store_session.assert_called_once_with("sessiontoken123", "test@example.com")

@patch("api.authentication.users")
def test_auth_login_bad_password(mock_users):
    # Test login fails with incorrect password
    hashed_pw = auth.hash_password("StrongP4ssword1")
    mock_users.find_one.return_value = {"email": "test@example.com", "password": hashed_pw}

    with pytest.raises(Exception) as e:
        auth.auth_login("test@example.com", "WrongPass123")
    assert "Password Incorrect" in str(e.value)

@patch("api.authentication.users")
def test_auth_login_no_user(mock_users):
    # Test login fails if user does not exist
    mock_users.find_one.return_value = None
    with pytest.raises(Exception) as e:
        auth.auth_login("notexist@example.com", "StrongP4ssword1")
    assert "User does not exist" in str(e.value)

@patch("api.authentication.users")
def test_change_user_password_success(mock_users):
    # Test password change succeeds for existing user
    mock_users.find_one.return_value = {"email": "test@example.com"}
    mock_users.update_one.return_value = None

    result = auth.change_user_password("test@example.com", "NewStrongP4ssword")
    assert result is True
    mock_users.update_one.assert_called_once()

@patch("api.authentication.users")
def test_change_user_password_bad_password(mock_users):
    # Test password change fails if new password is invalid
    with pytest.raises(Exception) as e:
        auth.change_user_password("test@example.com", "weakpass")
    assert "Password must be 8-40 characters" in str(e.value)

@patch("api.authentication.users")
def test_change_user_password_no_user(mock_users):
    # Test password change fails if user email not found
    mock_users.find_one.return_value = None
    with pytest.raises(Exception) as e:
        auth.change_user_password("notfound@example.com", "NewStrongP4ssword")
    assert "User with this email does not exist" in str(e.value)

@patch("api.authentication.users")
def test_verify_username_with_email_true_false(mock_users):
    # Test username verification against email returns True if match, False if not found or mismatch
    mock_users.find_one.return_value = {"username": "testuser"}
    assert auth.verify_username_with_email("test@example.com", "testuser") is True
    assert auth.verify_username_with_email("test@example.com", "wronguser") is False

    mock_users.find_one.return_value = None
    assert auth.verify_username_with_email("notfound@example.com", "anyuser") is False


"""
session_management.py tests
"""

@patch("data.data.sessions")
def test_store_session_token(mock_sessions):
    # Test storing a session token updates database correctly
    session_mgmt.store_session_token("token123", "test@example.com")
    mock_sessions.update_one.assert_called_once_with(
        {"email": "test@example.com"},
        {"$set": {"session_token": "token123"}},
        upsert=True
    )

@patch("data.data.sessions")
def test_get_email_from_token_found(mock_sessions):
    # Test retrieving email from existing session token returns correct email
    mock_sessions.find_one.return_value = {"email": "test@example.com", "session_token": "token123"}
    email = session_mgmt.get_email_from_token("token123")
    assert email == "test@example.com"

@patch("data.data.sessions")
def test_get_email_from_token_not_found(mock_sessions):
    # Test retrieving email from nonexistent token returns None
    mock_sessions.find_one.return_value = None
    email = session_mgmt.get_email_from_token("badtoken")
    assert email is None

@patch("data.data.sessions")
def test_store_chat_history(mock_sessions):
    # Test storing chat history for session token updates database correctly
    session_mgmt.store_chat_history("token123", ["Hello", "World"])
    mock_sessions.update_one.assert_called_once_with(
        {"session_token": "token123"},
        {"$set": {"chat_history": ["Hello", "World"]}},
        upsert=True
    )

@patch("data.data.sessions")
def test_get_chat_history_found(mock_sessions):
    # Test retrieving existing chat history returns correct list of messages
    mock_sessions.find_one.return_value = {"chat_history": ["msg1", "msg2"]}
    history = session_mgmt.get_chat_history("token123")
    assert history == ["msg1", "msg2"]

@patch("data.data.sessions")
def test_get_chat_history_empty(mock_sessions):
    # Test retrieving chat history when none exists returns empty list
    mock_sessions.find_one.return_value = {}
    history = session_mgmt.get_chat_history("token123")
    assert history == []

@patch("data.data.sessions")
def test_delete_session_token(mock_sessions):
    # Test deleting session token calls delete on database
    session_mgmt.delete_session_token("token123")
    mock_sessions.delete_one.assert_called_once_with({"session_token": "token123"})

@patch("data.data.favourites")
def test_store_favourite_upsert(mock_favourites):
    # Test adding a favourite updates or inserts record in favourites collection
    session_mgmt.store_favourite("email@test.com", "favuser", True)
    mock_favourites.update_one.assert_called_once_with(
        {"email": "email@test.com", "username": "favuser"},
        {"$set": {"email": "email@test.com", "username": "favuser"}},
        upsert=True
    )

@patch("data.data.favourites")
def test_store_favourite_delete(mock_favourites):
    # Test removing a favourite deletes record from favourites collection
    session_mgmt.store_favourite("email@test.com", "favuser", False)
    mock_favourites.delete_one.assert_called_once_with({"email": "email@test.com", "username": "favuser"})

@patch("data.data.sessions")
def test_get_email_from_invalid_cookie(mock_sessions):
    # Simulate no matching session found for the invalid token
    mock_sessions.find_one.return_value = None

    # Call the function with an invalid token
    result = session_mgmt.get_email_from_token("invalidtoken123")

    # Expect None when token is not found
    assert result is None
