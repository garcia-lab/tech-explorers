# Advanced HTML & CSS

## Learning Objectives

By the end of this lesson, students will be able to:

- Add style to HTML pages using CSS
- Understand the box model and how it affects layout
- Use different CSS selectors to target specific elements
- Apply colors, fonts, and backgrounds to web pages
- Create simple layouts using CSS
- Understand responsive design basics

## What is CSS?

CSS stands for **C**ascading **S**tyle **S**heets. While HTML provides the structure and content of a web page, CSS is responsible for how it looks. If HTML is the skeleton of a web page, CSS is the skin, clothes, and makeup!

### Why Learn CSS?

- Makes your web pages visually appealing
- Allows you to create consistent designs across multiple pages
- Enables responsive design so pages look good on all devices
- Separates content (HTML) from presentation (CSS)
- Essential skill for web development

## Adding CSS to HTML

There are three ways to add CSS to an HTML document:

### 1. Inline CSS (using the style attribute)

```html
<p style="color: blue; font-size: 18px;">This is a blue paragraph with larger text.</p>
```

### 2. Internal CSS (using the style tag in the head section)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Styled Page</title>
    <style>
        p {
            color: blue;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <p>This is a blue paragraph with larger text.</p>
    <p>This paragraph will also be blue with larger text!</p>
</body>
</html>
```

### 3. External CSS (using a separate CSS file)

First, create an HTML file (index.html):

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Styled Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <p>This is a blue paragraph with larger text.</p>
    <p>This paragraph will also be blue with larger text!</p>
</body>
</html>
```

Then, create a CSS file (styles.css):

```css
p {
    color: blue;
    font-size: 18px;
}
```

**External CSS is the preferred method** because it:
- Keeps your HTML clean and focused on content
- Allows you to apply the same styles to multiple pages
- Makes maintenance easier

## CSS Syntax

CSS consists of **selectors** and **declarations**:

```css
selector {
    property: value;
    another-property: another-value;
}
```

- **Selector**: Targets the HTML element(s) you want to style
- **Property**: The aspect of the element you want to change (e.g., color, font-size)
- **Value**: What you want to set the property to

## Basic CSS Properties

Let's explore some common CSS properties:

### Text Styling

```css
p {
    color: blue;                /* Text color */
    font-family: Arial, sans-serif; /* Font type */
    font-size: 16px;           /* Text size */
    font-weight: bold;         /* Text weight (bold, normal) */
    text-align: center;        /* Text alignment (left, center, right, justify) */
    text-decoration: underline; /* Underline, overline, line-through */
    line-height: 1.5;          /* Space between lines */
}
```

### Colors and Backgrounds

```css
div {
    color: #FF5733;            /* Text color using hex code */
    background-color: yellow;   /* Background color */
    background-image: url('background.jpg'); /* Background image */
    background-size: cover;    /* How the background image is sized */
    opacity: 0.8;              /* Transparency (0 to 1) */
}
```

### Borders and Box Model

```css
div {
    border: 2px solid black;   /* Border width, style, color */
    border-radius: 10px;       /* Rounded corners */
    margin: 20px;              /* Space outside the element */
    padding: 15px;             /* Space inside the element */
    width: 300px;              /* Element width */
    height: 200px;             /* Element height */
}
```

## The Box Model

Every HTML element is a box that consists of:

1. **Content**: The actual content (text, images)
2. **Padding**: Space between content and border
3. **Border**: Line around the padding
4. **Margin**: Space outside the border

![CSS Box Model](https://www.w3schools.com/css/box-model.gif)

Understanding the box model is crucial for layout design.

## CSS Selectors

Selectors determine which elements will be styled. Here are the most common types:

### Element Selector

Selects all elements of a specified type:

```css
p {
    color: blue;
}
```

### Class Selector

Selects elements with a specific class attribute:

```css
.highlight {
    background-color: yellow;
}
```

```html
<p class="highlight">This paragraph has a yellow background.</p>
```

### ID Selector

Selects a single element with a specific ID:

```css
#header {
    font-size: 24px;
}
```

```html
<h1 id="header">This is a large header</h1>
```

### Descendant Selector

Selects elements that are descendants of a specified element:

```css
div p {
    color: green;
}
```

This will target all paragraphs inside div elements.

## Creating a Simple Styled Web Page

Let's put together what we've learned to create a styled web page:

**index.html:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Styled Web Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header id="main-header">
        <h1>My Tech Explorer Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section id="home" class="section">
        <h2>Welcome!</h2>
        <p>This is my first styled web page. I'm learning <span class="highlight">HTML and CSS</span>!</p>
        <img src="https://placehold.co/600x300" alt="A placeholder image">
    </section>

    <section id="about" class="section">
        <h2>About Me</h2>
        <p>I'm a Tech Explorer learning to code. I enjoy solving problems and creating things.</p>
        <div class="interests">
            <h3>My Interests:</h3>
            <ul>
                <li>Coding</li>
                <li>Web Design</li>
                <li>Robotics</li>
                <li>Game Development</li>
            </ul>
        </div>
    </section>

    <section id="projects" class="section">
        <h2>My Projects</h2>
        <div class="project-card">
            <h3>HTML Website</h3>
            <p>A simple website using HTML and CSS.</p>
        </div>
        <div class="project-card">
            <h3>Python Calculator</h3>
            <p>A calculator built with Python.</p>
        </div>
    </section>

    <section id="contact" class="section">
        <h2>Contact Me</h2>
        <p>You can reach me at: <a href="mailto:example@techexplorers.com">example@techexplorers.com</a></p>
    </section>

    <footer>
        <p>&copy; 2025 Tech Explorer. All rights reserved.</p>
    </footer>
</body>
</html>
```

**styles.css:**

```css
/* Base Styles */
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
}

/* Header Styles */
#main-header {
    background-color: #35424a;
    color: white;
    padding: 20px;
    text-align: center;
}

