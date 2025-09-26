# Basic HTML

## Learning Objectives

By the end of this lesson, students will be able to:

- Understand what HTML is and how it structures web pages
- Create a simple HTML document with proper structure
- Use common HTML elements like headings, paragraphs, and lists
- Add links and images to a web page
- View and inspect their HTML pages in a web browser

## What is HTML?

HTML stands for **H**yper**T**ext **M**arkup **L**anguage. It's the standard language used to create web pages.

Think of HTML as the "skeleton" of a web page. It provides the basic structure that tells web browsers how to display the content.

### Why Learn HTML?

- It's the foundation of **every** website on the internet
- It's relatively **easy to learn** with just a few basic concepts
- You can create interactive content that can be accessed by anyone with a web browser
- It's the first step to becoming a web developer

## HTML Basics

HTML uses "tags" to structure content. Tags are enclosed in angle brackets, like this: `<tag>`. Most tags come in pairs, with an opening tag and a closing tag that includes a forward slash, like this: `</tag>`.

The content goes between the opening and closing tags:

```html
<tag>Content goes here</tag>
```

## Creating Your First HTML Page

Let's create a simple HTML page:

1. Open a text editor (like Visual Studio Code)
2. Create a new file called `index.html`
3. Add the following code:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to My Website!</h1>
    <p>This is my very first web page. I created it while learning HTML.</p>
</body>
</html>
```

4. Save the file
5. Open it in a web browser (double-click the file or drag it into a browser window)

Congratulations! You've created your first web page!

## Understanding the HTML Structure

Let's break down the different parts of the HTML document:

- `<!DOCTYPE html>`: Tells the browser this is an HTML5 document
- `<html>`: The root element that contains all other elements
- `<head>`: Contains meta-information about the document (not visible on the page)
- `<title>`: Sets the title that appears in the browser tab/window
- `<body>`: Contains all the visible content of the page
- `<h1>`: A level 1 heading (the largest heading)
- `<p>`: A paragraph of text

## Common HTML Elements

Let's explore some common HTML elements you can use:

### Headings

HTML has six levels of headings, from `<h1>` (most important) to `<h6>` (least important):

```html
<h1>This is a Level 1 Heading</h1>
<h2>This is a Level 2 Heading</h2>
<h3>This is a Level 3 Heading</h3>
<h4>This is a Level 4 Heading</h4>
<h5>This is a Level 5 Heading</h5>
<h6>This is a Level 6 Heading</h6>
```

### Paragraphs

Use the `<p>` tag to create paragraphs:

```html
<p>This is a paragraph of text. HTML will automatically wrap the text to fit the screen size.</p>
<p>This is another paragraph. Notice how HTML adds space between paragraphs.</p>
```

### Text Formatting

You can make text bold or italic:

```html
<p>This is <strong>bold text</strong> and this is <em>italic text</em>.</p>
```

### Lists

#### Unordered Lists (Bullet Points)

```html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
```

#### Ordered Lists (Numbered)

```html
<ol>
    <li>First step</li>
    <li>Second step</li>
    <li>Third step</li>
</ol>
```

### Links

Use the `<a>` (anchor) tag to create links:

```html
<a href="https://www.example.com">Visit Example.com</a>
```

You can also link to other pages on your website:

```html
<a href="about.html">About Me</a>
```

### Images

Use the `<img>` tag to add images:

```html
<img src="image.jpg" alt="Description of the image">
```

The `alt` attribute provides a text description of the image for screen readers and in case the image doesn't load.

## Let's Build a Complete Web Page

Now, let's put it all together to create a more interesting web page:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Tech Explorer Page</title>
</head>
<body>
    <h1>Welcome to My Tech Explorer Page</h1>
    
    <h2>About Me</h2>
    <p>Hi there! I'm a <strong>Tech Explorer</strong> learning how to code. I'm interested in:</p>
    <ul>
        <li>Programming</li>
        <li>Web Design</li>
        <li>Game Development</li>
        <li>Robotics</li>
    </ul>
    
    <h2>My Favorite Websites</h2>
    <ol>
        <li><a href="https://www.codecademy.com">Codecademy</a> - Learn to code</li>
        <li><a href="https://www.nasa.gov">NASA</a> - Space exploration</li>
        <li><a href="https://scratch.mit.edu">Scratch</a> - Visual programming</li>
    </ol>
    
    <h2>A Cool Robot</h2>
    <img src="https://placehold.co/400x200" alt="A cool robot image">
    
    <p>Thanks for visiting my page!</p>
</body>
</html>
```

Let's save this as `my_page.html` and open it in a browser.

## Challenge Activities

Ready for more? Try these challenges:

1. **Personal Profile**: Create an HTML page about yourself that includes a heading, paragraphs, a list of hobbies, and at least one image.

2. **Favorite Animals**: Create a web page that showcases your top 3 favorite animals with headings, descriptions, and images for each animal.

3. **Recipe Page**: Create a page for a favorite recipe with an ingredients list and numbered steps.

4. **HTML Tags Explorer**: Create a page that demonstrates at least 10 different HTML tags with examples and descriptions of what they do.

## Key Takeaways

- HTML uses tags to structure content on web pages
- Every HTML document has a head and body section
- Common elements include headings, paragraphs, lists, links, and images
- HTML files can be viewed directly in any web browser
- HTML is the foundation for all web development

## Next Steps

In our next lesson, we'll learn about Python functions and how they help us write reusable code!

## Additional Resources

- [HTML Tutorial on W3Schools](https://www.w3schools.com/html/)
- [Mozilla Developer Network (MDN) HTML Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [HTML Cheat Sheet](https://htmlcheatsheet.com/)