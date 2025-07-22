from markupsafe import escape  # XSS sanitisation
from flask import Flask, request, make_response, session, jsonify
from flask_cors import CORS
from api.authentication import *
from api.WG_API import *
from data.data import *
import google.generativeai as genai
from werkzeug.exceptions import BadRequest, HTTPException
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, expose_headers=["X-Csrf-Token"])
app.secret_key = os.getenv("SECRET_KEY", "fallback-key-for-dev")


genai.configure(api_key="AIzaSyAhvn5SuzIQVz9QoVGzuYH8FTJ4ofKorUo")

# --- Routes ---
@app.after_request
def modify_response_headers(response: Response):
    #Remove 'Server' header if present
    if 'Server' in response.headers:
        del response.headers['Server']
    
    #Set security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    
    return response
@app.route('/')
def index():
    return make_response({"message": "API is running"}), 200  #  Simple health check route

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = str(escape(data.get("message", "")))  #  Get and sanitise user message

    session_token = request.cookies.get("session_token")
    if not session_token:
        return make_response({"error": "No session token provided"}, 401)  #  Require login

    chat_history = get_chat_history(session_token)  #  Load previous chat history

    model = genai.GenerativeModel("gemini-2.0-flash")  #  Gemini AI model
    response = model.generate_content(prompt)  #  Get model's response to prompt

    #  Save user and AI responses
    chat_history.append({"role": "user", "content": prompt})
    chat_history.append({"role": "assistant", "content": response.text})
    store_chat_history(session_token, chat_history)

    return make_response({"response": response.text})

@app.route("/chat-history", methods=["GET", "POST"])
def chat_history():
    session_token = request.cookies.get("session_token")
    if not session_token:
        return make_response({"error": "No session token provided"}, 401)

    history = get_chat_history(session_token)  #  Return all chat messages
    return make_response({"response": history})

@app.route('/player-search', methods=["GET"])
def player_search():
    nickname = escape(request.args.get('nickname'))  #  Get and sanitise username
    csrf_token = request.headers.get('csrfToken')
    session_token = request.cookies.get('session_token')

    #  Check CSRF token
    if not verify_csrf_token(csrf_token):
        return make_response({'error': 'Given CSRF Token does not match stored token'}), 400

    if not session_token:
        return make_response({'error': 'No session token provided'}), 401

    email = get_email_from_token(session_token)
    if not email:
        return make_response({'error': 'Invalid or expired session token'}), 401

    if not nickname:
        return make_response({'error': 'No nickname provided'}), 400

    user_data = player_searcher(nickname)  #  Call WG API searcher

    if len(user_data) == 1:
        user_id, user_info = next(iter(user_data.items()))
        server = user_info.get("server")
        name = user_info.get("name")
        player_data_res = player_data(user_id, server)

        return make_response({
            "name": name,
            "data": player_data_res
        })
    else:
        return make_response({
            "name": "player not found",
            "data": "nothing"
        })

@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    email = escape(data.get("email"))
    password = escape(data.get("password"))

    success, csrf_token, session_token = auth_login(email, password)

    if success:
        store_chat_history(session_token, [])  # Initialise empty chat history

        # Check if user has a favourite username saved
        favourite_entry = favourites.find_one({"email": email})
        favourite_username = favourite_entry.get("username") if favourite_entry else None

        response_data = {"success": True}
        if favourite_username:
            response_data["favouriteUsername"] = favourite_username  # Include favourite if exists

        response = make_response(response_data)
        response.headers["X-Csrf-Token"] = csrf_token
        # Set session cookie and store CSRF token in session
        response.set_cookie('session_token', session_token, httponly=True, secure=False, samesite='Lax')
        store_csrf_token(csrf_token)

        return response
    else:
        return make_response({"success": False, "error": "Invalid credentials"}, 401)

@app.route('/signup', methods=["POST"])
def signup():
    data = request.get_json()
    username = escape(data.get("username"))
    password = escape(data.get("password"))
    email = escape(data.get("email"))

    success, csrf_token, session_token = create_account(email, username, password)

    if success:
        csrf_token = generate_csrf_token()  #  Extra CSRF just in case
        response = make_response({"success": True})
        response.headers["X-Csrf-Token"] = csrf_token
        response.set_cookie('session_token', session_token, httponly=True, secure=False, samesite='Lax')
        store_csrf_token(csrf_token)
        return response

    return make_response({"success": False, "error": "Account creation failed"}, 400)

@app.route('/logout', methods=["POST"])
def logout():
    csrf_token = request.headers.get('csrfToken')

    if not csrf_token or csrf_token != session.get("csrf-token"):
        return make_response(jsonify({'error': 'Invalid CSRF token'}), 400)

    session.clear()  #  Clear session memory

    session_token = request.cookies.get("session_token")
    if session_token:
        delete_session_token(session_token)  #  Remove token from backend store

    response = make_response(jsonify({"success": True}))
    response.delete_cookie('session_token', samesite='Strict', secure=True)

    return response

@app.route('/stats', methods=["GET"])
def stats():
    return make_response({"message": "Stats endpoint - provide logic here"})

@app.route('/favourite', methods=["POST"])
def favourite():
    csrf_token = request.headers.get("csrfToken")
    session_token = request.cookies.get("session_token")

    if not csrf_token or csrf_token != session.get("csrf-token"):
        return make_response(jsonify({"error": "Invalid CSRF token"}), 400)

    if not session_token:
        return make_response(jsonify({"error": "Missing session token"}), 401)

    email = get_email_from_token(session_token)
    if not email:
        return make_response(jsonify({"error": "Invalid session token"}), 401)

    try:
        data = request.get_json()
        favourite_username = escape(data.get("favouriteUsername"))
        is_favourited = data.get("isFavourited")

        if not favourite_username:
            return make_response(jsonify({"error": "Missing favourite username"}), 400)

        if is_favourited:
            # First remove any existing favourite for this user
            remove_all_favourites(email)  # You will need to implement this in your data layer
            # Then store the new favourite
            store_favourite(email, favourite_username, True)
        else:
            # If is_favourited is False, just remove any existing favourite matching this username
            remove_favourite(email, favourite_username)  # Also to implement

        return make_response(jsonify({"success": True}), 200)

    except Exception as e:
        print("Favourite route error:", e)
        return make_response(jsonify({"error": "Internal server error"}), 500)

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    username = escape(data.get('forgotUsername'))
    email = escape(data.get('forgotEmail'))

    if not username or not email:
        return jsonify({'error': 'Username and email are required'}), 400
    
    result = verify_username_with_email(email, username)
    if result:
        return make_response(jsonify({"success": True}), 200)
    else:
        return jsonify({'error': 'Wrong username or email'}), 400
    
@app.route('/change-password', methods=['POST'])
def change_password():
    data = request.get_json()
    email = escape(data.get('forgotEmail'))
    new_password = escape(data.get('newPassword'))

    if not new_password:
        return jsonify({'error': 'A new password is required'}), 400

    change_user_password(email, new_password)

    return make_response(jsonify({"success": True}), 200)

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    #  Format errors into JSON
    response = e.get_response()
    response.data = make_response({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    }).data
    response.content_type = "application/json"
    return response

if __name__ == "__main__":
    app.run(port=5050, debug=False)  #  Start dev server on port 5050
