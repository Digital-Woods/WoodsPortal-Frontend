// // prefix-plugin.js
// // export default function tailwindPrefixPlugin() {
// //   // List of common Tailwind class patterns (customize as needed)
// //   const tailwindClassRegex = /\b(?:bg|text|font|flex|grid|gap|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|space|w|min-w|max-w|h|min-h|max-h|border|rounded|shadow|justify|items|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate|skew|order|float|clear|object|overflow|overscroll|container|block|inline|hidden|align|content|place|self|place-self|place-items|place-content|tracking|leading|list|placeholder|uppercase|lowercase|capitalize|normal-case|from|via|to|bg-gradient|bg-clip|bg-origin|mix-blend|bg-blend|filter|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|transform|duration|ease|delay|fill|stroke|stroke-width|sr-only|not-sr-only)(?:-[\w\[\]-]+)?\b/g;
// // //   const tailwindClassRegex = /\b([a-z]+:)?([a-z]+-)?[a-z0-9-]+(-[0-9]+|\[.*?\])?\b/g;

// //   return {
// //     name: 'tailwind-prefix',
// //     transform(code, id) {
// //       // Only process .tsx and .jsx files
// //       if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
// //         // Replace Tailwind classes with tw: prefixed versions
// //         const transformedCode = code.replace(tailwindClassRegex, (match) => `tw:${match}`);
// //         return {
// //           code: transformedCode,
// //           map: null, // Source maps not needed for this simple transform
// //         };
// //       }
// //       return null;
// //     },
// //   };
// // }

// // export default function tailwindPrefixPlugin() {
// //   const tailwindClassRegex = /\b(?:bg|text|font|flex|grid|gap|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|space|w|min-w|max-w|h|min-h|max-h|border|rounded|shadow|justify|items|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate|skew|order|float|clear|object|overflow|overscroll|container|block|inline|hidden|align|content|place|self|place-self|place-items|place-content|tracking|leading|list|placeholder|uppercase|lowercase|capitalize|normal-case|from|via|to|bg-gradient|bg-clip|bg-origin|mix-blend|bg-blend|filter|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|transform|duration|ease|delay|fill|stroke|stroke-width|sr-only|not-sr-only)(?:-[\w\[\]\(\)#/%.:]+)?\b/g;

// //   return {
// //     name: 'tailwind-prefix',
// //     enforce: 'pre',
// //     transform(code, id) {
// //       if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) return null;

// //       // Only replace inside className="" or className=''
// //       const transformedCode = code.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
// //         const newClasses = classStr.replace(tailwindClassRegex, (match) => `tw:${match}`);
// //         return `className="${newClasses}"`;
// //       });

// //       return {
// //         code: transformedCode,
// //         map: null,
// //       };
// //     },
// //   };
// // }

// // export default function tailwindPrefixPlugin() {
// //   const tailwindClassRegex = /\b(?:bg|text|font|flex|grid|gap|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|space|w|min-w|max-w|h|min-h|max-h|border|rounded|shadow|justify|items|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate|skew|order|float|clear|object|overflow|overscroll|container|block|inline|hidden|align|content|place|self|place-self|place-items|place-content|tracking|leading|list|placeholder|uppercase|lowercase|capitalize|normal-case|from|via|to|bg-gradient|bg-clip|bg-origin|mix-blend|bg-blend|filter|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|transform|duration|ease|delay|fill|stroke|stroke-width|sr-only|not-sr-only)(?:-[\w-]+)?\b/g;

// //   return {
// //     name: 'tailwind-prefix',
// //     enforce: 'pre',
// //     transform(code, id) {
// //       if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) return null;

// //       const transformedCode = code.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
// //         const newClasses = classStr
// //           .split(/\s+/)
// //           .map((cls) => {
// //             // Skip classes with square brackets
// //             if (cls.includes('[') && cls.includes(']')) return cls;
// //             // Only prefix matching Tailwind classes
// //             return cls.match(tailwindClassRegex) ? `tw:${cls}` : cls;
// //           })
// //           .join(' ');
// //         return `className="${newClasses}"`;
// //       });

