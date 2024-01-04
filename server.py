
from flask import Flask,jsonify, request
from controller import python_method
 
app = Flask(__name__)
 
 
@app.route('/api/python_method', methods=['POST'])
def call_python_method():
    return python_method(request.get_json())

@app.route('/', methods = ['GET'])
def get_files():
    return  jsonify({"Hello": "World"})

if __name__=="__main__":
    app.run(debug=True)
