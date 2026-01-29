#!/usr/bin/env node
/**
 * Fast Link Checker for Tech Explorers
 * 
 * Checks all internal links in HTML files without needing a browser.
 * Much faster than the Puppeteer tests for CI/CD pipelines.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

// Colors for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(color, ...args) {
    console.log(color, ...args, colors.reset);
}

// Collect all HTML files
function getAllHtmlFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllHtmlFiles(fullPath, files);
        } else if (item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    return files;
}

// Extract links from HTML file
function extractLinks(htmlFile) {
    const content = fs.readFileSync(htmlFile, 'utf-8');
    const dom = new JSDOM(content);
    const document = dom.window.document;
    
    const links = [];
    
    // Get all anchor tags
    document.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (href && 
            !href.startsWith('http://') && 
            !href.startsWith('https://') && 
            !href.startsWith('#') && 
            !href.startsWith('javascript:') &&
            !href.startsWith('mailto:') &&
            !href.startsWith('tel:') &&
            !href.startsWith('data:')) {
            links.push({ type: 'link', href, element: 'a' });
        }
    });

    // Get CSS links
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
            links.push({ type: 'css', href, element: 'link' });
        }
    });

    // Get JS scripts
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src');
        if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
            links.push({ type: 'js', href: src, element: 'script' });
        }
    });

    // Get images
    document.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:')) {
            links.push({ type: 'image', href: src, element: 'img' });
        }
    });

    return links;
}

// Resolve a relative path from a source file
function resolveLink(sourceFile, href) {
    const sourceDir = path.dirname(sourceFile);
    
    // Handle query strings and fragments
    const cleanHref = href.split('?')[0].split('#')[0];
    
    if (!cleanHref) return null; // Just a fragment like "#section"
    
    const resolvedPath = path.resolve(sourceDir, cleanHref);
    return resolvedPath;
}

// Check if a file exists
function fileExists(filePath) {
    try {
        // Check if it's a directory with index.html
        if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                return fs.existsSync(path.join(filePath, 'index.html'));
            }
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

// Main checker
function checkAllLinks() {
    log(colors.cyan, '\n🔍 Tech Explorers Link Checker\n');
    log(colors.cyan, '='.repeat(60));

    const htmlFiles = getAllHtmlFiles(DOCS_DIR);
    log(colors.blue, `\n📄 Found ${htmlFiles.length} HTML files\n`);

    const brokenLinks = [];
    const allLinks = new Set();
    let totalLinks = 0;

    for (const file of htmlFiles) {
        const relativePath = path.relative(DOCS_DIR, file);
        const links = extractLinks(file);
        
        for (const link of links) {
            totalLinks++;
            const resolvedPath = resolveLink(file, link.href);
            
            if (!resolvedPath) continue;
            
            const linkKey = `${relativePath}|${link.href}`;
            if (allLinks.has(linkKey)) continue;
            allLinks.add(linkKey);

            if (!fileExists(resolvedPath)) {
                brokenLinks.push({
                    source: relativePath,
                    href: link.href,
                    type: link.type,
                    resolvedPath: path.relative(DOCS_DIR, resolvedPath)
                });
            }
        }
    }

    // Print results
    log(colors.cyan, '\n' + '='.repeat(60));
    log(colors.cyan, '📊 RESULTS\n');

    log(colors.green, `✅ Total links checked: ${totalLinks}`);
    log(colors.green, `✅ HTML files checked: ${htmlFiles.length}`);
    
    if (brokenLinks.length === 0) {
        log(colors.green, '\n🎉 No broken links found!\n');
        return { success: true, brokenLinks: [] };
    }

    log(colors.red, `\n❌ BROKEN LINKS FOUND: ${brokenLinks.length}\n`);
    
    // Group by source file
    const groupedBySource = {};
    for (const link of brokenLinks) {
        if (!groupedBySource[link.source]) {
            groupedBySource[link.source] = [];
        }
        groupedBySource[link.source].push(link);
    }

    for (const [source, links] of Object.entries(groupedBySource)) {
        log(colors.yellow, `\n📄 ${source}`);
        for (const link of links) {
            log(colors.red, `   ❌ [${link.type}] ${link.href}`);
            log(colors.cyan, `      → Expected: ${link.resolvedPath}`);
        }
    }

    log(colors.red, '\n' + '='.repeat(60));
    log(colors.red, '❌ LINK CHECK FAILED\n');
    
    return { success: false, brokenLinks };
}

// Run if executed directly
if (require.main === module) {
    // Install jsdom if not present
    try {
        require('jsdom');
    } catch {
        console.log('Installing jsdom...');
        require('child_process').execSync('npm install jsdom', { 
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit' 
        });
    }
    
    const result = checkAllLinks();
    process.exit(result.success ? 0 : 1);
}

module.exports = { checkAllLinks, getAllHtmlFiles, extractLinks };
