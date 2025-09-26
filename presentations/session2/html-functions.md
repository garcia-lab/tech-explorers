# Session 2: HTML & Python Functions

## HTML: Building Web Pages

- HTML = HyperText Markup Language
- The building blocks of the web
- Uses tags to structure content
- Every website starts with HTML!

---

## Why Learn HTML?

- Create your own websites
- Share information with the world
- Express yourself creatively
- Foundation for web development

---

## Basic HTML Document Structure

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first web page.</p>
</body>
</html>
```

---

## HTML Tags Explained

- Tags are enclosed in angle brackets: `<tag>content</tag>`
- Most tags come in pairs (opening and closing)
- The closing tag has a forward slash: `</tag>`
- Some tags are self-closing: `<img src="photo.jpg" />`

---

## Common HTML Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `<h1>` to `<h6>` | Headings | `<h1>Main Title</h1>` |
| `<p>` | Paragraphs | `<p>This is a paragraph.</p>` |
| `<a>` | Links | `<a href="https://example.com">Click here</a>` |
| `<img>` | Images | `<img src="photo.jpg" alt="description" />` |

---

## Creating Lists

### Unordered List (Bullet Points)

```html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

### Ordered List (Numbers)

```html
<ol>
    <li>First step</li>
    <li>Second step</li>
    <li>Third step</li>
</ol>
```

---

## Adding Links

Links connect to other pages or websites:

```html
<a href="https://www.example.com">Visit Example.com</a>

<!-- Link to another page on your site -->
<a href="about.html">About Us</a>

<!-- Link that opens in a new tab -->
<a href="https://www.example.com" target="_blank">
    Open in new tab
</a>
```

---

## Inserting Images

Images make your page visually appealing:

```html
<img src="cat.jpg" alt="A cute cat" />

<!-- Controlling image size -->
<img src="dog.jpg" alt="A friendly dog" width="300" height="200" />

<!-- Image with a link -->
<a href="pets.html">
    <img src="pet.jpg" alt="View our pets" />
</a>
```

---

## Let's Create a Web Page

Create a file named `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Tech Explorer Page</title>
</head>
<body>
    <h1>Welcome to My Page</h1>
    <p>This is my first HTML website!</p>
    <img src="https://placekitten.com/300/200" alt="A cute kitten" />
</body>
</html>
```

---

## Adding More Content

Let's enhance our page:

```html
<!-- Add this inside the body -->
<h2>My Favorite Things</h2>
<ul>
    <li>Coding</li>
    <li>Games</li>
    <li>Music</li>
</ul>

<h2>Contact Me</h2>
<p>Email: techexplorer@example.com</p>
<a href="https://example.com">My Other Website</a>
```

---

## Python Functions

## What are Functions?

- Reusable blocks of code
- Like mini-programs inside your program
- Help organize and structure your code
- Prevent repetition (DRY - Don't Repeat Yourself)

---

## Why Use Functions?

- **Reuse code** instead of copying and pasting
- **Simplify complex tasks** by breaking them down
- Make code **easier to read and understand**
- **Fix bugs once**, not in multiple places
- **Share code** with others more easily

---

## Basic Function Syntax

```python
def say_hello():
    print("Hello, Tech Explorer!")
    print("Welcome to functions!")

# Call the function to run it
say_hello()
```

---

## Functions with Parameters

Parameters let you customize functions:

```python
def greet(name):
    print("Hello, " + name + "!")

# Call with different arguments
greet("Alex")    # Hello, Alex!
greet("Taylor")  # Hello, Taylor!
greet("Jordan")  # Hello, Jordan!
```

---

## Multiple Parameters

Functions can accept multiple pieces of information:

```python
def describe_pet(name, animal_type):
    print("I have a " + animal_type + " named " + name)

describe_pet("Rex", "dog")       # I have a dog named Rex
describe_pet("Whiskers", "cat")  # I have a cat named Whiskers
```

---

## Return Values

Functions can give back results:

```python
def add_numbers(a, b):
    result = a + b
    return result

sum = add_numbers(5, 3)
print("The sum is", sum)   # The sum is 8

# Can use the result directly
print(add_numbers(10, 7) * 2)  # 34
```

---

## A Practical Example: Temperature Converter

```python
def fahrenheit_to_celsius(temp_f):
    temp_c = (temp_f - 32) * 5/9
    return temp_c

def celsius_to_fahrenheit(temp_c):
    temp_f = (temp_c * 9/5) + 32
    return temp_f

# Converting temperatures
print(fahrenheit_to_celsius(68))  # 20.0
print(celsius_to_fahrenheit(25))   # 77.0
```

---

## Building a Simple Calculator

```python
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return "Cannot divide by zero!"
    return a / b

# Using our calculator
print(add(5, 3))       # 8
print(multiply(4, 7))  # 28
```

---

## Combining HTML and Python

- HTML is for the web pages
- Python is for the logic and processing
- Together, they can create dynamic web applications
- You'll learn more about this in future classes!

---

## Key Concepts We've Learned

- **HTML basics**: Structure and elements of web pages
- **Function fundamentals**: Creating reusable blocks of code
- **Parameters**: Passing information to functions
- **Return values**: Getting results back from functions

---

## Challenge for Next Time

Create a Python program that:

1. Defines a function called `create_html_tag`
2. Takes parameters for a tag name and content
3. Returns the proper HTML (e.g., `<h1>Title</h1>`)
4. Call it multiple times to build different HTML elements
