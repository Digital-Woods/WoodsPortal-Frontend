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


// import fs from 'fs';
// import path from 'path';

// const srcDir = path.resolve('./src');
// const tempDir = path.resolve('./temp');

// if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// // Prefix all classes inside a string, but skip JS operators
// function prefixClassString(str) {
//   // Match words inside quotes (single or double) only
//   return str.replace(/(['"])(.*?)\1/g, (_, quote, inner) => {
//     const prefixed = inner
//       .split(/\s+/)
//       .filter(Boolean)
//       .map(cls => `tw:${cls}`)
//       .join(' ');
//     return `${quote}${prefixed}${quote}`;
//   });
// }

// // Handle className
// function prefixClassesInCode(code) {
//   // 1️⃣ Plain string className="..."
//   code = code.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
//     const prefixed = classStr
//       .split(/\s+/)
//       .filter(Boolean)
//       .map(cls => `tw:${cls}`)
//       .join(' ');
//     return `className="${prefixed}"`;
//   });

//   // 2️⃣ Template literal className={`...`}
//   code = code.replace(/className\s*=\s*{\s*`([^`]*)`\s*}/g, (_, classStr) => {
//     // Only prefix strings inside quotes; leave JS operators (${ } ? :) untouched
//     const newStr = prefixClassString(classStr);
//     return `className={\`${newStr}\`}`;
//   });

//   return code;
// }

// // Recursively copy files
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
// console.log('✅ Prefixed classNames generated in temp/');



import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('./src');
const tempDir = path.resolve('./temp');

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

function addPrefix(token) {
  if (!token) return token;
  if (token.startsWith('tw:')) return token;
  return `tw:${token}`;
}

function prefixStaticClasses(str) {
  // Prefix whitespace-separated class tokens (outside ${ ... })
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map(addPrefix)
    .join(' ');
}

// Prefix classes inside quoted strings ONLY, e.g. "...${cond ? 'lg:w-[...]' : 'lg:w-[...]'}..."
function prefixQuotedStringsInExpression(expr) {
  // Replace '..."' or '...' with prefixed contents
  return expr.replace(/(['"])((?:\\.|(?!\1).)*)\1/g, (_, quote, inner) => {
    return `${quote}${prefixStaticClasses(inner)}${quote}`;
  });
}

// Handle className
function prefixClassesInCode(code) {
  // 1) Plain string: className="..."
  code = code.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
    return `className="${prefixStaticClasses(classStr)}"`;
  });

  // 2) Template literal: className={`...`}
  // Use [\s\S]*? (non-greedy) so we can handle newlines and avoid over-capturing.
  code = code.replace(/className\s*=\s*{\s*`([\s\S]*?)`\s*}/g, (_, tplBody) => {
    // Split into static vs dynamic parts: keep the ${...} delimiters
    const parts = tplBody.split(/(\$\{[\s\S]*?\})/g);

    // const rebuilt = parts
    //   .map((part) => {
    //     if (part.startsWith('${')) {
    //       // Only prefix quoted strings inside the JS expression
    //       return part.replace(
    //         /^\$\{([\s\S]*?)\}$/,
    //         (_m, inner) => '${' + prefixQuotedStringsInExpression(inner) + '}'
    //       );
    //     }
    //     // Static chunk: prefix all classes
    //     return prefixStaticClasses(part);
    //   })
    //   .join('');
    
    const rebuilt = parts
    .map((part) => {
      if (part.startsWith('${')) {
        // Ensure a leading space before expression if previous static didn’t end with one
        return ' ' + part.replace(
          /^\$\{([\s\S]*?)\}$/,
          (_m, inner) => '${' + prefixQuotedStringsInExpression(inner) + '}'
        );
      }
      return prefixStaticClasses(part);
    })
    .join('');

      return `className={\`${rebuilt}\`}`;
    });


    // 3️⃣ Variables with "DynamicClassName"
    code = code.replace(
      /(const|let|var)\s+([A-Za-z0-9_]*DynamicClassName[A-Za-z0-9_]*)\s*=\s*([^;]+);/g,
      (match, decl, varName, value) => {
        // 1) If it's an object literal
        if (/^{[\s\S]*}$/.test(value.trim())) {
          const transformed = value.replace(/["'`](.*?)["'`]/g, (m, cls) => {
            return `"${prefixStaticClasses(cls)}"`;
          });
          return `${decl} ${varName} = ${transformed};`;
        }

        // 2) If it's a ternary or plain string
        if (/\?.*:/.test(value)) {
          // Handle ternary string parts
          const transformed = value.replace(/["'`](.*?)["'`]/g, (m, cls) => {
            return `"${prefixStaticClasses(cls)}"`;
          });
          return `${decl} ${varName} = ${transformed};`;
        }

        // 3) If it's just a normal string
        if (/^["'`].*["'`]$/.test(value.trim())) {
          const cls = value.trim().slice(1, -1);
          return `${decl} ${varName} = "${prefixStaticClasses(cls)}";`;
        }

        return match; // fallback
      }
    );
  return code;
}

// Recursively copy files and rewrite .tsx/.jsx
function copyAndPrefixFiles(dir, outDir) {
  fs.readdirSync(dir).forEach((file) => {
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
