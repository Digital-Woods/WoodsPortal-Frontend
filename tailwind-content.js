
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
  code = code.replace(/className\s*=\s*{\s*`([\s\S]*?)`\s*}/g, (_, tplBody) => {
    const parts = tplBody.split(/(\$\{[\s\S]*?\})/g);

    const rebuilt = parts
      .map((part) => {
        if (part.startsWith('${')) {
          return part.replace(
            /^\$\{([\s\S]*?)\}$/,
            (_m, inner) => '${' + prefixQuotedStringsInExpression(inner) + '}'
          );
        }
        return prefixStaticClasses(part);
      })
      .join('');

    return `className={\`${rebuilt}\`}`;
  });

  // 3) Ternary expressions: className={cond ? "..." : "..."}
  code = code.replace(
    /className\s*=\s*{([^{};]+?\?[^:]+:[^}]+)}/g,
    (match, inner) => {
      const ternaryMatch = inner.match(/^(.*?\?)\s*(['"][^'"]*['"])\s*:\s*(['"][^'"]*['"])\s*$/);
      if (!ternaryMatch) return match;

      const [, condition, whenTrue, whenFalse] = ternaryMatch;
      const prefixedTrue = whenTrue.replace(/(['"])(.*?)\1/, (_, q, cls) => `${q}${prefixStaticClasses(cls)}${q}`);
      const prefixedFalse = whenFalse.replace(/(['"])(.*?)\1/, (_, q, cls) => `${q}${prefixStaticClasses(cls)}${q}`);

      return `className={${condition} ${prefixedTrue} : ${prefixedFalse}}`;
    }
  );

  // 4) Variables with "DynamicClassName"
  code = code.replace(
    /(const|let|var)\s+([A-Za-z0-9_]*DynamicClassName[A-Za-z0-9_]*)\s*=\s*([^;]+);/g,
    (match, decl, varName, value) => {
      if (/^{[\s\S]*}$/.test(value.trim())) {
        const transformed = value.replace(/["'`](.*?)["'`]/g, (m, cls) => {
          return `"${prefixStaticClasses(cls)}"`;
        });
        return `${decl} ${varName} = ${transformed};`;
      }
      if (/\?.*:/.test(value)) {
        const transformed = value.replace(/["'`](.*?)["'`]/g, (m, cls) => {
          return `"${prefixStaticClasses(cls)}"`;
        });
        return `${decl} ${varName} = ${transformed};`;
      }
      if (/^["'`].*["'`]$/.test(value.trim())) {
        const cls = value.trim().slice(1, -1);
        return `${decl} ${varName} = "${prefixStaticClasses(cls)}";`;
      }
      return match;
    }
  );

  // 5) Handle classNames(...) or clsx(...)
  code = code.replace(
    /className\s*=\s*{?\s*(classNames|clsx)\(([\s\S]*?)\)}?/g,
    (match, fnName, args) => {
      const transformedArgs = args.replace(/(['"])(.*?)\1/g, (_, q, cls) => {
        return `${q}${prefixStaticClasses(cls)}${q}`;
      });
      return `className={${fnName}(${transformedArgs})}`;
    }
  );

  return code;
}

const srcFiles = ['./src/routes/_auth/PreLogin.tsx', './src/routes/_auth/FinalLogin.tsx']; // your entry points

// export default function tailwindContent() {
//   const rawContent = srcFiles.map((filePath) => {
//   const code = fs.readFileSync(filePath, 'utf-8');
//     return  prefixClassesInCode(code)
//   });

//   return rawContent.map(code => ({
//     raw: rawContent.join("\n"),
//     extension: 'tsx', // or 'jsx' if needed
//   }));
// }

// export default async function tailwindContent() {
//   const files= [];

//   for await (const filePath of srcFiles) {
//     const code = fs.readFileSync(path.resolve(filePath), 'utf-8');
//     files.push({
//       raw: prefixClassesInCode(code),
//       extension: 'tsx',
//     });
//   }
//   return files;
// }


// export default function tailwindContent() {
//   return srcFiles.map((filePath) => {
//     const code = fs.readFileSync(path.resolve(filePath), 'utf-8');
//     return {
//       raw: prefixClassesInCode(code),
//       extension: 'tsx',
//     };
//   });
// }



// Pre-build static file for Tailwind
export default async function tailwindContent() {
  let allPrefixedClasses = '';

  for (const filePath of srcFiles) {
    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const transformed = prefixClassesInCode(code);
    allPrefixedClasses += transformed + '\n';
  }

  // Write to a static file Tailwind can read
  const outputPath = path.resolve('./.temp/tailwind-classes.tsx');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, allPrefixedClasses, 'utf-8');

  // Return the file as Tailwind content
  return [
    {
      raw: allPrefixedClasses,
      extension: 'tsx',
    },
  ];
}

tailwindContent()

// console.log('✅ All classNames prefixed!', tailwindContent());