// //       return { code: transformedCode, map: null };
// //     },
// //   };
// // }

// // export default function tailwindPrefixPlugin() {
// //   const tailwindClassRegex = /\b(?:bg|text|font|flex|grid|gap|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|space|w|min-w|max-w|h|min-h|max-h|border|rounded|shadow|justify|items|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate|skew|order|float|clear|object|overflow|overscroll|container|block|inline|hidden|align|content|place|self|place-self|place-items|place-content|tracking|leading|list|placeholder|uppercase|lowercase|capitalize|normal-case|from|via|to|bg-gradient|bg-clip|bg-origin|mix-blend|bg-blend|filter|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|transform|duration|ease|delay|fill|stroke|stroke-width|sr-only|not-sr-only)(?:-[\w\[\]-]+)?\b/g;

// //   return {
// //     name: 'tailwind-prefix',
// //     transform(code, id) {
// //       // Only process .tsx/.jsx files under src
// //       if (!(id.endsWith('.tsx') || id.endsWith('.jsx')) || !id.includes('/src/')) {
// //         return null;
// //       }

// //       const stringClassRegex = /(["'`])([^"'`]*?(?:bg|text|font|flex|grid|gap|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|space|w|min-w|max-w|h|min-h|max-h|border|rounded|shadow|justify|items|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate|skew|order|float|clear|object|overflow|overscroll|container|block|inline|hidden|align|content|place|self|place-self|place-items|place-content|tracking|leading|list|placeholder|uppercase|lowercase|capitalize|normal-case|from|via|to|bg-gradient|bg-clip|bg-origin|mix-blend|bg-blend|filter|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|transform|duration|ease|delay|fill|stroke|stroke-width|sr-only|not-sr-only)(?:-[\w\[\]-]+)?[^"'`]*)\1/g;

// //       const transformedCode = code.replace(stringClassRegex, (match, quote, inner) => {
// //         const replaced = inner.replace(tailwindClassRegex, (cls) => `tw:${cls}`);
// //         return `${quote}${replaced}${quote}`;
// //       });

// //       return {
// //         code: transformedCode,
// //         map: null,
// //       };
// //     },
// //   };
// // }

// export default function tailwindPrefixPlugin() {
//   const tailwindClassRegex = /\b(?:bg|text|font|flex|grid|gap|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|space|w|min-w|max-w|h|min-h|max-h|border|rounded|shadow|justify|items|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate|skew|order|float|clear|object|overflow|overscroll|container|block|inline|hidden|align|content|place|self|place-self|place-items|place-content|tracking|leading|list|placeholder|uppercase|lowercase|capitalize|normal-case|from|via|to|bg-gradient|bg-clip|bg-origin|mix-blend|bg-blend|filter|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|transform|duration|ease|delay|fill|stroke|stroke-width|sr-only|not-sr-only)(?:-[\w\[\]\(\)#/%.:]+)?\b/g;

//   return {
//     name: 'tailwind-prefix',
//     enforce: 'pre',
//     transform(code, id) {
//       if (!id.endsWith('.tsx') && !id.endsWith('.jsx')) return null;

//       let transformedCode = code;

//       // // ✅ Only replace inside className="" or className=''
//       // transformedCode = code.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
//       //   const newClasses = classStr.replace(tailwindClassRegex, (match) => `tw:${match}`);
//       //   return `className="${newClasses}"`;
//       // });

//       // 1️⃣ Static class strings
//       transformedCode = transformedCode.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
//         const newClasses = classStr.replace(tailwindClassRegex, (match) => `tw:${match}`);
//         return `className="${newClasses}"`;
//       });

//       // 2️⃣ Dynamic class expressions inside {}
//       transformedCode = transformedCode.replace(
//         /className\s*=\s*{(`[\s\S]*?`)}/g,
//         (_, template) => {
//           // Remove the surrounding backticks
//           let content = template.slice(1, -1);

//           // Prefix static classes outside ${...}
//           content = content.replace(/([^\${}]+)(?=\${|$)/g, (staticPart) =>
//             staticPart.replace(tailwindClassRegex, (cls) => `tw:${cls}`)
//           );

