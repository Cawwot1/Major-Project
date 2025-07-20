from markupsafe import escape #XSS sanitisation
from flask import Flask, request, make_response, session
from flask_cors import CORS
from api.authentication import *
from api.WG_API import *
from data.data import *
import google.generativeai as genai

app = Flask(__name__)
CORS(app, supports_credentials=True, expose_headers=["X-Csrf-Token"])  # Enable cross-origin requests (React runs on a different port)
app.secret_key = 'your-secret-key'

genai.configure(api_key="AIzaSyAhvn5SuzIQVz9QoVGzuYH8FTJ4ofKorUo")

#HOME PAGE
@app.route('/')
def index():
    return make_response({"message": "API is running"}), 200

#Chatbot API
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    prompt = str(escape(data.get("message", "")))

    print(f"CHATBOT PROMPT: {prompt}")
    print(session['chat-history'])

    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)

    session['chat-history'].append(prompt)
    session['chat-history'].append(response.text)  # Used .text, not full object

    print(session['chat-history'])

    return make_response({"response": response.text})

@app.route("/chat-history", methods=["POST", "GET"])
def chat_history():
    history = session.get("chat-history", [])
    return make_response({"response": history})

@app.route('/player-search', methods=["GET"])
def player_search():
    nickname = escape(request.args.get('nickname'))
    csrf_token = request.headers.get('csrfToken') #No need to escape csrf token (since it is not being run only compared)
    session_token = request.cookies.get('session_token')

    # Validate CSRF token first
    if csrf_token != session.get("csrf-token"):
        print("Invalid CSRF Token")
        return make_response({'error': 'Given CSRF Token does not match stored token'}), 400

    # Validate session token
    if not session_token:
        return make_response({'error': 'No session token provided'}), 401

    email = get_email_from_token(session_token)

    if not email:
        return make_response({'error': 'Invalid or expired session token'}), 401

    if not nickname:
        return make_response({'error': 'No nickname provided'}), 400

    user_data = player_searcher(nickname)

    print(user_data)

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

    print("login recieved")

    success, csrf_token, session_token = auth_login(email, password)

    if success: #If the login is sucessfull

        session['chat-history'] = ["Chat History"]#CHANGE LATER

        response = make_response({"success": True})
        response.headers["X-Csrf-Token"] = csrf_token
        response.set_cookie('session_token', session_token, httponly=True, secure=False, samesite='Lax') #Attaches the cookie to the response

        session["csrf-token"] = csrf_token #CSRF Token into local storage (unique per user)

        return response

    else:
        return make_response({"success": False, "error": "Invalid credentials"}), 401

@app.route('/signup', methods=["POST"])
def signup():
    data = request.get_json()
    username = escape(data.get("username"))
    password = escape(data.get("password"))
    email = escape(data.get("email"))

    sucess, csrf_token, session_token = create_account(email, username, password)

    if sucess:
    
        csrf_token = generate_csrf_token()
        response = make_response({"success": True})

        response.headers["X-Csrf-Token"] = csrf_token
        response.set_cookie('session_token', session_token, httponly=True, secure=False, samesite='Lax') #Attaches the cookie to the response
        
        session["csrf-token"] = csrf_token #CSRF Token into local storage (unique per user)

        return response

    return make_response({"success": False, "error": "Account creation failed"}), 400

@app.route('/stats', methods=["GET"])
def stats():
    # Return stats data as JSON
    return make_response({"message": "Stats endpoint - provide logic here"})

#Universal Error Handler
from werkzeug.exceptions import HTTPException

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    """Return JSON for all HTTP errors."""
    response = e.get_response()
    response.data = make_response({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    }).data
    response.content_type = "application/json"
    return response

if __name__ == "__main__":
    app.run(port=5050, debug=True)