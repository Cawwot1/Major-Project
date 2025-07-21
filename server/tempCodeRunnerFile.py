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