/* Navigation */
nav ul {
    list-style: none;
    padding: 0;
}

nav ul li {
    display: inline;
    margin: 0 15px;
}

nav a {
    color: white;
    text-decoration: none;
}

nav a:hover {
    color: #e8491d;
}

/* Section Styles */
.section {
    margin: 20px;
    padding: 15px;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #35424a;
    border-bottom: 2px solid #e8491d;
    padding-bottom: 5px;
}

/* Special Elements */
.highlight {
    background-color: yellow;
    padding: 2px 5px;
}

img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 15px auto;
    border: 1px solid #ddd;
}

/* Project Cards */
.project-card {
    border: 1px solid #ddd;
    padding: 15px;
    margin: 10px 0;
    border-radius: 5px;
    background-color: #f9f9f9;
}

/* Footer */
footer {
    text-align: center;
    padding: 20px;
    background-color: #35424a;
    color: white;
    margin-top: 20px;
}

/* Links */
a {
    color: #e8491d;
}

a:hover {
    text-decoration: none;
}
```

## Responsive Design Basics

Responsive design makes websites look good on all devices. Here's a simple example:

```css
/* Base styles for all devices */
body {
    font-size: 16px;
}

/* For tablets and smaller screens */
@media (max-width: 768px) {
    body {
        font-size: 14px;
    }
    
    .section {
        margin: 10px;
    }
}

/* For mobile phones */
@media (max-width: 480px) {
    nav ul li {
        display: block;
        margin: 5px 0;
    }
    
    body {
        font-size: 12px;
    }
}
```

## Challenge Activities

Ready for more? Try these challenges:

1. **Style Makeover**: Take the HTML page you created in the Basic HTML lesson and add CSS to make it visually appealing.

2. **Card Layout**: Create a "card" layout featuring 3-4 different animals or hobbies, with each card having an image, title, and description.

3. **Responsive Navigation**: Create a navigation menu that turns into a "hamburger" menu on mobile devices.

4. **Theme Switcher**: Create a page with a button that switches between light and dark themes (Hint: you'll need some JavaScript for this).

## Key Takeaways

- CSS adds style and design to HTML web pages
- External CSS files are the best practice for styling websites
- The box model is fundamental to understanding layout
- Different selectors allow you to target specific elements
- Responsive design ensures your site looks good on all devices

## Next Steps

In our next lesson, we'll learn how to create visual applications with Python!

## Additional Resources

- [CSS Tutorial on W3Schools](https://www.w3schools.com/css/)
- [MDN CSS Guide](https://developer.mozilla.org/en-US/docs/Learn/CSS)
- [CSS Tricks](https://css-tricks.com/)
- [CSS Zen Garden](http://www.csszengarden.com/) (For inspiration)