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


// 1
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import generate from "@babel/generator";

export default function TailwindPrefixPlugin(prefix) {
  return {
    name: "vite-tailwind-prefix",
    enforce: "pre",
    transform(code, id) {
      if (!id.endsWith(".tsx") && !id.endsWith(".jsx")) return null;

      try {
        const ast = parse(code, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        });

        const prefixClasses = (str) => {
          return str
            .split(/\s+/)
            .filter(Boolean)
            .map((c) => (c.startsWith(prefix) ? c : `${prefix}${c}`))
            .join(" ");
        };

        traverse.default(ast, {
          // JSXAttribute(path) {
          //   if (path.node.name.name !== "className") return;

          //   const value = path.node.value;

          //   // String literal: className="..."
          //   if (t.isStringLiteral(value)) {
          //     path.node.value = t.stringLiteral(prefixClasses(value.value));
          //   }
          //   // Template literal: className={`...`}
          //   else if (t.isJSXExpressionContainer(value) && t.isTemplateLiteral(value.expression)) {
          //     const quasis = value.expression.quasis.map((quasi, i) => {
          //       let classes = prefixClasses(quasi.value.raw);

          //       if (i < value.expression.expressions.length) classes += " ";
          //       if (i > 0 && !classes.startsWith(" ")) classes = " " + classes;

          //       return t.templateElement({ raw: classes, cooked: classes });
          //     });

          //     path.node.value = t.jsxExpressionContainer(
          //       t.templateLiteral(quasis, value.expression.expressions)
          //     );
          //   }
          //   // Other expressions (e.g., clsx())
          //   else if (t.isJSXExpressionContainer(value) && t.isCallExpression(value.expression)) {
          //     const args = value.expression.arguments.map((arg) => {
          //       if (t.isStringLiteral(arg)) return t.stringLiteral(prefixClasses(arg.value));
          //       return arg;
          //     });
          //     path.node.value = t.jsxExpressionContainer(
          //       t.callExpression(value.expression.callee, args)
          //     );
          //   }
          // },

          // ✅ Handle variables whose name includes "DynamicClassName"
          
          JSXAttribute(path) {
  if (path.node.name.name !== "className") return;

  const value = path.node.value;

  // String literal: className="..."
  if (t.isStringLiteral(value)) {
    path.node.value = t.stringLiteral(prefixClasses(value.value));
  }
  // Template literal: className={`...`}
  else if (t.isJSXExpressionContainer(value) && t.isTemplateLiteral(value.expression)) {
    const quasis = value.expression.quasis.map((quasi, i) => {
      let classes = prefixClasses(quasi.value.raw);

      if (i < value.expression.expressions.length) classes += " ";
      if (i > 0 && !classes.startsWith(" ")) classes = " " + classes;

      return t.templateElement({ raw: classes, cooked: classes });
    });

    // 🔥 also fix expressions inside ${ ... }
    const expressions = value.expression.expressions.map((expr) => {
      if (t.isStringLiteral(expr)) {
        return t.stringLiteral(prefixClasses(expr.value));
      }
      if (t.isLogicalExpression(expr)) {
        if (t.isStringLiteral(expr.right)) {
          return t.logicalExpression(
            expr.operator,
            expr.left,
            t.stringLiteral(prefixClasses(expr.right.value))
          );
        }
      }
      if (t.isConditionalExpression(expr)) {
        const newConsequent = t.isStringLiteral(expr.consequent)
          ? t.stringLiteral(prefixClasses(expr.consequent.value))
          : expr.consequent;
        const newAlternate = t.isStringLiteral(expr.alternate)
          ? t.stringLiteral(prefixClasses(expr.alternate.value))
          : expr.alternate;
        return t.conditionalExpression(expr.test, newConsequent, newAlternate);
      }
      return expr;
    });

    path.node.value = t.jsxExpressionContainer(
      t.templateLiteral(quasis, expressions)
    );
  }
  // Other expressions (e.g., clsx())
  else if (t.isJSXExpressionContainer(value) && t.isCallExpression(value.expression)) {
    const args = value.expression.arguments.map((arg) => {
      if (t.isStringLiteral(arg)) return t.stringLiteral(prefixClasses(arg.value));
      return arg;
    });
    path.node.value = t.jsxExpressionContainer(
      t.callExpression(value.expression.callee, args)
    );
  }
},

          VariableDeclarator(path) {
            const id = path.node.id;
            const init = path.node.init;
            if (!t.isIdentifier(id)) return;
            if (!id.name.includes("DynamicClassName")) return;
            if (!init) return;

            // If variable is string literal
            if (t.isStringLiteral(init)) {
              path.node.init = t.stringLiteral(prefixClasses(init.value));
            }

            // If variable is an object with string properties
            else if (t.isObjectExpression(init)) {
              init.properties.forEach((prop) => {
                if (t.isObjectProperty(prop) && t.isStringLiteral(prop.value)) {
                  prop.value = t.stringLiteral(prefixClasses(prop.value.value));
                }
              });
            }
          },
        });

        const output = generate.default(ast, {}, code);
        return { code: output.code, map: output.map };
      } catch (err) {
        console.error(`Error transforming file ${id}:`, err);
        return null;
      }
    },
  };
}

