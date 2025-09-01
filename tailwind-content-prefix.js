// // tailwind-content-prefix.js
// export default function tailwindContentPrefixPlugin() {
//     const tailwindClassRegex = /\b(bg|text|font|flex|grid|gap|p|m|w|h|border|rounded|shadow|justify|items|space|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate)-[\w-]+\b/g;

//   return {
//     name: 'tailwind-content-prefix',
//     // Configure the plugin to transform .tsx/.jsx files for Tailwind's content scanning
//     transform(code, id) {
//       if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
//         // Transform classes by adding tw: prefix
//         const transformedCode = code.replace(tailwindClassRegex, (match) => {
//           // Avoid double-prefixing if already tw:
//           if (match.startsWith('tw:')) return match;
//           return `tw:${match}`;
//         });
//         return {
//           code: transformedCode,
//           map: null,
//         };
//       }
//       return null;
//     },
//     // Configure Tailwind to use transformed content
//     config() {
//       return {
//         // Provide a virtual module for Tailwind to scan
//         optimizeDeps: {
//           include: ['tailwindcss'],
//         },
//       };
//     },
//   };
// }

// tailwind-content-prefix.js
// import { readFileSync } from 'fs';
// import { resolve } from 'path';

export default function tailwindContentPrefixPlugin() {
  // Updated regex to handle variants, arbitrary values, and custom classes
  const tailwindClassRegex = /\b(bg|text|font|flex|grid|gap|p|m|w|h|border|rounded|shadow|justify|items|space|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate)-[\w-]+\b/g;


  return {
    name: 'tailwind-content-prefix',
    enforce: 'pre', // Run before other plugins
    // Create a virtual module for Tailwind to scan
    resolveId(id) {
      if (id === 'virtual:tailwind-content') {
        return '\0virtual:tailwind-content';
      }
      return null;
    },

    load(id) {
        console.log("id", id)

      if (id === '\0virtual:tailwind-content') {
        // Simulate content by reading .tsx/.jsx files
        const fs = require('fs');
        const path = require('path');
        const contentFiles = ['./src/**/*.{tsx,jsx}'];
        let content = '';

        // Recursively find all .tsx/.jsx files
        const glob = require('fast-glob');
        console.log("glob", glob)
        const files = glob.sync(contentFiles, { absolute: true });
        for (const file of files) {
          const code = fs.readFileSync(file, 'utf-8');
          const transformedCode = code.replace(tailwindClassRegex, (match) => {
            if (match.startsWith('tw:')) return match; // Avoid double-prefixing
            return `tw:${match}`;
          });
          content += transformedCode + '\n';
        }

        return content;
      }
      return null;
    },
    // Transform .tsx/.jsx files for the build
    transform(code, id) {
      if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
        const transformedCode = code.replace(tailwindClassRegex, (match) => {
          if (match.startsWith('tw:')) return match;
          return `tw:${match}`;
        });
        return {
          code: transformedCode,
          map: null,
        };
      }
      return null;
    },
    // Configure Tailwind to use the virtual module
    config() {
      return {
        css: {
          transformer: 'lightningcss',
          content: ['virtual:tailwind-content'],
        },
      };
    },
  };
}