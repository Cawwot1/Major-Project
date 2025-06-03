from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from api.authentication import auth_login, create_account
from api.WG_API_requester import *

app = Flask(__name__)
CORS(app)  # Allow cross-origin

@app.route('/')
def index():   
    return render_template('index.html')

@app.route('/api/player-search', methods=["GET", "POST"]) # API Data requester
def player_search():

    nickname = request.args.get('nickname')
    if not nickname:
        return jsonify({'error': 'No nickname provided'}), 400

    print(nickname)

    user_data = player_searcher(nickname)

    print(user_data)

    if len(user_data) == 1:
        user_id, user_info = next(iter(user_data.items()))
        server = user_info.get("server")
        name = user_info.get("name")
        player_data_res = player_data(user_id, server)
        return player_data_res, name
    else:
        return user_data

@app.route('/login', methods=["GET","POST"])
def login():
    if request.method == "POST":
        username = request.form["username"] 
        password = request.form["password"]

        if auth_login(username, password):
            return render_template('stats.html')
    return render_template('login.html')

@app.route('/auth/signup', methods=["POST"])
def signup():
    if request.method == "POST":
        username = request.form["username"] 
        password = request.form["password"] 
        email = request.form["email"]

        if create_account(email, username, password):
            return render_template('stats.html')
    return render_template('login.html')

@app.route('/stats')
def stats():   
    return render_template('stats.html')

if __name__ == "__main__":
    app.run(port=5050, debug=True)