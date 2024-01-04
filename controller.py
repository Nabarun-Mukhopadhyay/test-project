from flask import jsonify
from model import my_python_method
 
def python_method(data):
    input_value = data.get('input_value')
   
    #Calling Python Method Here
    result = my_python_method(input_value)
   
    return jsonify({'result': result})