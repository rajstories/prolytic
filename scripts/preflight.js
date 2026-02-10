#!/usr/bin/env node

/**
 * Pre-flight check for Prolytic Hackathon Demo
 * Run this before starting your demo to verify everything is configured
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config();

const checks = [];

// Check 1: API Key
const hasApiKey = !!(
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY ||
  process.env.GOOGLE_API_KEY
);

checks.push({
  name: 'Gemini API Key',
  status: hasApiKey ? 'PASS' : 'FAIL',
  message: hasApiKey
    ? '✅ API key found'
    : '❌ Missing GEMINI_API_KEY in .env.local'
});

// Check 2: .env.local exists
const hasEnvFile = existsSync(resolve(process.cwd(), '.env.local'));
checks.push({
  name: 'Environment File',
  status: hasEnvFile ? 'PASS' : 'WARN',
  message: hasEnvFile
    ? '✅ .env.local exists'
    : '⚠️  .env.local not found (create one with GEMINI_API_KEY)'
});

// Check 3: Node modules
const hasNodeModules = existsSync(resolve(process.cwd(), 'node_modules'));
checks.push({
  name: 'Dependencies',
  status: hasNodeModules ? 'PASS' : 'FAIL',
  message: hasNodeModules
    ? '✅ node_modules installed'
    : '❌ Run "npm install" first'
});

// Check 4: Port availability (optional)
checks.push({
  name: 'Port Configuration',
  status: 'INFO',
  message: `ℹ️  Backend will run on port ${process.env.PORT || '8080'}, Frontend on 3000`
});

// Print results
console.log('\n🚀 Prolytic Pre-Flight Check\n');
console.log('─'.repeat(60));

let hasFailures = false;
checks.forEach(check => {
  console.log(`${check.name.padEnd(25)} ${check.message}`);
  if (check.status === 'FAIL') hasFailures = true;
});

console.log('─'.repeat(60));

if (hasFailures) {
  console.log('\n❌ Pre-flight check FAILED. Fix the issues above before starting.\n');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed! Ready to start:\n');
  console.log('   Terminal 1: npm run dev:api');
  console.log('   Terminal 2: npm run dev\n');
  console.log('   Then open: http://localhost:3000\n');
  process.exit(0);
}
