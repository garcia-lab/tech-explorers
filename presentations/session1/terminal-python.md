# Session 1: Terminal Basics & Python Math

## The Command Line Interface

- Your computer has a **text-based interface**
- Instead of clicking, we type commands
- Professional developers use this every day!

---

## Why Learn the Terminal?

- **Powerful**: Do things the graphical interface can't
- **Efficient**: Faster than clicking through menus
- **Automation**: Repeat tasks easily
- **Essential**: Required for many programming tools

---

## Basic Terminal Navigation

| Command | What it Does | Example |
|---------|--------------|---------|
| `pwd`   | Print Working Directory (where am I?) | `pwd` |
| `ls`    | List files and folders | `ls` |
| `cd`    | Change Directory | `cd Documents` |
| `mkdir` | Make Directory (create folder) | `mkdir MyProject` |

---

## Creating and Viewing Files

| Command | What it Does | Example |
|---------|--------------|---------|
| `touch` | Create a new empty file | `touch hello.txt` |
| `cat`   | View file contents | `cat hello.txt` |
| `echo`  | Print text or write to file | `echo "Hello!" > hello.txt` |

---

## Hands-on: Let's Try

1. Open the Terminal (or Command Prompt on Windows)
2. Type `pwd` and press Enter
3. Type `ls` to see what files are there
4. Create a folder: `mkdir TechExplorers`
5. Move into that folder: `cd TechExplorers`

---

## Hands-on: Create a File

Let's create our first code file:

```bash
touch hello.txt
echo "Hello, Tech Explorers!" > hello.txt
cat hello.txt
```

---

## Introduction to Python

- Created in 1991 by Guido van Rossum
- Named after Monty Python (not the snake!)
- Designed to be readable and simple
- Great for beginners, but also used professionally

---

## Why Python?

- **Readable**: Code looks almost like English
- **Versatile**: Used in many fields
  - Web development
  - Data science
  - Artificial intelligence
  - Game development
- **Popular**: Huge community and resources

---

## Using Python as a Calculator

Python can do math operations:

```python
>>> 5 + 3    # Addition
8
>>> 10 - 7   # Subtraction
3
>>> 4 * 6    # Multiplication
24
>>> 20 / 5   # Division
4.0
```

---

## More Math Operations

```python
>>> 3 ** 4   # Exponents (3 to the power of 4)
81
>>> 10 % 3   # Modulo (remainder after division)
1
>>> 7 // 2   # Integer division (drops decimal)
3
```

---

## Variables in Python

Variables store values for later use:

```python
>>> age = 12
>>> age + 5  # What age will you be in 5 years?
17

>>> price = 5
>>> quantity = 3
>>> price * quantity  # Total cost
15
```

---

## Text in Python with Strings

Strings are text values:

```python
>>> name = "Alex"
>>> greeting = "Hello, " + name + "!"
>>> greeting
'Hello, Alex!'

>>> "Tech" + " " + "Explorers"
'Tech Explorers'
```

---

## Challenge: Calculate Your Age in Days

```python
>>> age = 12
>>> days_per_year = 365
>>> age * days_per_year  # Approx. days you've been alive
4380
```

Try with your own age!

---

## Input and Output

Let's make interactive programs:

```python
name = input("What's your name? ")
print("Nice to meet you, " + name + "!")

age = input("How old are you? ")
age = int(age)  # Convert string to number
print("In 5 years, you'll be", age + 5)
```

---

## Let's Create a Program

Create a file named `greeting.py`:

```python
# This is our first Python program
name = input("Enter your name: ")
print("Welcome to coding, " + name + "!")
print("Let's learn Python together!")
```

Run it with: `python greeting.py`

---

## Math Challenge: Temperature Converter

Convert from Fahrenheit to Celsius:

```python
# Temperature converter
fahrenheit = input("Enter temperature in Fahrenheit: ")
fahrenheit = float(fahrenheit)

celsius = (fahrenheit - 32) * 5/9
print(fahrenheit, "°F =", celsius, "°C")
```

---

## Key Concepts We've Learned

- **Terminal**: Navigate files and run commands
- **Python basics**: Math operations and variables
- **Input/Output**: Get user input and display results
- **Problem-solving**: Break down into steps

---

## Takeaways

- The terminal gives you powerful control over your computer
- Python makes math and calculations easy
- Variables store information for later use
- You can create interactive programs with input and output

---

## Next Session Preview

- HTML: Building your first web page
- Python Functions: Creating reusable blocks of code

---

## Questions?

Don't be afraid to ask!

---

## Challenge for Next Time

Create a Python program that:

1. Asks for your name
2. Asks for your favorite number
3. Prints out your name repeated that many times
