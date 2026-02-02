import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import generate from '@babel/generator'
import { prefix } from './prefix.env.js'

const prefix1 = `${prefix}:`
const prefix2 = `${prefix}\:`

export default function TailwindPrefixPlugin() {
  return {
    name: 'vite-tailwind-prefix',
    enforce: 'pre',
    transform(code, id) {
      // Handle CSS files: prefix custom class selectors safely
      if (id.endsWith('.css')) {
        // don't need to add prefix to override.style.css
        if (id.endsWith('override.style.css')) return code;


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
                  cls.startsWith('EmailView') ||
                  cls.startsWith('CUSTOM') ||
                  cls.startsWith(prefix1) ||
                  cls.startsWith(prefix2)
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

        const addImportant = (c) => {
          if (!c) return c
          const parts = c.split(':')
          const utility = parts.pop()
          if (!utility || utility.startsWith('!')) {
            return c
          }
          parts.push(`!${utility}`)
          return parts.join(':')
        }

        const prefixClasses = (str) => {
          return str
            .split(/\s+/)
            .filter(Boolean)
            .map((c) => {
              if (c.startsWith(prefix1) || c.startsWith('CUSTOM') || c.startsWith('ProseMirror')) return c
              return `${prefix1}${c}`
            })
            .map((c) => {
              if (c.startsWith('CUSTOM') || c.startsWith('ProseMirror')) return c
              return addImportant(c)
            })
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

// Handles:
// ✅ className="..."
// ✅ className={\`...\`}with${"foo"}inside
// ✅className={cond ? "a" : "b"}
// ✅className={cond && "foo"}
// ✅className={clsx("foo", cond && "bar")}
// ✅const fooDynamicClassName = "..." | {...} | cond ? ... : ...`
