// import fs from 'fs';
// import path from 'path';

// const srcDir = path.resolve('./src');
// const tempDir = path.resolve('./temp');

// if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// function prefixClassesInCode(code) {
//     const tailwindClassRegex = /\b(?:bg|text|font|flex|grid|gap|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|space|w|min-w|max-w|h|min-h|max-h|border|rounded|shadow|justify|items|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate|skew|order|float|clear|object|overflow|overscroll|container|block|inline|hidden|align|content|place|self|place-self|place-items|place-content|tracking|leading|list|placeholder|uppercase|lowercase|capitalize|normal-case|from|via|to|bg-gradient|bg-clip|bg-origin|mix-blend|bg-blend|filter|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|transform|duration|ease|delay|fill|stroke|stroke-width|sr-only|not-sr-only)(?:-[\w\[\]\(\)#/%.:]+)?\b/g;
//   return code.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
//     const newClasses = classStr.replace(tailwindClassRegex, (match) => `tw:${match}`);
//     return `className="${newClasses}"`;
//   });
// }

// function copyAndPrefixFiles(dir, outDir) {
//   fs.readdirSync(dir).forEach(file => {
//     const fullPath = path.join(dir, file);
//     const outPath = path.join(outDir, file);
//     const stats = fs.statSync(fullPath);
//     if (stats.isDirectory()) {
//       if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);
//       copyAndPrefixFiles(fullPath, outPath);
//     } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
//       const code = fs.readFileSync(fullPath, 'utf-8');
//       fs.writeFileSync(outPath, prefixClassesInCode(code));
//     } else {
//       fs.copyFileSync(fullPath, outPath);
//     }
//   });
// }

// copyAndPrefixFiles(srcDir, tempDir);
// console.log('✅ Prefixed TSX files generated in temp/');


import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('./src');
const tempDir = path.resolve('./temp');

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Prefix all classes inside a string, but skip JS operators
function prefixClassString(str) {
  // Match words inside quotes (single or double) only
  return str.replace(/(['"])(.*?)\1/g, (_, quote, inner) => {
    const prefixed = inner
      .split(/\s+/)
      .filter(Boolean)
      .map(cls => `tw:${cls}`)
      .join(' ');
    return `${quote}${prefixed}${quote}`;
  });
}

// Handle className
function prefixClassesInCode(code) {
  // 1️⃣ Plain string className="..."
  code = code.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
    const prefixed = classStr
      .split(/\s+/)
      .filter(Boolean)
      .map(cls => `tw:${cls}`)
      .join(' ');
    return `className="${prefixed}"`;
  });

  // 2️⃣ Template literal className={`...`}
  code = code.replace(/className\s*=\s*{\s*`([^`]*)`\s*}/g, (_, classStr) => {
    // Only prefix strings inside quotes; leave JS operators (${ } ? :) untouched
    const newStr = prefixClassString(classStr);
    return `className={\`${newStr}\`}`;
  });

  return code;
}

// Recursively copy files
function copyAndPrefixFiles(dir, outDir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const outPath = path.join(outDir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);
      copyAndPrefixFiles(fullPath, outPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const code = fs.readFileSync(fullPath, 'utf-8');
      fs.writeFileSync(outPath, prefixClassesInCode(code));
    } else {
      fs.copyFileSync(fullPath, outPath);
    }
  });
}

copyAndPrefixFiles(srcDir, tempDir);
console.log('✅ Prefixed classNames generated in temp/');