//           // Prefix classes inside ${'...'} or ${"..."}
//           content = content.replace(/\$\{\s*(['"`])([^'"`]+)\1\s*\}/g, (full, quote, str) => {
//             const prefixed = str.replace(tailwindClassRegex, (cls) => `tw:${cls}`);
//             return `\${${quote}${prefixed}${quote}}`;
//           });

//           return `className={\`${content}\`}`;
//         }
//       );

//       // ✅ Handle variables named *DynamicClassName*
//       transformedCode = transformedCode.replace(
//         /(const\s+\w*DynamicClassName\w*\s*=\s*{[\s\S]*?})/g,
//         (full) => {
//           return full.replace(tailwindClassRegex, (cls) => `tw:${cls}`);
//         }
//       );

//       transformedCode = transformedCode.replace(
//         /(const\s+\w*DynamicClassName\w*\s*=\s*["'`])([^"'`]+)(["'`])/g,
//         (full, start, classes, end) => {
//           const prefixed = classes.replace(tailwindClassRegex, (cls) => `tw:${cls}`);
//           return `${start}${prefixed}${end}`;
//         }
//       );

//       return {
//         code: transformedCode,
//         map: null,
//       };
//     },
//   };
// }

// final code 1
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import generate from '@babel/generator'

export default function TailwindPrefixPlugin(prefix) {
  return {
    name: 'vite-tailwind-prefix',
    enforce: 'pre',
    transform(code, id) {
      // Handle CSS files: prefix custom class selectors safely
      // if (id.endsWith(".css")) {
      //     const prefix2 = "tw\\:"
      //     // Split the CSS into lines for safer processing
      //     const lines = code.split("\n");

      //     const prefixedLines = lines.map((line) => {
      //         // Match only simple class selectors at the start of the line
      //         // e.g., `.dialog-overlay {`
      //         const classSelectorMatch = line.match(/^(\s*)\.([a-zA-Z0-9_-]+)\s*{/);
      //         if (classSelectorMatch) {
      //         const indent = classSelectorMatch[1];
      //         const cls = classSelectorMatch[2];
      //         if (cls.startsWith(prefix) || cls.startsWith(prefix2)) return line; // already prefixed
      //         return `${indent}.${prefix2}${cls} {`;
      //         }
      //         return line; // leave everything else untouched
      //     });

      //     return { code: prefixedLines.join("\n"), map: null };
      // }

      // if (id.endsWith(".css")) {
      //     const prefix2 = "tw\\:";

      //     const lines = code.split("\n");

      //     const prefixedLines = lines.map((line) => {
      //         // Check if the line contains a '{'
      //         const braceIndex = line.indexOf("{");
      //         if (braceIndex === -1) {
      //         // No { on this line, likely inside a block or property: leave untouched
      //         return line;
      //         }

      //         // Split selector and rest
      //         const selector = line.slice(0, braceIndex);
      //         const rest = line.slice(braceIndex);

      //         // Replace only class selectors in the selector part
      //         const prefixedSelector = selector.replace(/(\.)([a-zA-Z0-9_-]+)/g, (match, dot, cls) => {
      //         if (cls.startsWith("tw:") || cls.startsWith("tw\\")) return match; // already prefixed
      //         return `${dot}${prefix2}${cls}`;
      //         });

      //         return prefixedSelector + rest;
      //     });

      //     return { code: prefixedLines.join("\n"), map: null };
      // }

      // if (id.endsWith('.css')) {

      //   //don't need to add prefix to override.style.css
      //   if(id.endsWith('override.style.css')) return code;

      //   const prefix2 = 'tw\\:'

      //   const lines = code.split('\n')
      //   let braceDepth = 0

      //   const prefixedLines = lines.map((line) => {
      //     // Count { and } to track depth
      //     const openBraces = (line.match(/{/g) || []).length
      //     const closeBraces = (line.match(/}/g) || []).length

      //     // Only prefix selectors at top-level (braceDepth === 0)
      //     let newLine = line
      //     if (braceDepth === 0 && line.includes('{')) {
      //       const braceIndex = line.indexOf('{')
      //       const selector = line.slice(0, braceIndex)
      //       const rest = line.slice(braceIndex)

      //       const prefixedSelector = selector.replace(
      //         /(\.)([a-zA-Z0-9_-]+)/g,
      //         (match, dot, cls) => {
      //           if (cls.startsWith('tw:') || cls.startsWith('tw\\'))
      //             return match // already prefixed
      //           return `${dot}${prefix2}${cls}`
      //         },
      //       )

      //       newLine = prefixedSelector + rest
      //     }

      //     // Update brace depth after processing line
      //     braceDepth += openBraces - closeBraces

      //     return newLine
      //   })

      //   return { code: prefixedLines.join('\n'), map: null }
      // }


      if (id.endsWith('.css')) {

  // don't need to add prefix to override.style.css
  if (id.endsWith('override.style.css')) return code;

  const prefix2 = 'tw\\:'

  const lines = code.split('\n')
  let braceDepth = 0

  const prefixedLines = lines.map((line) => {
    // Count { and } to track depth
    const openBraces = (line.match(/{/g) || []).length
    const closeBraces = (line.match(/}/g) || []).length

    let newLine = line
    if (braceDepth === 0 && line.includes('{')) {
      const braceIndex = line.indexOf('{')
      const selector = line.slice(0, braceIndex)
      const rest = line.slice(braceIndex)

      const prefixedSelector = selector.replace(
        /(\.)([a-zA-Z0-9_-]+)/g,
        (match, dot, cls) => {
          // ✅ Skip ProseMirror-related, EditorView-related classes
          if (
            cls.startsWith('ProseMirror') ||
            cls.startsWith('EditorView') ||
            cls.startsWith('tw:') ||
            cls.startsWith('tw\\')
          ) {
            return match
          }
          return `${dot}${prefix2}${cls}`
        },
      )

      newLine = prefixedSelector + rest
    }

    braceDepth += openBraces - closeBraces
    return newLine
  })

  return { code: prefixedLines.join('\n'), map: null }
}


      if (!id.endsWith('.tsx') && !id.endsWith('.ts')) return null

      try {
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        })

        const prefixClasses = (str) => {
          return str
            .split(/\s+/)
            .filter(Boolean)
            .map((c) => (c.startsWith(prefix) ? c : `${prefix}${c}`))
            .join(' ')
        }

        traverse.default(ast, {
          // ✅ Handle variables whose name includes "DynamicClassName"

          JSXAttribute(path) {
            if (path.node.name.name !== 'className') return

            const value = path.node.value

            // String literal: className="..."
            if (t.isStringLiteral(value)) {
              path.node.value = t.stringLiteral(prefixClasses(value.value))
            }
            // Template literal: className={`...`}
            else if (
              t.isJSXExpressionContainer(value) &&
              t.isTemplateLiteral(value.expression)
            ) {
              const quasis = value.expression.quasis.map((quasi, i) => {
                let classes = prefixClasses(quasi.value.raw)

                if (i < value.expression.expressions.length) classes += ' '
                if (i > 0 && !classes.startsWith(' ')) classes = ' ' + classes

                return t.templateElement({ raw: classes, cooked: classes })
              })

              // 🔥 also fix expressions inside ${ ... }
              const expressions = value.expression.expressions.map((expr) => {
                if (t.isStringLiteral(expr)) {
                  return t.stringLiteral(prefixClasses(expr.value))
                }
                if (t.isLogicalExpression(expr)) {
                  if (t.isStringLiteral(expr.right)) {
                    return t.logicalExpression(
                      expr.operator,
                      expr.left,
                      t.stringLiteral(prefixClasses(expr.right.value)),
                    )
                  }
                }
                if (t.isConditionalExpression(expr)) {
                  const newConsequent = t.isStringLiteral(expr.consequent)
                    ? t.stringLiteral(prefixClasses(expr.consequent.value))
                    : expr.consequent
                  const newAlternate = t.isStringLiteral(expr.alternate)
                    ? t.stringLiteral(prefixClasses(expr.alternate.value))
                    : expr.alternate
                  return t.conditionalExpression(
                    expr.test,
                    newConsequent,
                    newAlternate,
                  )
                }
                return expr
              })

              path.node.value = t.jsxExpressionContainer(
                t.templateLiteral(quasis, expressions),
              )
            }

            // className={condition ? "..." : "..."}
            else if (
              t.isJSXExpressionContainer(value) &&
              t.isConditionalExpression(value.expression)
            ) {
              const expr = value.expression
              const newConsequent = t.isStringLiteral(expr.consequent)
                ? t.stringLiteral(prefixClasses(expr.consequent.value))
                : expr.consequent
              const newAlternate = t.isStringLiteral(expr.alternate)
                ? t.stringLiteral(prefixClasses(expr.alternate.value))
                : expr.alternate

              path.node.value = t.jsxExpressionContainer(
                t.conditionalExpression(expr.test, newConsequent, newAlternate),
              )
            }

            // Other expressions (e.g., clsx())
            else if (
              t.isJSXExpressionContainer(value) &&
              t.isCallExpression(value.expression)
            ) {
              const args = value.expression.arguments.map((arg) => {
                if (t.isStringLiteral(arg))
                  return t.stringLiteral(prefixClasses(arg.value))
                return arg
              })
              path.node.value = t.jsxExpressionContainer(
                t.callExpression(value.expression.callee, args),
              )
            }
          },
          VariableDeclarator(path) {
            const id = path.node.id
            const init = path.node.init
            if (!t.isIdentifier(id)) return

            // 🔹 only affect DynamicClassName variables
            if (!id.name.includes('DynamicClassName')) return
            if (!init) return

            const prefixString = (expr) =>
              t.isStringLiteral(expr)
                ? t.stringLiteral(prefixClasses(expr.value))
                : expr

            const prefixObject = (objExpr) => {
              if (!t.isObjectExpression(objExpr)) return objExpr
              objExpr.properties.forEach((prop) => {
                if (t.isObjectProperty(prop)) {
                  if (t.isStringLiteral(prop.value)) {
                    prop.value = t.stringLiteral(
                      prefixClasses(prop.value.value),
                    )
                  } else if (t.isTemplateLiteral(prop.value)) {
                    const quasis = prop.value.quasis.map((quasi) => {
                      const raw = prefixClasses(quasi.value.raw)
                      return t.templateElement({ raw, cooked: raw })
                    })
                    prop.value = t.templateLiteral(
                      quasis,
                      prop.value.expressions,
                    )
                  } else if (t.isObjectExpression(prop.value)) {
                    prop.value = prefixObject(prop.value) // recurse
                  } else if (t.isConditionalExpression(prop.value)) {
                    prop.value = t.conditionalExpression(
                      prop.value.test,
                      prefixString(prop.value.consequent),
                      prefixString(prop.value.alternate),
                    )
                  } else if (t.isLogicalExpression(prop.value)) {
                    const right = t.isStringLiteral(prop.value.right)
                      ? t.stringLiteral(prefixClasses(prop.value.right.value))
                      : prop.value.right
                    prop.value = t.logicalExpression(
                      prop.value.operator,
                      prop.value.left,
                      right,
                    )
                  }
                }
              })
              return objExpr
            }

            if (t.isStringLiteral(init)) {
              path.node.init = t.stringLiteral(prefixClasses(init.value))
            } else if (t.isTemplateLiteral(init)) {
              const quasis = init.quasis.map((quasi) => {
                const raw = prefixClasses(quasi.value.raw)
                return t.templateElement({ raw, cooked: raw })
              })
              path.node.init = t.templateLiteral(quasis, init.expressions)
            } else if (t.isObjectExpression(init)) {
              path.node.init = prefixObject(init)
            } else if (t.isConditionalExpression(init)) {
              path.node.init = t.conditionalExpression(
                init.test,
                prefixString(init.consequent),
                prefixString(init.alternate),
              )
            } else if (t.isLogicalExpression(init)) {
              const right = t.isStringLiteral(init.right)
                ? t.stringLiteral(prefixClasses(init.right.value))
                : init.right
              path.node.init = t.logicalExpression(
                init.operator,
                init.left,
                right,
              )
            }
          },
        })

        const output = generate.default(ast, {}, code)
        return { code: output.code, map: output.map }
      } catch (err) {
        console.error(`Error transforming file ${id}:`, err)
        return null
      }
    },
  }
}

