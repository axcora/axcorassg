#!/usr/bin/env node

/**
 * Quick Setup - Emergency Fix for Dependencies
 */

import {
    execSync
} from 'child_process';
import chalk from 'chalk';

console.log(chalk.cyan.bold(`
🚨 QUICK SETUP - EMERGENCY FIX
=============================
Installing missing dependencies...
`));

const dependencies = [
    'clean-css',
    'chokidar-cli',
    'stylelint',
    'stylelint-config-standard'
];

for (const dep of dependencies) {
    try {
        console.log(`📦 Installing ${dep}...`);
        execSync(`npm install ${dep} --save-dev`, {
            stdio: 'inherit'
        });
        console.log(chalk.green(`✅ ${dep} installed successfully`));
    } catch (error) {
        console.log(chalk.yellow(`⚠️  Failed to install ${dep}, continuing...`));
    }
}

console.log(chalk.green.bold(`
🎉 QUICK SETUP COMPLETED!
========================
Now try running:
npm run complete-setup
`));