// scripts/smart-cli.js
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

async function checkIfNeedsRecompile() {
  const srcDir = path.join(__dirname, '../src');
  const distDir = path.join(__dirname, '../dist');
  
  try {
    const srcStat = await fs.promises.stat(srcDir);
    const distStat = await fs.promises.stat(distDir);
    
    return srcStat.mtime > distStat.mtime;
  } catch {
    return true; // If dist doesn't exist, need to compile
  }
}

async function smartBuild() {
  console.log('🔍 Checking if recompilation needed...');
  
  const needsRecompile = await checkIfNeedsRecompile();
  
  if (needsRecompile) {
    console.log('🔄 Source code changed, recompiling...');
    await execAsync('npm run compile');
    console.log('✅ Compilation complete');
  } else {
    console.log('✅ Using existing compiled version');
  }
  
  // Run the actual command
  const args = process.argv.slice(2);
  const command = `node dist/cli/index.js ${args.join(' ')}`;
  
  const { stdout, stderr } = await execAsync(command);
  console.log(stdout);
  if (stderr) console.error(stderr);
}

smartBuild().catch(console.error);