// final code 2
// import { parse } from "@babel/parser";
// import traverse from "@babel/traverse";
// import * as t from "@babel/types";
// import generate from "@babel/generator";

// export default function TailwindPrefixPlugin(prefix) {
//   return {
//     name: "vite-tailwind-prefix",
//     enforce: "pre",
//     transform(code, id) {
//       if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return null;

//       try {
//         const ast = parse(code, {
//           sourceType: "module",
//           plugins: ["jsx", "typescript"],
//         });

//         const prefixClasses = (str) => {
//           return str
//             .split(/\s+/)
//             .filter(Boolean)
//             .map((c) => (c.startsWith(prefix) ? c : `${prefix}${c}`))
//             .join(" ");
//         };

//         traverse.default(ast, {
//           // ✅ Handle variables whose name includes "DynamicClassName"

//           JSXAttribute(path) {
//             if (path.node.name.name !== "className") return;

//             const value = path.node.value;

//             // String literal: className="..."
//             if (t.isStringLiteral(value)) {
//               path.node.value = t.stringLiteral(prefixClasses(value.value));
//             }
//             // Template literal: className={`...`}
//             else if (t.isJSXExpressionContainer(value) && t.isTemplateLiteral(value.expression)) {
//               const quasis = value.expression.quasis.map((quasi, i) => {
//                 let classes = prefixClasses(quasi.value.raw);