// 2
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
//             .map((c) => {
//               // ✅ already prefixed
//               if (c.startsWith(prefix)) return c;

//               // ✅ skip dark: completely
//               if (c.startsWith("dark:")) return c;

//               // ✅ handle other variants (hover:, sm:, lg:, etc.)
//               const parts = c.split(":");
//               if (parts.length > 1) {
//                 const variant = parts.slice(0, -1).join(":");
//                 const base = parts[parts.length - 1];
//                 if (base.startsWith(prefix)) return c; // base already prefixed
//                 return `${variant}:${prefix}${base}`;
//               }

//               // ✅ plain class
//               return `${prefix}${c}`;
//             })
//             .join(" ");
//         };

//         traverse.default(ast, {
//           JSXAttribute(path) {
//             if (path.node.name.name !== "className") return;

//             const value = path.node.value;

//             // String literal: className="..."
//             if (t.isStringLiteral(value)) {
//               path.node.value = t.stringLiteral(prefixClasses(value.value));
//             }
//             // Template literal: className={`...`}
//             else if (
//               t.isJSXExpressionContainer(value) &&
//               t.isTemplateLiteral(value.expression)
//             ) {
//               const quasis = value.expression.quasis.map((quasi, i) => {
//                 let classes = prefixClasses(quasi.value.raw);

//                 if (i < value.expression.expressions.length) classes += " ";
//                 if (i > 0 && !classes.startsWith(" ")) classes = " " + classes;

//                 return t.templateElement({ raw: classes, cooked: classes });
//               });

//               path.node.value = t.jsxExpressionContainer(
//                 t.templateLiteral(quasis, value.expression.expressions)
//               );
//             }
//             // Other expressions (e.g., clsx())
//             else if (
//               t.isJSXExpressionContainer(value) &&
//               t.isCallExpression(value.expression)
//             ) {
//               const args = value.expression.arguments.map((arg) => {
//                 if (t.isStringLiteral(arg)) {
//                   return t.stringLiteral(prefixClasses(arg.value));
//                 }
//                 return arg;
//               });
//               path.node.value = t.jsxExpressionContainer(
//                 t.callExpression(value.expression.callee, args)
//               );
//             }
//           },

//           // ✅ Handle variables whose name includes "DynamicClassName"
//           VariableDeclarator(path) {
//             const id = path.node.id;
//             const init = path.node.init;
//             if (!t.isIdentifier(id)) return;
//             if (!id.name.includes("DynamicClassName")) return;
//             if (!init) return;

//             if (t.isStringLiteral(init)) {
//               path.node.init = t.stringLiteral(prefixClasses(init.value));
//             } else if (t.isObjectExpression(init)) {
//               init.properties.forEach((prop) => {
//                 if (t.isObjectProperty(prop) && t.isStringLiteral(prop.value)) {
//                   prop.value = t.stringLiteral(prefixClasses(prop.value.value));
//                 }
//               });
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
