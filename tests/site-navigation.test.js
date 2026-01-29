/**
 * Tech Explorers Site Navigation Tests
 * 
 * These tests verify that:
 * 1. All pages load successfully (no 404s)
 * 2. All internal links are valid
 * 3. All navigation elements work
 * 4. CSS and JS assets load correctly
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';
const DOCS_DIR = path.join(__dirname, '..', 'docs');

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

// Convert file path to URL
function filePathToUrl(filePath) {
    const relativePath = path.relative(DOCS_DIR, filePath);
    return `${BASE_URL}/${relativePath}`;
}

// Test results collector
const testResults = {
    passed: [],
    failed: [],
    warnings: []
};

let browser;
let server;

async function startServer() {
    return new Promise((resolve, reject) => {
        server = spawn('npx', ['serve', 'docs', '-l', '3000'], {
            cwd: path.join(__dirname, '..'),
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let output = '';
        server.stdout.on('data', (data) => {
            output += data.toString();
            if (output.includes('Accepting connections') || output.includes('Local:')) {
                setTimeout(resolve, 1000); // Give it a moment to fully start
            }
        });

        server.stderr.on('data', (data) => {
            output += data.toString();
            if (output.includes('Accepting connections') || output.includes('Local:')) {
                setTimeout(resolve, 1000);
            }
        });

        // Timeout after 15 seconds
        setTimeout(() => {
            if (!output.includes('Accepting connections') && !output.includes('Local:')) {
                resolve(); // Try anyway
            }
        }, 15000);

        server.on('error', reject);
    });
}

async function stopServer() {
    if (server) {
        server.kill('SIGTERM');
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Test a single page
async function testPage(url, page) {
    const results = {
        url,
        status: null,
        brokenLinks: [],
        missingAssets: [],
        errors: []
    };

    const failedRequests = [];
    
    // Listen for failed requests
    const requestHandler = request => {
        if (request.failure()) {
            failedRequests.push({
                url: request.url(),
                error: request.failure().errorText
            });
        }
    };

    const responseHandler = response => {
        const status = response.status();
        const responseUrl = response.url();
        
        // Track 404s for local resources
        if (status === 404 && responseUrl.startsWith(BASE_URL)) {
            results.missingAssets.push(responseUrl);
        }
    };

    page.on('requestfailed', requestHandler);
    page.on('response', responseHandler);

    try {
        const response = await page.goto(url, { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        results.status = response.status();

        if (results.status === 404) {
            results.errors.push(`Page returned 404`);
            return results;
        }

        // Extract all internal links
        const links = await page.evaluate((baseUrl) => {
            const anchors = document.querySelectorAll('a[href]');
            const hrefs = [];
            anchors.forEach(a => {
                const href = a.getAttribute('href');
                // Skip external links, anchors, javascript, and mailto
                if (href && 
                    !href.startsWith('http://') && 
                    !href.startsWith('https://') && 
                    !href.startsWith('#') && 
                    !href.startsWith('javascript:') &&
                    !href.startsWith('mailto:') &&
                    !href.startsWith('tel:')) {
                    hrefs.push(href);
                }
            });
            return hrefs;
        }, BASE_URL);

        // Check local asset references (CSS, JS, images)
        const assets = await page.evaluate(() => {
            const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                .map(l => l.getAttribute('href'))
                .filter(h => h && !h.startsWith('http'));
            
            const scripts = Array.from(document.querySelectorAll('script[src]'))
                .map(s => s.getAttribute('src'))
                .filter(h => h && !h.startsWith('http'));
            
            const images = Array.from(document.querySelectorAll('img[src]'))
                .map(i => i.getAttribute('src'))
                .filter(h => h && !h.startsWith('http') && !h.startsWith('data:'));

            return { cssLinks, scripts, images };
        });

        // Store links for later verification
        results.internalLinks = links;
        results.assets = assets;

    } catch (error) {
        results.errors.push(error.message);
    } finally {
        page.off('requestfailed', requestHandler);
        page.off('response', responseHandler);
    }

    return results;
}

// Verify a link resolves correctly
async function verifyLink(fromUrl, linkHref, page) {
    // Resolve relative URL
    let absoluteUrl;
    try {
        absoluteUrl = new URL(linkHref, fromUrl).href;
    } catch (e) {
        return { valid: false, error: `Invalid URL: ${linkHref}` };
    }

    // Only check internal links
    if (!absoluteUrl.startsWith(BASE_URL)) {
        return { valid: true, skipped: true };
    }

    try {
        const response = await page.goto(absoluteUrl, { 
            waitUntil: 'domcontentloaded',
            timeout: 10000 
        });
        
        if (response.status() === 404) {
            return { valid: false, error: `404 Not Found`, url: absoluteUrl };
        }
        
        return { valid: true, status: response.status() };
    } catch (error) {
        return { valid: false, error: error.message, url: absoluteUrl };
    }
}

// Main test runner
async function runTests() {
    console.log('🚀 Tech Explorers Site Navigation Tests\n');
    console.log('=' .repeat(60));
    
    // Start server
    console.log('\n📡 Starting local server...');
    await startServer();
    console.log('✅ Server started on port 3000\n');

    // Launch browser
    browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Collect all HTML files
    const htmlFiles = getAllHtmlFiles(DOCS_DIR);
    console.log(`📄 Found ${htmlFiles.length} HTML files to test\n`);
    
    const allBrokenLinks = new Map(); // Track unique broken links
    const allMissingAssets = new Set();
    const pageErrors = [];

    // Phase 1: Test each page loads
    console.log('📋 Phase 1: Testing Page Loading\n');
    console.log('-'.repeat(60));
    
    for (const file of htmlFiles) {
        const url = filePathToUrl(file);
        const relativePath = path.relative(DOCS_DIR, file);
        
        process.stdout.write(`  Testing: ${relativePath.padEnd(50)}`);
        
        const result = await testPage(url, page);
        
        if (result.status === 200) {
            console.log('✅ OK');
            testResults.passed.push({ file: relativePath, url });
        } else if (result.status === 404) {
            console.log('❌ 404 NOT FOUND');
            testResults.failed.push({ 
                file: relativePath, 
                url, 
                error: 'Page not found (404)' 
            });
            pageErrors.push({ file: relativePath, error: '404' });
        } else {
            console.log(`⚠️  Status: ${result.status}`);
            testResults.warnings.push({ 
                file: relativePath, 
                url, 
                status: result.status 
            });
        }

        // Track missing assets
        result.missingAssets?.forEach(asset => allMissingAssets.add(asset));
    }

    // Phase 2: Verify all internal links
    console.log('\n\n📋 Phase 2: Verifying Internal Links\n');
    console.log('-'.repeat(60));

    const checkedLinks = new Set();
    
    for (const file of htmlFiles) {
        const url = filePathToUrl(file);
        const relativePath = path.relative(DOCS_DIR, file);
        
        // Get page and extract links
        const result = await testPage(url, page);
        
        if (result.internalLinks && result.internalLinks.length > 0) {
            console.log(`\n  📄 ${relativePath} (${result.internalLinks.length} links)`);
            
            for (const link of result.internalLinks) {
                // Skip if we already checked this link from this page
                const linkKey = `${url}|${link}`;
                if (checkedLinks.has(linkKey)) continue;
                checkedLinks.add(linkKey);

                const linkResult = await verifyLink(url, link, page);
                
                if (!linkResult.valid && !linkResult.skipped) {
                    console.log(`     ❌ ${link} → ${linkResult.error}`);
                    
                    if (!allBrokenLinks.has(linkResult.url || link)) {
                        allBrokenLinks.set(linkResult.url || link, {
                            link,
                            error: linkResult.error,
                            foundOn: [relativePath]
                        });
                    } else {
                        allBrokenLinks.get(linkResult.url || link).foundOn.push(relativePath);
                    }
                }
            }
        }
    }

    // Close browser and server
    await browser.close();
    await stopServer();

    // Print Summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));

    console.log(`\n✅ Pages Loaded Successfully: ${testResults.passed.length}`);
    console.log(`❌ Pages Failed to Load: ${testResults.failed.length}`);
    console.log(`⚠️  Pages with Warnings: ${testResults.warnings.length}`);
    console.log(`🔗 Broken Internal Links: ${allBrokenLinks.size}`);
    console.log(`📦 Missing Assets: ${allMissingAssets.size}`);

    if (testResults.failed.length > 0) {
        console.log('\n❌ FAILED PAGES:');
        testResults.failed.forEach(f => {
            console.log(`   - ${f.file}: ${f.error}`);
        });
    }

    if (allBrokenLinks.size > 0) {
        console.log('\n❌ BROKEN LINKS:');
        allBrokenLinks.forEach((info, url) => {
            console.log(`   - ${info.link}`);
            console.log(`     Found on: ${info.foundOn.join(', ')}`);
            console.log(`     Error: ${info.error}`);
        });
    }

    if (allMissingAssets.size > 0) {
        console.log('\n⚠️  MISSING ASSETS:');
        allMissingAssets.forEach(asset => {
            console.log(`   - ${asset}`);
        });
    }

    // Exit with error code if there are failures
    const hasFailures = testResults.failed.length > 0 || allBrokenLinks.size > 0;
    
    console.log('\n' + '='.repeat(60));
    if (hasFailures) {
        console.log('❌ TESTS FAILED - Issues found that need fixing!');
        process.exit(1);
    } else {
        console.log('✅ ALL TESTS PASSED!');
        process.exit(0);
    }
}

// Run tests
runTests().catch(error => {
    console.error('Test runner error:', error);
    if (browser) browser.close();
    stopServer();
    process.exit(1);
});