//                 if (i < value.expression.expressions.length) classes += " ";
//                 if (i > 0 && !classes.startsWith(" ")) classes = " " + classes;

//                 return t.templateElement({ raw: classes, cooked: classes });
//               });

//               // 🔥 also fix expressions inside ${ ... }
//               const expressions = value.expression.expressions.map((expr) => {
//                 if (t.isStringLiteral(expr)) {
//                   return t.stringLiteral(prefixClasses(expr.value));
//                 }
//                 if (t.isLogicalExpression(expr)) {
//                   if (t.isStringLiteral(expr.right)) {
//                     return t.logicalExpression(
//                       expr.operator,
//                       expr.left,
//                       t.stringLiteral(prefixClasses(expr.right.value))
//                     );
//                   }
//                 }
//                 if (t.isConditionalExpression(expr)) {
//                   const newConsequent = t.isStringLiteral(expr.consequent)
//                     ? t.stringLiteral(prefixClasses(expr.consequent.value))
//                     : expr.consequent;
//                   const newAlternate = t.isStringLiteral(expr.alternate)
//                     ? t.stringLiteral(prefixClasses(expr.alternate.value))
//                     : expr.alternate;
//                   return t.conditionalExpression(expr.test, newConsequent, newAlternate);
//                 }
//                 return expr;
//               });

