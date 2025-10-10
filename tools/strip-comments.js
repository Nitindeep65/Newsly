#!/usr/bin/env node
// Simple comment stripper for .js/.ts/.jsx/.tsx files
// Makes a .bak copy before modifying files. Use with caution.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.next' || ent.name === '.git') continue;
      walk(full);
    } else if (ent.isFile()) {
      if (exts.includes(path.extname(ent.name))) {
        stripFile(full);
      }
    }
  }
}

function stripFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const original = src;

  // Remove JSX comments: {/* ... */}
  src = src.replace(/\{\/\*[\s\S]*?\*\//g, '');

  // Remove block comments
  src = src.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove single-line comments, but avoid shebang and URLs
  src = src.replace(/(^|[^:\"'`])\/\/.*$/gm, (m, p1) => p1);

  if (src !== original) {
    fs.writeFileSync(filePath + '.bak', original, 'utf8');
    fs.writeFileSync(filePath, src, 'utf8');
    console.log('Stripped comments:', filePath);
  }
}

// Start from src
const targets = [path.join(root, 'src')];
for (const t of targets) {
  if (fs.existsSync(t)) walk(t);
}

console.log('Done. Backups created with .bak extension.');
