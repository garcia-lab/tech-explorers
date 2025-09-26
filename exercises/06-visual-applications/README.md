# Visual Applications with Python

## Learning Objectives

By the end of this lesson, students will be able to:

- Understand how to create simple visual applications in Python
- Use the Turtle graphics module for drawing
- Create interactive elements using Tkinter
- Understand basic event handling in GUI applications
- Create a simple game using Python

## Introduction to Visual Programming

So far, we've been using Python in the terminal/console, but Python can also create visual applications with graphics and interactive elements. Visual applications make programming more engaging and fun!

In this lesson, we'll explore two different ways to create visual applications in Python:

1. **Turtle Graphics** - A simple way to draw pictures by controlling a virtual "turtle"
2. **Tkinter** - A toolkit for creating windows, buttons, and other GUI (Graphical User Interface) elements

## Turtle Graphics

The Turtle module is a built-in Python library that allows you to draw pictures by controlling a virtual turtle. Imagine a turtle with a pen tied to its tail, walking on a piece of paper. You can give commands to move the turtle, and it draws lines as it moves.

### Setting Up Turtle

```python
import turtle

# Create a drawing screen
screen = turtle.Screen()
screen.title("My Turtle Drawing")

# Create a turtle
t = turtle.Turtle()

# Keep the window open until clicked
screen.exitonclick()
```

### Basic Turtle Commands

```python
# Move commands
t.forward(100)    # Move forward 100 pixels
t.backward(50)    # Move backward 50 pixels
t.right(90)       # Turn right 90 degrees
t.left(45)        # Turn left 45 degrees

# Pen commands
t.penup()         # Lift the pen (stop drawing)
t.pendown()       # Lower the pen (start drawing)
t.pensize(5)      # Set line thickness to 5 pixels
t.pencolor("red") # Set the drawing color to red

# Position commands
t.goto(0, 0)      # Go to coordinates (0, 0)
t.home()          # Go to the starting position (0, 0)
```

### Drawing a Simple Shape

Let's draw a square:

```python
import turtle

# Set up the screen
screen = turtle.Screen()
screen.title("Drawing a Square")

# Create a turtle
t = turtle.Turtle()
t.pensize(3)

# Draw a square
for i in range(4):
    t.forward(100)
    t.right(90)

# Keep the window open until clicked
screen.exitonclick()
```

### Drawing a Colorful Spiral

Now, let's create something more visually interesting:

```python
import turtle
import random

# Set up the screen
screen = turtle.Screen()
screen.title("Colorful Spiral")
screen.bgcolor("black")

# Create a turtle
t = turtle.Turtle()
t.speed(0)  # Fastest speed

# Create a list of colors
colors = ["red", "orange", "yellow", "green", "blue", "purple"]

# Draw a spiral with changing colors
for i in range(360):
    t.pencolor(colors[i % len(colors)])
    t.width(i / 100 + 1)
    t.forward(i)
    t.left(59)

# Keep the window open until clicked
screen.exitonclick()
```

## Introduction to Tkinter

Tkinter is Python's standard GUI (Graphical User Interface) toolkit. It provides elements like windows, buttons, text fields, and more, to create interactive applications.

### Creating a Simple Window

```python
import tkinter as tk

# Create the main window
window = tk.Tk()
window.title("My First GUI App")
window.geometry("300x200")  # Width x Height

# Add a label (text)
label = tk.Label(window, text="Hello, Tech Explorers!", font=("Arial", 16))
label.pack(pady=20)

# Add a button
button = tk.Button(window, text="Click Me!", width=10)
button.pack(pady=10)

# Start the application
window.mainloop()
```

### Making the Button Do Something

Now let's make our button interactive:

```python
import tkinter as tk

# Create the main window
window = tk.Tk()
window.title("Interactive Button")
window.geometry("300x200")

# Function that runs when the button is clicked
def button_clicked():
    label.config(text="Button was clicked!")

# Add a label
label = tk.Label(window, text="Click the button below", font=("Arial", 14))
label.pack(pady=20)

# Add a button with a command
button = tk.Button(window, text="Click Me!", width=10, command=button_clicked)
button.pack(pady=10)

# Start the application
window.mainloop()
```

### Creating a Simple Counter App

Let's create a slightly more complex application - a counter that increases when you click a button:

```python
import tkinter as tk

# Create the main window
window = tk.Tk()
window.title("Counter App")
window.geometry("300x200")

# Initialize counter value
counter = 0

# Function to increment counter
def increment():
    global counter
    counter += 1
    counter_label.config(text=str(counter))

# Function to reset counter
def reset():
    global counter
    counter = 0
    counter_label.config(text=str(counter))

# Title label
title_label = tk.Label(window, text="Counter", font=("Arial", 16))
title_label.pack(pady=10)

# Counter display
counter_label = tk.Label(window, text="0", font=("Arial", 24))
counter_label.pack(pady=10)

# Button frame
button_frame = tk.Frame(window)
button_frame.pack(pady=10)

# Add increment button
increment_button = tk.Button(button_frame, text="Increment", width=10, command=increment)
increment_button.pack(side=tk.LEFT, padx=5)

# Add reset button
reset_button = tk.Button(button_frame, text="Reset", width=10, command=reset)
reset_button.pack(side=tk.LEFT, padx=5)

# Start the application
window.mainloop()
```

## Creating a Simple Game: "Catch the Turtle"

Now, let's combine what we've learned to create a simple game where players try to click on a turtle that moves randomly around the screen:

```python
import turtle
import random
import time

# Set up the screen
screen = turtle.Screen()
screen.title("Catch the Turtle")
screen.bgcolor("light blue")
screen.setup(width=600, height=600)

# Create the turtle to catch
target = turtle.Turtle()
target.shape("turtle")
target.color("green")
target.penup()
target.speed(0)
target.shapesize(2)  # Make the turtle bigger

# Create a score display
score_display = turtle.Turtle()
score_display.hideturtle()
score_display.penup()
score_display.goto(0, 260)
score_display.write("Score: 0", align="center", font=("Arial", 16, "normal"))

# Initialize game variables
score = 0
game_duration = 30  # seconds
game_over = False

# Function to handle clicking on the turtle
def on_target_click(x, y):
    global score
    if not game_over:
        score += 1
        score_display.clear()
        score_display.write(f"Score: {score}", align="center", font=("Arial", 16, "normal"))
        move_target()

# Function to move the turtle to a random position
def move_target():
    x = random.randint(-250, 250)
    y = random.randint(-250, 250)
    target.goto(x, y)

# Set up the click handler
target.onclick(on_target_click)

# Timer display
timer_display = turtle.Turtle()
timer_display.hideturtle()
timer_display.penup()
timer_display.goto(0, 230)
timer_display.write(f"Time left: {game_duration}", align="center", font=("Arial", 16, "normal"))

# Game loop
start_time = time.time()
move_target()  # Move the turtle to its first position

while time.time() - start_time < game_duration:
    time_left = int(game_duration - (time.time() - start_time))
    timer_display.clear()
    timer_display.write(f"Time left: {time_left}", align="center", font=("Arial", 16, "normal"))
    screen.update()
    
game_over = True

# Game over message
target.hideturtle()
game_over_turtle = turtle.Turtle()
game_over_turtle.hideturtle()
game_over_turtle.penup()
game_over_turtle.goto(0, 0)
game_over_turtle.write(f"GAME OVER!\nFinal Score: {score}", align="center", font=("Arial", 24, "bold"))

# Keep the window open until clicked
screen.exitonclick()
```

## Challenge Activities

Ready for more? Try these challenges:

1. **Turtle Art Project**: Create a more complex design using turtle graphics. Try drawing a house, a flower, or a custom shape with multiple colors.

2. **Calculator App**: Build a simple calculator with Tkinter that has buttons for numbers and basic operations (add, subtract, multiply, divide).

3. **Tic-Tac-Toe Game**: Create a Tic-Tac-Toe game using Tkinter where two players can take turns.

4. **Drawing App**: Make an app where users can draw by dragging their mouse, change colors, and clear the canvas.

## Key Takeaways

- Python can create visual applications beyond console programs
- Turtle graphics is a simple way to draw shapes and patterns
- Tkinter allows you to create interactive GUI applications
- Event handling is key to making interactive applications
- Visual applications make programming more engaging and fun

## Next Steps

In our next and final lesson, we'll learn about AI tools for coding, focusing on GitHub Copilot!

## Additional Resources

- [Python Turtle Documentation](https://docs.python.org/3/library/turtle.html)
- [Tkinter Documentation](https://docs.python.org/3/library/tkinter.html)
- [Turtle Graphics Tutorial](https://realpython.com/beginners-guide-python-turtle/)
- [GUI Programming with Tkinter](https://realpython.com/python-gui-tkinter/)