//               path.node.value = t.jsxExpressionContainer(
//                 t.templateLiteral(quasis, expressions)
//               );
//             }

//             // 🔥Template literal: className={ternary: cond ? "a" : "b"}
//             else if (t.isJSXExpressionContainer(value)) {
//               const expr = value.expression;
//               if (t.isConditionalExpression(expr)) {
//                 const newConsequent = t.isStringLiteral(expr.consequent)
//                   ? t.stringLiteral(prefixClasses(expr.consequent.value))
//                   : expr.consequent;

//                 const newAlternate = t.isStringLiteral(expr.alternate)
//                   ? t.stringLiteral(prefixClasses(expr.alternate.value))
//                   : expr.alternate;

//                 path.node.value = t.jsxExpressionContainer(
//                   t.conditionalExpression(expr.test, newConsequent, newAlternate)
//                 );
//               }
//             }

//             // Other expressions (e.g., clsx())
//             else if (t.isJSXExpressionContainer(value) && t.isCallExpression(value.expression)) {
//               const args = value.expression.arguments.map((arg) => {
//                 if (t.isStringLiteral(arg)) return t.stringLiteral(prefixClasses(arg.value));
//                 return arg;
//               });
//               path.node.value = t.jsxExpressionContainer(
//                 t.callExpression(value.expression.callee, args)
//               );
//             }

