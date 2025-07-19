from markupsafe import escape #XSS sanitisation
from flask import Flask, request, jsonify
from flask_cors import CORS
from api.authentication import auth_login, create_account
from api.WG_API import *

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests (React runs on a different port)

@app.route('/')
def index():
    return jsonify({"message": "API is running"}), 200

@app.route('/player-search', methods=["GET"])
def player_search():
    nickname = escape(request.args.get('nickname'))
    if not nickname:
        return jsonify({'error': 'No nickname provided'}), 400

    user_data = player_searcher(nickname)

    print(user_data)

    if len(user_data) == 1:
        user_id, user_info = next(iter(user_data.items()))
        server = escape(user_info.get("server"))
        name = escape(user_info.get("name"))
        player_data_res = player_data(user_id, server)

        return jsonify({
            "name": name,
            "data": player_data_res
        })
    else:
        return jsonify({
            "name": "player not found",
            "data": "nothing"
            })

@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    username = escape(data.get("username"))
    password = escape(data.get("password"))

    print("login recieved")

    if auth_login(username, password):
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route('/signup', methods=["POST"])
def signup():
    data = request.get_json()
    username = escape(data.get("username"))
    password = escape(data.get("password"))
    email = escape(data.get("email"))

    if create_account(email, username, password):
        return jsonify({"success": True, "redirect": "/"})
    return jsonify({"success": False, "error": "Account creation failed"}), 400

@app.route('/stats', methods=["GET"])
def stats():
    # Return stats data as JSON
    return jsonify({"message": "Stats endpoint - provide logic here"})

#Universal Error Handler
from werkzeug.exceptions import HTTPException

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    """Return JSON for all HTTP errors."""
    response = e.get_response()
    response.data = jsonify({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    }).data
    response.content_type = "application/json"
    return response

if __name__ == "__main__":
    app.run(port=5050, debug=True)

if __name__ == "__main__":
    app.run(port=5050, debug=True)