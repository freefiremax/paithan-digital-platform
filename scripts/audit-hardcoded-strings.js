const fs = require('fs');
const path = require('path');

const scannedDirs = ['app', 'components'];
const results = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'tests') {
        scanDir(fullPath);
      }
    } else if (file.endsWith('.tsx')) {
      scanFile(fullPath);
    }
  }
}

// Patterns that indicate hardcoded strings in JSX
// e.g. >Text< or placeholder="Text" or aria-label="Text" where Text is English words and not using t(...) or variables
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Skip import lines, comments, console, className, type definitions, styles
    const trimmed = line.trim();
    if (
      trimmed.startsWith('import ') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('console.') ||
      trimmed.startsWith('const ') ||
      trimmed.startsWith('export ') ||
      trimmed.startsWith('interface ') ||
      trimmed.startsWith('type ')
    ) {
      return;
    }

    // Check for hardcoded raw text between JSX tags: >[A-Za-z ]+<
    const jsxTextMatches = line.match(/>([A-Za-z]{3,}[A-Za-z0-9 ,.?!'-]*)<\//g);
    if (jsxTextMatches) {
      jsxTextMatches.forEach((m) => {
        // Filter out safe words or code-like items
        const text = m.replace(/^>/, '').replace(/<\/$/, '').trim();
        if (
          !text.includes('{') &&
          !text.includes('}') &&
          !text.startsWith('http') &&
          text.length > 2 &&
          !['div', 'span', 'svg', 'path', 'button', 'select', 'option'].includes(text.toLowerCase())
        ) {
          results.push({
            file: filePath,
            line: index + 1,
            match: text,
            code: trimmed,
          });
        }
      });
    }
  });
}

scannedDirs.forEach(scanDir);

console.log(`\nAudit completed. Found ${results.length} potential hardcoded JSX strings:\n`);
results.forEach((r) => {
  console.log(`${r.file}:${r.line} -> "${r.match}"`);
});