//           },

//           VariableDeclarator(path) {
//             const id = path.node.id;
//             const init = path.node.init;
//             if (!t.isIdentifier(id)) return;

//             // 🔹 only affect DynamicClassName variables
//             if (!id.name.includes("DynamicClassName")) return;
//             if (!init) return;

//             // Handle: const fooDynamicClassName = "string"
//             if (t.isStringLiteral(init)) {
//               path.node.init = t.stringLiteral(prefixClasses(init.value));
//             }

//             // Handle: const fooDynamicClassName = `template ${expr}`
//             else if (t.isTemplateLiteral(init)) {
//               const quasis = init.quasis.map((quasi) => {
//                 const raw = prefixClasses(quasi.value.raw);
//                 return t.templateElement({ raw, cooked: raw });
//               });
//               path.node.init = t.templateLiteral(quasis, init.expressions);
//             }

//             // Handle: const fooDynamicClassName = cond ? "a" : "b"
//             else if (t.isConditionalExpression(init)) {
//               const prefixString = (expr) =>
//                 t.isStringLiteral(expr) ? t.stringLiteral(prefixClasses(expr.value)) : expr;

//               path.node.init = t.conditionalExpression(
//                 init.test,
//                 prefixString(init.consequent),
//                 prefixString(init.alternate)
//               );
//             }

//             // Handle: const fooDynamicClassName = cond && "a"
//             else if (t.isLogicalExpression(init)) {
//               const right = t.isStringLiteral(init.right)
//                 ? t.stringLiteral(prefixClasses(init.right.value))
//                 : init.right;
//               path.node.init = t.logicalExpression(init.operator, init.left, right);
//             }
//           },
//         });

//         const output = generate.default(ast, {}, code);
//         return { code: output.code, map: output.map };
//       } catch (err) {
//         console.error(`Error transforming file ${id}:`, err);
//         return null;
//       }
//     },
//   };
// }

// tailwindPrefixPlugin.js
// export default function tailwindPrefixPlugin() {
//   // Tailwind utility pattern (expand as needed)
//   const tailwindClassRegex =
//   /\b(?:(?:sm:|md:|lg:|xl:|2xl:|hover:|focus:|active:|disabled:|first:|last:|odd:|even:|visited:|checked:|group-hover:|group-focus:|group-active:|group-disabled:|peer-checked:|peer-disabled:|peer-focus:|peer-hover:|peer-active:|peer-placeholder-shown:|peer-read-only:|peer-read-write:|peer-required:|peer-valid:|peer-invalid:|peer-empty:|peer-last-of-type:|peer-first-of-type:|peer-only-of-type:|peer-not-first-of-type:|peer-not-last-of-type:|peer-even-of-type:|peer-odd-of-type:)?(?:bg|text|font|flex|grid|gap|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|space|w|min-w|max-w|h|min-h|max-h|border|rounded|shadow|justify|items|divide|ring|transition|animate|cursor|z|top|left|right|bottom|opacity|scale|rotate|translate|skew|order|float|clear|object|overflow|overscroll|container|block|inline|hidden|align|content|place|self|place-self|place-items|place-content|tracking|leading|list|placeholder|uppercase|lowercase|capitalize|normal-case|from|via|to|bg-gradient|bg-clip|bg-origin|mix-blend|bg-blend|filter|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow|transform|duration|ease|delay|fill|stroke|stroke-width|sr-only|not-sr-only|aspect-ratio|line-clamp|scroll-snap|scroll-m|scroll-p|scroll|scrollbar|resize|backdrop|will-change|caret|accent|appearance|list-style-type|list-style-position|list|marker|object-position|object-fit|overscroll-behavior|relative|absolute)(?:-[\w\[\]\(\)#/%.:]+)?\b)/g;

//   const prefixClasses = (str) =>
//     str.replace(tailwindClassRegex, (cls) => (cls.startsWith("tw:") ? cls : `tw:${cls}`));

//   return {
//     name: "tailwind-prefix",
//     enforce: "pre",
//     transform(code, id) {
//       if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return null;

//       let transformedCode = code;

