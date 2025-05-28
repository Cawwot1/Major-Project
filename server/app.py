from flask import Flask, render_template, request
from .api.authentication import auth_login, create_account

app = Flask(__name__)

@app.route('/')
def index():   
    return render_template('index.html')

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
    app.run(debug=True)