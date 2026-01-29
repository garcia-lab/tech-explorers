# 🚀 Tech Explorers

> **An Interactive Coding Adventure for Young Learners (Ages 6-14)**

![Tech Explorers Banner](docs/assets/images/screenshots/banner-preview.png)

## ✨ What is Tech Explorers?

Tech Explorers is a **browser-based, interactive coding curriculum** designed to introduce children to the exciting world of coding and app creation. No installations, no logins, no complicated setup—just open a browser and start learning!

### 🎯 Perfect For

- **Students**: Ages 6-14, complete beginners
- **Settings**: Classrooms, coding clubs, homeschool, after-school programs
- **Duration**: 2-hour sessions (with extensions for fast learners)
- **Devices**: Works on Chromebooks, laptops, tablets

---

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 🔓 **No Login Required** | Students can access everything directly in their browser |
| 🎨 **Kid-Friendly Design** | Bright colors, fun animations, and encouraging feedback |
| 📱 **Works Everywhere** | Optimized for Chromebooks and all modern browsers |
| 🧭 **Self-Guided** | Clear step-by-step instructions minimize hand-raising |
| 🏆 **Progress Tracking** | Stars and badges keep students motivated |
| 👩‍🏫 **Teacher Resources** | Facilitation guides and troubleshooting tips included |
| 🚀 **Extensible** | Bonus challenges for fast finishers |

---

## 🗺️ The Learning Journey

Students progress through **5 exciting adventures**:

### 🖥️ Adventure 1: Meet the Computer (20 min)
*"What IS a computer, and how do we talk to it?"*
- Interactive diagrams
- Drag-and-drop activities
- Browser scavenger hunt

### 🏗️ Adventure 2: HTML Hero (30 min)
*"Build your first webpage from scratch!"*
- Visual tag builder
- Live code playground
- Create an "About Me" page

### 🎨 Adventure 3: CSS Artist (25 min)
*"Make your webpage beautiful with colors and styles!"*
- Color picker experiments
- Live style previews
- Customize your creation

### ⚡ Adventure 4: JavaScript Wizard (20 min)
*"Make things HAPPEN with code!"*
- Interactive button creator
- Simple animations
- Add magic to your page

### 🤖 Adventure 5: AI Explorer (15 min) — BONUS
*"Peek into the future of coding!"*
- What is AI?
- How AI helps coders
- Imagination station

---

## 📸 Screenshots

<table>
<tr>
<td width="50%">

### Home Page Adventure Map
![Home Page](docs/assets/images/screenshots/home-preview.png)
*Students navigate through adventures with a visual map*

</td>
<td width="50%">

### Interactive Code Playground
![Code Playground](docs/assets/images/screenshots/playground-preview.png)
*Type code on the left, see results instantly on the right*

</td>
</tr>
<tr>
<td width="50%">

### Step-by-Step Instructions
![Instructions](docs/assets/images/screenshots/instructions-preview.png)
*Clear, numbered steps with visual checkpoints*

</td>
<td width="50%">

### Achievement System
![Achievements](docs/assets/images/screenshots/achievements-preview.png)
*Earn stars and badges for completing challenges*

</td>
</tr>
</table>

---

## 🚀 Quick Start

