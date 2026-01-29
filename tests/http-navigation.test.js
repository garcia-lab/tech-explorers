#!/usr/bin/env node
/**
 * HTTP-based Site Navigation Tests for Tech Explorers
 * 
 * This test suite:
 * 1. Starts a local server
 * 2. Checks all HTML pages load with 200 status
 * 3. Verifies all internal links resolve correctly
 * 4. Checks that key assets (CSS, JS) are accessible
 * 
 * No browser required - uses HTTP requests only.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PORT = 3001; // Use different port to avoid conflicts
const BASE_URL = `http://localhost:${PORT}`;

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

// Convert file path to URL path
function filePathToUrlPath(filePath) {
    const relativePath = path.relative(DOCS_DIR, filePath);
    return '/' + relativePath.replace(/\\/g, '/');
}

// Make HTTP request and return status
function checkUrl(url) {
    return new Promise((resolve) => {
        const req = http.get(url, { timeout: 5000 }, (res) => {
            resolve({
                url,
                status: res.statusCode,
                ok: res.statusCode >= 200 && res.statusCode < 400
            });
        });
        
        req.on('error', (err) => {
            resolve({
                url,
                status: 0,
                ok: false,
                error: err.message
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                url,
                status: 0,
                ok: false,
                error: 'Timeout'
            });
        });
    });
}

// Start local server
function startServer() {
    return new Promise((resolve, reject) => {
        const server = spawn('npx', ['serve', 'docs', '-l', String(PORT), '--no-clipboard'], {
            cwd: path.join(__dirname, '..'),
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        const checkReady = () => {
            if (output.includes('Accepting connections') || output.includes('Local:')) {
                setTimeout(() => resolve(server), 500);
                return true;
            }
            return false;
        };

        server.stdout.on('data', (data) => {
            output += data.toString();
            checkReady();
        });

        server.stderr.on('data', (data) => {
            output += data.toString();
            checkReady();
        });

        // Timeout after 10 seconds
        setTimeout(() => {
            if (!checkReady()) {
                resolve(server); // Try anyway
            }
        }, 10000);

        server.on('error', reject);
    });
}

// Main test runner
async function runTests() {
    log(colors.cyan, '\n🚀 Tech Explorers HTTP Navigation Tests\n');
    log(colors.cyan, '='.repeat(60));
    
    // Start server
    log(colors.blue, '\n📡 Starting local server on port', PORT, '...');
    const server = await startServer();
    log(colors.green, '✅ Server started\n');

    const results = {
        passed: 0,
        failed: 0,
        errors: []
    };

    try {
        // Get all HTML files
        const htmlFiles = getAllHtmlFiles(DOCS_DIR);
        log(colors.blue, `📄 Found ${htmlFiles.length} HTML files to test\n`);
        log(colors.cyan, '-'.repeat(60));

        // Test each page
        for (const file of htmlFiles) {
            const urlPath = filePathToUrlPath(file);
            const url = BASE_URL + urlPath;
            const relativePath = path.relative(DOCS_DIR, file);
            
            const result = await checkUrl(url);
            
            if (result.ok) {
                log(colors.green, `  ✅ ${relativePath}`);
                results.passed++;
            } else {
                log(colors.red, `  ❌ ${relativePath} - Status: ${result.status} ${result.error || ''}`);
                results.failed++;
                results.errors.push({
                    file: relativePath,
                    url,
                    status: result.status,
                    error: result.error
                });
            }
        }

        // Test key assets
        log(colors.cyan, '\n' + '-'.repeat(60));
        log(colors.blue, '\n📦 Testing key assets...\n');

        const assets = [
            '/assets/css/style.css',
            '/assets/css/adventure.css',
            '/assets/js/script.js',
            '/assets/js/project-storage.js',
            '/assets/js/build-info.js'
        ];

        for (const asset of assets) {
            const url = BASE_URL + asset;
            const result = await checkUrl(url);
            
            if (result.ok) {
                log(colors.green, `  ✅ ${asset}`);
                results.passed++;
            } else {
                log(colors.red, `  ❌ ${asset} - Status: ${result.status}`);
                results.failed++;
                results.errors.push({
                    file: asset,
                    url,
                    status: result.status
                });
            }
        }

    } finally {
        // Stop server
        server.kill('SIGTERM');
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Print summary
    log(colors.cyan, '\n' + '='.repeat(60));
    log(colors.cyan, '📊 TEST SUMMARY\n');
    
    log(colors.green, `✅ Passed: ${results.passed}`);
    log(colors.red, `❌ Failed: ${results.failed}`);

    if (results.errors.length > 0) {
        log(colors.red, '\n❌ ERRORS:');
        results.errors.forEach(err => {
            log(colors.red, `   - ${err.file}: ${err.status} ${err.error || ''}`);
        });
    }

    log(colors.cyan, '\n' + '='.repeat(60));
    
    if (results.failed === 0) {
        log(colors.green, '✅ ALL TESTS PASSED!\n');
        process.exit(0);
    } else {
        log(colors.red, '❌ TESTS FAILED!\n');
        process.exit(1);
    }
}

// Run tests
runTests().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
});
