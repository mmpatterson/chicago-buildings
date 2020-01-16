
import sqlite3
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# A welcome message to test our server
@app.route('/')
def index():
    return "<h1>Welcome to our server !!</h1>"

@app.route('/API/data')
def get_data():
    cnx = sqlite3.connect('Project2')
    w2 = pd.read_sql_query("SELECT * FROM hawaii" , cnx)
    res = w2.to_json(orient='table')
    return jsonify(res)

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)

