"""
VULNERABLE CODE - DO NOT USE IN PRODUCTION
Sample vulnerable Python code for SAST testing
CWE vulnerabilities included for security scanning
"""

import sqlite3
import pickle
import os
import subprocess
import hashlib
from flask import Flask, request

app = Flask(__name__)

# Vulnerability: Hardcoded Credentials (CWE-798)
DB_HOST = "localhost"
DB_USER = "admin"
DB_PASSWORD = "SuperSecret123!"
API_KEY = "sk-1234567890abcdefghijklmnop"
SECRET_TOKEN = "mysecrettoken12345"

# Database connection
db_connection = None


@app.route('/search')
def search_user():
    """
    Vulnerability: SQL Injection (CWE-89)
    User input is directly concatenated into SQL query
    """
    username = request.args.get('username')
    
    query = f"SELECT * FROM users WHERE username = '{username}'"
    cursor = db_connection.cursor()
    cursor.execute(query)  # SQL Injection vulnerability
    
    result = cursor.fetchone()
    return {"user": result}


@app.route('/execute', methods=['POST'])
def execute_command():
    """
    Vulnerability: Command Injection (CWE-78)
    User input passed directly to shell execution
    """
    command = request.json.get('command')
    
    # Command Injection vulnerability
    result = os.system(command)
    return {"status": "executed"}


@app.route('/file')
def read_file():
    """
    Vulnerability: Path Traversal (CWE-22)
    User input used directly in file path without validation
    """
    filename = request.args.get('filename')
    
    base_path = "/uploads/"
    file_path = base_path + filename  # No validation - allows ../ traversal
    
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        return {"content": content}
    except Exception as e:
        return {"error": str(e)}


@app.route('/deserialize', methods=['POST'])
def deserialize_object():
    """
    Vulnerability: Insecure Deserialization (CWE-502)
    Using pickle to deserialize untrusted data
    """
    data = request.files['file'].read()
    
    try:
        obj = pickle.loads(data)  # Insecure deserialization
        return {"object": str(obj)}
    except Exception as e:
        return {"error": str(e)}


@app.route('/hash')
def hash_password():
    """
    Vulnerability: Weak Cryptography (CWE-327)
    Using weak hashing algorithm without salt
    """
    password = request.args.get('password')
    
    # MD5 is cryptographically broken - insecure
    hash_obj = hashlib.md5(password.encode())
    hashed = hash_obj.hexdigest()
    
    return {"hash": hashed}


@app.route('/user/<user_id>')
def get_user_data(user_id):
    """
    Vulnerability: Sensitive Data Exposure (CWE-200)
    Returns sensitive user data without proper authorization
    """
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor = db_connection.cursor()
    cursor.execute(query)
    
    result = cursor.fetchone()
    
    # Returning sensitive data without filtering
    return {
        "id": result[0],
        "username": result[1],
        "email": result[2],
        "ssn": result[3],  # Sensitive
        "credit_card": result[4],  # Sensitive
        "password_hash": result[5]  # Should not be exposed
    }


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Vulnerability: Unrestricted File Upload (CWE-434)
    No validation of uploaded file type or content
    """
    file = request.files['file']
    
    # No file type validation - allows arbitrary file uploads
    filename = file.filename
    file.save(f'/uploads/{filename}')
    
    return {"status": "uploaded", "filename": filename}


@app.route('/execute-subprocess')
def execute_subprocess():
    """
    Vulnerability: Unsafe Subprocess Usage
    User input used in subprocess without proper escaping
    """
    cmd_arg = request.args.get('arg')
    
    # Dangerous: shell=True with user input
    result = subprocess.run(f"echo {cmd_arg}", shell=True, capture_output=True)
    
    return {"output": result.stdout.decode()}


def debug_eval():
    """
    Vulnerability: Code Injection (CWE-95)
    Using eval() with user-controlled input
    """
    user_input = request.args.get('code')
    
    try:
        result = eval(user_input)  # Dangerous code injection
        return {"result": str(result)}
    except Exception as e:
        return {"error": str(e)}


def check_password(provided, stored):
    """
    Vulnerability: Weak Password Verification
    Timing attack vulnerability - no constant-time comparison
    """
    if provided == stored:  # Not constant-time, vulnerable to timing attacks
        return True
    return False


if __name__ == '__main__':
    # Vulnerability: Running Flask in debug mode in production
    app.run(debug=True, host='0.0.0.0')  # Debug=True is insecure
