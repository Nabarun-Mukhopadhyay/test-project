def my_python_method(input_value):
    def factorial(n):
        if n == 0 or n == 1:
            return 1
        else:
            return n * factorial(n - 1)
       
    input_value = int(input_value)
   
    result = factorial(input_value)
   
    return result