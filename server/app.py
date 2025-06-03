from flask import Flask, request, jsonify
from flask_cors import CORS
from api.authentication import auth_login, create_account
from api.WG_API_requester import *

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests (React runs on a different port)

@app.route('/')
def index():
    return jsonify({"message": "API is running"}), 200

@app.route('/api/player-search', methods=["GET"])
def player_search():
    nickname = request.args.get('nickname')
    if not nickname:
        return jsonify({'error': 'No nickname provided'}), 400

    user_data = player_searcher(nickname)

    if len(user_data) == 1:
        user_id, user_info = next(iter(user_data.items()))
        server = user_info.get("server")
        name = user_info.get("name")
        player_data_res = player_data(user_id, server)
        return jsonify({
            "name": name,
            "data": player_data_res
        })
    else:
        return jsonify(user_data)

@app.route('/api/login', methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if auth_login(username, password):
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route('/api/signup', methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    if create_account(email, username, password):
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Account creation failed"}), 400

@app.route('/api/stats', methods=["GET"])
def stats():
    # Return stats data as JSON
    return jsonify({"message": "Stats endpoint - provide logic here"})

if __name__ == "__main__":
    app.run(port=5050, debug=True)