//       // 1️⃣ Static string: className="..."
//       transformedCode = transformedCode.replace(
//         /className\s*=\s*["']([^"']*)["']/g,
//         (_, classStr) => `className="${prefixClasses(classStr)}"`
//       );

//       // 2️⃣ Template literal: className={`...`}
//       transformedCode = transformedCode.replace(
//         /className\s*=\s*{(`[\s\S]*?`)}/g,
//         (_, template) => {
//           let content = template.slice(1, -1);

//           // Static chunks
//           content = content.replace(/([^\${}]+)(?=\${|$)/g, (staticPart) =>
//             prefixClasses(staticPart)
//           );

//           // Inside ${ "..."/'...' }
//           content = content.replace(
//             /\$\{\s*(['"`])([^'"`]+)\1\s*\}/g,
//             (full, quote, str) => `\${${quote}${prefixClasses(str)}${quote}}`
//           );

//           return `className={\`${content}\`}`;
//         }
//       );

//       // 3️⃣ Ternary inside expression: className={cond ? "a" : "b"}
//       transformedCode = transformedCode.replace(
//         /className\s*=\s*{([^{}?]+)\?\s*(['"`])([^'"`]+)\2\s*:\s*(['"`])([^'"`]+)\4}/g,
//         (full, cond, q1, whenTrue, q2, whenFalse) => {
//           return `className={${cond}?${q1}${prefixClasses(
//             whenTrue
//           )}${q1}:${q2}${prefixClasses(whenFalse)}${q2}}`;
//         }
//       );

//       // 4️⃣ Logical expr: className={cond && "foo"}
//       transformedCode = transformedCode.replace(
//         /className\s*=\s*{([^{}]+)&&\s*(['"`])([^'"`]+)\2}/g,
//         (full, cond, quote, cls) => {
//           return `className={${cond}&&${quote}${prefixClasses(cls)}${quote}}`;
//         }
//       );

//       // 5️⃣ clsx(...) / classNames(...)
//       transformedCode = transformedCode.replace(
//         /className\s*=\s*{?\s*(clsx|classNames)\(([\s\S]*?)\)}?/g,
//         (full, fn, args) => {
//           const newArgs = args.replace(/(['"`])([^'"`]+)\1/g, (full, q, str) => {
//             return `${q}${prefixClasses(str)}${q}`;
//           });
//           return `className={${fn}(${newArgs})}`;
//         }
//       );

//       // 6️⃣ Variables named *DynamicClassName*
//       // String literal
//       transformedCode = transformedCode.replace(
//         /(const|let|var)\s+(\w*DynamicClassName\w*)\s*=\s*(['"`])([^'"`]+)\3/g,
//         (full, decl, name, quote, classes) => {
//           return `${decl} ${name} = ${quote}${prefixClasses(classes)}${quote}`;
//         }
//       );

//       // Object literals with string values
//       transformedCode = transformedCode.replace(
//         /(const|let|var)\s+(\w*DynamicClassName\w*)\s*=\s*{([\s\S]*?)}/g,
//         (full, decl, name, body) => {
//           const newBody = body.replace(/(['"`])([^'"`]+)\1/g, (full, q, str) => {
//             return `${q}${prefixClasses(str)}${q}`;
//           });
//           return `${decl} ${name} = {${newBody}}`;
//         }
//       );

//       // Ternary / logical
//       transformedCode = transformedCode.replace(
//         /(const|let|var)\s+(\w*DynamicClassName\w*)\s*=\s*([^;]+);/g,
//         (full, decl, name, expr) => {
//           const newExpr = expr.replace(/(['"`])([^'"`]+)\1/g, (full, q, str) => {
//             return `${q}${prefixClasses(str)}${q}`;
//           });
//           return `${decl} ${name} = ${newExpr};`;
//         }
//       );

//       return { code: transformedCode, map: null };
//     },
//   };
// }

// Handles:
// ✅ className="..."
// ✅ className={\...`}with${"foo"}inside
// ✅className={cond ? "a" : "b"}
// ✅className={cond && "foo"}
// ✅className={clsx("foo", cond && "bar")}
// ✅const fooDynamicClassName = "..." | {...} | cond ? ... : ...`
