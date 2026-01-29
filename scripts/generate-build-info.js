/**
 * Build Info Generator
 * 
 * Generates a build-info.js file that contains:
 * - Git commit hash
 * - Build timestamp
 * - Environment info
 * 
 * This file is loaded by the site to display version information.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getBuildInfo() {
    const info = {
        gitCommit: 'unknown',
        gitCommitShort: 'unknown',
        gitBranch: 'unknown',
        buildTime: new Date().toISOString(),
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'
    };

    try {
        // Get git commit hash
        info.gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
        info.gitCommitShort = info.gitCommit.substring(0, 7);
        
        // Get branch name
        info.gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    } catch (error) {
        console.warn('Warning: Could not get git info:', error.message);
    }

    // Check for Vercel-specific environment variables
    if (process.env.VERCEL) {
        info.environment = process.env.VERCEL_ENV || 'preview';
        info.gitCommit = process.env.VERCEL_GIT_COMMIT_SHA || info.gitCommit;
        info.gitCommitShort = info.gitCommit.substring(0, 7);
        info.gitBranch = process.env.VERCEL_GIT_COMMIT_REF || info.gitBranch;
    }

    return info;
}

function generateBuildInfoFile() {
    const info = getBuildInfo();
    
    const content = `/**
 * Auto-generated build info
 * Generated at: ${info.buildTime}
 * DO NOT EDIT MANUALLY
 */
window.TECH_EXPLORERS_BUILD_INFO = {
    gitCommit: "${info.gitCommit}",
    gitCommitShort: "${info.gitCommitShort}",
    gitBranch: "${info.gitBranch}",
    buildTime: "${info.buildTime}",
    environment: "${info.environment}"
};

// Log build info to console for debugging
console.log('🚀 Tech Explorers Build Info:', window.TECH_EXPLORERS_BUILD_INFO);
`;

    const outputPath = path.join(__dirname, '..', 'docs', 'assets', 'js', 'build-info.js');
    fs.writeFileSync(outputPath, content);
    console.log(`✅ Generated build-info.js at ${outputPath}`);
    console.log(`   Commit: ${info.gitCommitShort}`);
    console.log(`   Branch: ${info.gitBranch}`);
    console.log(`   Environment: ${info.environment}`);
    
    return info;
}

// Run if executed directly
if (require.main === module) {
    generateBuildInfoFile();
}

module.exports = { getBuildInfo, generateBuildInfoFile };
