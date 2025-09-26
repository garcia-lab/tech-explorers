# Terminal Basics

## Learning Objectives

By the end of this lesson, students will be able to:
- Understand what a terminal/command-line interface is
- Navigate the file system using basic commands
- Create and manage files and directories
- Run simple commands and understand their output

## What is a Terminal?

The terminal (also known as command line or console) is a text-based interface to your computer. Instead of clicking buttons and dragging icons (like in a graphical interface), you type commands to tell the computer what to do.

Think of it like texting your computer instructions!

### Why Learn the Terminal?

- It's often **faster** than using a mouse
- You can do **powerful things** that aren't possible in a graphical interface
- Many programming tools **require** using the terminal
- It makes you look like a **movie hacker** 🕶️

## Basic Terminal Commands

Let's learn some essential commands:

### 1. Finding Your Location

```bash
pwd
```

The `pwd` command stands for "Print Working Directory." It shows your current location in the file system.

### 2. Listing Files and Folders

```bash
ls
```

The `ls` command lists all files and folders in your current directory.

To see more details (like file sizes and modification dates), use:

```bash
ls -l
```

To see hidden files too, use:

```bash
ls -a
```

### 3. Navigating Between Folders

```bash
cd folder_name
```

The `cd` command stands for "Change Directory." It lets you move between folders.

Special navigation shortcuts:
- `cd ..` - Move up one folder
- `cd ~` - Go to your home directory
- `cd /` - Go to the root of your file system

### 4. Creating Folders

```bash
mkdir new_folder
```

The `mkdir` command stands for "Make Directory." It creates a new folder.

### 5. Creating Files

```bash
touch new_file.txt
```

The `touch` command creates an empty file.

### 6. Viewing File Contents

```bash
cat file.txt
```

The `cat` command displays the content of a file.

For longer files, use these commands to view them page by page:

```bash
less file.txt
```

(Use the space bar to scroll down and `q` to quit)

### 7. Copying Files

```bash
cp original.txt copy.txt
```

The `cp` command copies a file from one location to another.

### 8. Moving/Renaming Files

```bash
mv old_name.txt new_name.txt
```

The `mv` command moves or renames files (yes, it does both!).

### 9. Removing Files and Folders

```bash
rm file.txt
```

The `rm` command removes (deletes) a file.

```bash
rm -r folder
```

Adding `-r` (recursive) lets you delete folders and everything inside them.

⚠️ **Warning**: Be careful with `rm`! Files deleted this way don't go to the Trash/Recycle Bin. They're gone forever!

## Let's Practice!

Now, let's try these commands together. I'll demonstrate each one, and explain what's happening:

1. First, let's see where we are:
   ```bash
   pwd
   ```

2. Let's create a new folder for our project:
   ```bash
   mkdir my_first_project
   ```

3. Now let's move into that folder:
   ```bash
   cd my_first_project
   ```

4. Let's create a simple text file:
   ```bash
   touch hello.txt
   ```

5. Now, let's add some text to our file (this will open a basic text editor):
   ```bash
   echo "Hello, World!" > hello.txt
   ```

6. Let's see what's in our file:
   ```bash
   cat hello.txt
   ```

7. Let's make a copy of our file:
   ```bash
   cp hello.txt hello_copy.txt
   ```

8. Let's check that we have two files now:
   ```bash
   ls
   ```

9. Let's rename one of our files:
   ```bash
   mv hello_copy.txt greeting.txt
   ```

10. And finally, let's go back to our previous directory:
    ```bash
    cd ..
    ```

## Challenge Activities

Ready for more? Try these challenges:

1. **Explorer Challenge**: Create a folder structure for a fake project with at least 3 subfolders and 2 files in each subfolder.

2. **Navigator Challenge**: Starting from your home directory, navigate to a specific folder using only one `cd` command (hint: you can include the full path).

3. **Content Creator**: Create a file called "story.txt" and add a short three-sentence story to it using the echo command.

4. **File Detective**: Use terminal commands to find the largest file in your current directory (hint: look at the options for the `ls` command).

## Key Takeaways

- The terminal provides a text-based way to interact with your computer
- Basic commands allow you to navigate, create, and manipulate files and folders
- Learning terminal commands will help you in almost every programming environment
- Practice is key to becoming comfortable with the terminal

## Next Steps

In our next lesson, we'll learn about Python and how to use it for basic math operations!

## Additional Resources

- [Terminal Cheat Sheet](https://www.codecademy.com/learn/learn-the-command-line/modules/learn-the-command-line-navigation/cheatsheet)
- [Command Line for Beginners](https://ubuntu.com/tutorials/command-line-for-beginners)
- [Interactive Terminal Tutorial](https://www.learnenough.com/command-line-tutorial)