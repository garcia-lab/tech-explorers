# Python Functions

## Learning Objectives

By the end of this lesson, students will be able to:

- Understand what functions are and why they're useful
- Create and call simple functions in Python
- Pass arguments to functions and return values
- Understand function scope and variables
- Use functions to organize code and make it reusable

## What Are Functions?

Functions are like mini-programs within your program. They are blocks of code that perform a specific task and can be reused whenever you need them.

Think of functions as machines in a factory: you put something in (input), the machine processes it, and then it gives you something back (output).

### Why Use Functions?

- **Reusability**: Write code once, use it many times
- **Organization**: Break down complex problems into smaller, manageable pieces
- **Readability**: Make your code easier to understand
- **Maintenance**: If you need to change how something works, you only need to update it in one place

## Creating and Using Functions

### Basic Function Syntax

Here's the basic structure of a Python function:

```python
def function_name(parameters):
    # Code to execute
    return result  # Optional
```

Let's break this down:

- `def` is the keyword that tells Python you're defining a function
- `function_name` is the name you give your function (following variable naming rules)
- `parameters` are inputs your function can accept (optional)
- The code inside the function is indented
- `return` specifies what value the function gives back (optional)

### A Simple Function Example

Let's create our first function that greets a person:

```python
def say_hello():
    print("Hello, world!")

# Call the function
say_hello()
```

When you run this code, you'll see:

```
Hello, world!
```

### Functions with Parameters

We can make our function more flexible by adding parameters:

```python
def greet(name):
    print("Hello, " + name + "!")

# Call the function with different arguments
greet("Alice")
greet("Bob")
greet("Charlie")
```

This will output:

```
Hello, Alice!
Hello, Bob!
Hello, Charlie!
```

### Functions with Multiple Parameters

Functions can have multiple parameters:

```python
def describe_person(name, age):
    print(name + " is " + str(age) + " years old.")

# Call the function
describe_person("Maya", 12)
describe_person("Ethan", 13)
```

Output:

```
Maya is 12 years old.
Ethan is 13 years old.
```

### Returning Values

Functions can give back (return) values that you can use elsewhere in your program:

```python
def add(a, b):
    sum_result = a + b
    return sum_result

# Use the returned value
result = add(5, 3)
print("The sum is:", result)

# You can also use the return value directly
print("7 + 9 =", add(7, 9))
```

Output:

```
The sum is: 8
7 + 9 = 16
```

## Let's Build Something Useful

Now let's create a more practical example. We'll build a simple calculator using functions:

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Error! Division by zero."
    return a / b

# Main program
print("Simple Calculator")
print("-----------------")

num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

print("\nResults:")
print(num1, "+", num2, "=", add(num1, num2))
print(num1, "-", num2, "=", subtract(num1, num2))
print(num1, "*", num2, "=", multiply(num1, num2))
print(num1, "/", num2, "=", divide(num1, num2))
```

Save this as `calculator_functions.py` and run it.

## Function Scope: Local vs. Global Variables

When you create variables inside a function, they only exist inside that function. These are called "local variables":

```python
def calculate_area():
    length = 10  # This is a local variable
    width = 5    # This is also a local variable
    area = length * width
    print("The area is:", area)

calculate_area()

# This would cause an error because length is not defined outside the function:
# print(length)
```

Variables created outside functions are "global variables" and can be accessed anywhere:

```python
school = "Tech Explorers Academy"  # This is a global variable

def display_school():
    print("Welcome to", school)  # Can access the global variable

display_school()
print("School name:", school)  # Works fine
```

## Functions Calling Other Functions

Functions can call other functions:

```python
def get_rectangle_area(length, width):
    return length * width

def get_rectangle_perimeter(length, width):
    return 2 * (length + width)

def describe_rectangle(length, width):
    area = get_rectangle_area(length, width)
    perimeter = get_rectangle_perimeter(length, width)
    
    print(f"A rectangle of length {length} and width {width}:")
    print(f"- Has an area of {area} square units")
    print(f"- Has a perimeter of {perimeter} units")

# Call the main function
describe_rectangle(8, 3)
```

## Default Parameters

You can set default values for parameters, making them optional:

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Sarah")  # Uses default greeting
greet("Max", "Howdy")  # Overrides default greeting
```

Output:

```
Hello, Sarah!
Howdy, Max!
```

## Challenge Activities

Ready for more? Try these challenges:

1. **Temperature Converter Function**: Create a function that converts temperatures between Fahrenheit and Celsius. Then write a program that uses this function to create a temperature conversion table.

2. **Geometry Calculator**: Create functions to calculate the area of different shapes (circle, triangle, rectangle). Then create a menu system that asks the user which shape they want to calculate.

3. **Word Processor**: Write functions to count the number of words, characters, and sentences in a text. Then create a program that analyzes a paragraph input by the user.

4. **Number Analyzer**: Create functions to check if a number is even, odd, prime, or a perfect square. Then write a program that runs all these checks on a number input by the user.

## Key Takeaways

- Functions help organize code into reusable blocks
- Functions can take inputs (parameters) and provide outputs (return values)
- Variables created inside functions are local to those functions
- Functions can call other functions
- Well-designed functions make your code cleaner and more maintainable

## Next Steps

In our next lesson, we'll learn about advanced HTML and CSS to make visually appealing web pages!

## Additional Resources

- [Python Functions Tutorial](https://www.w3schools.com/python/python_functions.asp)
- [Real Python - Python Functions](https://realpython.com/defining-your-own-python-function/)
- [Interactive Python Function Practice](https://www.codecademy.com/learn/learn-python-3/modules/learn-python3-functions)