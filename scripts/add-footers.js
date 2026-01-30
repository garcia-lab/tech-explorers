const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, '../docs/games');
const files = fs.readdirSync(gamesDir).filter(f => f.endsWith('.html'));

const footer = `    <footer style="background: #1a1a2e; color: white; padding: 20px; text-align: center; margin-top: 40px;">
        <p style="margin: 0; opacity: 0.8;">Made with ❤️ by Tech Explorers | <a href="../index.html" style="color: #06d6a0;">Home</a> | <a href="../activities/all-activities.html" style="color: #06d6a0;">More Activities</a></p>
    </footer>
`;

let count = 0;
files.forEach(file => {
    const filePath = path.join(gamesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('<footer')) {
        content = content.replace('</body>', footer + '</body>');
        fs.writeFileSync(filePath, content);
        count++;
        console.log('Added footer to', file);
    } else {
        console.log('Skipped', file, '(already has footer)');
    }
});
console.log('\nTotal files updated:', count);
