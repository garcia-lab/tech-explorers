# Simple Math with Python

## Learning Objectives

By the end of this lesson, students will be able to:

- Understand what Python is and how it works
- Use Python as a calculator for basic math operations
- Create and use variables to store values
- Write simple Python scripts
- Run Python in both interactive mode and from files

## What is Python?

Python is a programming language that's popular because it's easy to read and write. It's used for websites, games, scientific research, artificial intelligence, and much more!

Python is named after the comedy group Monty Python, not the snake! The creator of Python, Guido van Rossum, was a fan of Monty Python's Flying Circus.

### Why Learn Python?

- It's one of the **most popular** programming languages in the world
- The syntax is **easy to read** (almost like English)
- It's **versatile** (can be used for many different types of projects)
- It has a **huge community** of users who create helpful tools and libraries
- It's a **great first language** to learn programming concepts

## Getting Started with Python

There are two main ways to use Python:

1. **Interactive Mode**: Like having a conversation with Python, one line at a time
2. **Script Mode**: Writing a complete set of instructions in a file and running it all at once

Let's start with interactive mode:

### Using Python as a Calculator

To open Python's interactive mode, simply type `python` or `python3` in your terminal:

```bash
python3
```

You'll see something like:

```
Python 3.9.7 (default, Sep 16 2021, 08:50:36) 
[Clang 10.0.0 ] :: Anaconda, Inc. on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

The `>>>` is Python's way of saying "I'm ready for your instructions!"

Let's try some basic math:

#### Addition

```python
>>> 5 + 3
8
```

#### Subtraction

```python
>>> 10 - 7
3
```

#### Multiplication

```python
>>> 4 * 6
24
```

#### Division

```python
>>> 20 / 5
4.0
```

Notice that division always gives you a decimal (floating-point) number in Python, even if the result is a whole number.

#### Exponents (Powers)

```python
>>> 2 ** 3  # 2 raised to the power of 3
8
```

#### Modulo (Remainder)

```python
>>> 17 % 5  # The remainder when 17 is divided by 5
2
```

#### Integer Division (Floor Division)

```python
>>> 17 // 5  # Division that rounds down to the nearest integer
3
```

### Using Variables

Variables are like labeled boxes where we can store values for later use:

```python
>>> age = 12
>>> age
12
```

We can use these variables in calculations:

```python
>>> age + 5  # What age will you be in 5 years?
17
```

```python
>>> age * 2  # Double your age
24
```

We can update variables too:

```python
>>> age = age + 1  # Happy Birthday!
>>> age
13
```

### Strings (Text)

Python isn't just for numbers! We can work with text too:

```python
>>> name = "Tech Explorer"
>>> name
'Tech Explorer'
```

We can combine (concatenate) strings:

```python
>>> greeting = "Hello, " + name + "!"
>>> greeting
'Hello, Tech Explorer!'
```

We can also multiply strings:

```python
>>> "Hip " * 3 + "Hooray!"
'Hip Hip Hip Hooray!'
```

## Writing Python Scripts

Let's create our first Python script file:

1. Open a text editor (like Visual Studio Code)
2. Create a new file called `math_fun.py`
3. Type the following code:

```python
# This is my first Python script!
# Lines that start with # are comments - Python ignores them

# Let's do some math and show the results
print("Welcome to Python Math!")
print("----------------------")

print("5 + 3 =", 5 + 3)
print("10 - 7 =", 10 - 7)
print("4 * 6 =", 4 * 6)
print("20 / 5 =", 20 / 5)

# Let's use some variables
my_age = 12
years_until_driving = 16 - my_age

print("If you are", my_age, "years old,")
print("You have", years_until_driving, "years until you can drive!")

# Let's calculate the area of a rectangle
length = 10
width = 5
area = length * width
print("A rectangle with length", length, "and width", width, "has an area of", area)
```

4. Save the file
5. Run it from the terminal with:

```bash
python3 math_fun.py
```

You should see the output:

```
Welcome to Python Math!
----------------------
5 + 3 = 8
10 - 7 = 3
4 * 6 = 24
20 / 5 = 4.0
If you are 12 years old,
You have 4 years until you can drive!
A rectangle with length 10 and width 5 has an area of 50
```

## User Input

Let's make our scripts interactive by getting input from the user:

Create a new file called `calculator.py`:

```python
# A simple calculator that asks for user input

print("Welcome to the Simple Calculator!")
print("--------------------------------")

# Get input from the user
first_number = input("Enter the first number: ")
second_number = input("Enter the second number: ")

# Convert string input to numbers
first_number = float(first_number)
second_number = float(second_number)

# Perform calculations
sum_result = first_number + second_number
difference = first_number - second_number
product = first_number * second_number
quotient = first_number / second_number

# Display results
print("\nResults:")
print(first_number, "+", second_number, "=", sum_result)
print(first_number, "-", second_number, "=", difference)
print(first_number, "*", second_number, "=", product)
print(first_number, "/", second_number, "=", quotient)

print("\nThank you for using the Simple Calculator!")
```

Run it with:

```bash
python3 calculator.py
```

The program will ask for two numbers and then show you their sum, difference, product, and quotient.

## Challenge Activities

Ready for more? Try these challenges:

1. **Temperature Converter**: Write a program that converts temperatures from Fahrenheit to Celsius or vice versa. (Formula: C = (F - 32) * 5/9)

2. **Area Calculator**: Write a program that can calculate the area of different shapes (circle, triangle, rectangle) based on user input.

3. **Tip Calculator**: Create a program that asks for a bill amount and tip percentage, then calculates the tip and total bill.

4. **Age Calculator**: Write a program that asks for the user's birth year and calculates their age.

## Key Takeaways

- Python is a versatile programming language that's great for beginners
- You can use Python interactively or by writing scripts
- Variables help us store and manipulate data
- Python can handle different types of data (numbers, text)
- The `input()` function lets us get information from users

## Next Steps

In our next lesson, we'll learn about HTML and how to create simple web pages!

## Additional Resources

- [Official Python Website](https://www.python.org/)
- [Interactive Python Learning](https://www.codecademy.com/learn/learn-python-3)
- [Python for Kids Book](https://nostarch.com/pythonforkids)