### For Students
1. Open your browser (Chrome works best!)
2. Go to: **[tech-explorers.vercel.app](https://tech-explorers.vercel.app)** *(or your custom URL)*
3. Click "Start Your Adventure!" 🎉

### For Teachers
1. **Before Class**: Bookmark the site on student Chromebooks
2. **During Class**: Use the [Teacher Guide](docs/teacher/guide.html) for facilitation tips
3. **After Class**: Share the URL so students can continue at home!

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ (for local development)
- A code editor (VS Code recommended)
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/garcia-lab/tech-explorers.git
cd tech-explorers

# Install dependencies (for development tools only)
npm install

# Start local development server
npm run dev

# Open in browser
# Navigate to http://localhost:3000
```

### GitHub Codespaces (Recommended)

Click the button below to open in GitHub Codespaces—no local setup required!

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/garcia-lab/tech-explorers)

---

## 📁 Project Structure

```
tech-explorers/
├── 📂 docs/                    # Main website (deployed to Vercel)
│   ├── 📄 index.html           # Home page with adventure map
│   ├── 📂 adventures/          # Learning modules
│   │   ├── 01-meet-the-computer/
│   │   ├── 02-html-hero/
│   │   ├── 03-css-artist/
│   │   ├── 04-javascript-wizard/
│   │   └── 05-ai-explorer/
│   ├── 📂 playground/          # Interactive code sandboxes
│   ├── 📂 teacher/             # Teacher resources
│   └── 📂 assets/              # CSS, JS, images
├── 📂 exercises/               # Legacy exercise files (reference)
├── 📂 .devcontainer/           # GitHub Codespaces config
├── 📄 vercel.json              # Deployment configuration
└── 📄 README.md                # You are here!
```

---

## 🎨 Design Principles

### Colors That Pop! 🌈
Our color palette is designed to be exciting yet easy on young eyes:

| Color | Hex | Usage |
|-------|-----|-------|
| 💙 **Blue** | `#4361ee` | Primary actions, links |
| 💜 **Purple** | `#7209b7` | Headers, magic elements |
| 💗 **Pink** | `#f72585` | Excitement, celebrations |
| 💚 **Green** | `#06d6a0` | Success, correct answers |
| 💛 **Yellow** | `#ffd166` | Hints, warnings |

### Writing for Kids ✏️
- **Short sentences** (max 15 words)
- **Active voice** ("Click the button" not "The button should be clicked")
- **Encouraging tone** ("Great job!" "You're doing amazing!")
- **One action per step**

---

## 👩‍🏫 Teacher Guide

### Preparing Your Classroom

1. **Test the site** on student Chromebooks beforehand
2. **Bookmark the URL** on each device
3. **Print the troubleshooting guide** (optional)
4. **Review the curriculum** to anticipate questions

### During the Session

| Time | Activity | Teacher Role |
|------|----------|--------------|
| 0:00-0:10 | Welcome & Setup | Help students find the site |
| 0:10-0:30 | Adventure 1 | Circulate, answer questions |
| 0:30-1:00 | Adventure 2 | Assist with HTML playground |
| 1:00-1:10 | Break | Stretch! |
| 1:10-1:35 | Adventure 3 | Help with CSS experiments |
| 1:35-1:55 | Adventure 4 | Guide JavaScript activities |
| 1:55-2:00 | Wrap-up | Celebrate achievements! |

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "It's not working!" | Check for typos, use the Reset button |
| "I finished early!" | Direct to Bonus Challenges |
| "I'm confused" | Use the built-in Hint button first |
| "My page looks weird" | Compare with the example, check brackets |

---

## 🚢 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments!

### GitHub Pages (Alternative)

The `docs/` folder can also be deployed to GitHub Pages:
1. Go to repository Settings → Pages
2. Set source to "Deploy from a branch"
3. Select `main` branch, `/docs` folder
4. Save and wait for deployment

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Content Contributions
- Fix typos or confusing instructions
- Add new challenges
- Improve explanations
- Add translations

### Technical Contributions
- Bug fixes
- Accessibility improvements
- Performance optimizations
- New interactive features

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-improvement`)
3. Make your changes
4. Test on a Chromebook if possible
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📊 Curriculum Alignment

This curriculum supports several educational standards:

- **CSTA K-12 Computer Science Standards**
- **ISTE Standards for Students**
- **Common Core (ELA for technical writing)**

---

## 📝 License

This project is licensed under the MIT License—see the [LICENSE](LICENSE) file for details.

---

## 💖 Acknowledgments

- Inspired by the amazing work of [Scratch](https://scratch.mit.edu/), [Code.org](https://code.org/), and countless educators
- Built with love for the next generation of technologists
- Special thanks to all the young testers who provided feedback!

---

<div align="center">

### 🌟 Ready to Start Your Adventure? 🌟

**[Launch Tech Explorers →](https://tech-explorers.vercel.app)**

*Created with ❤️ to inspire young coders everywhere!*

</div>