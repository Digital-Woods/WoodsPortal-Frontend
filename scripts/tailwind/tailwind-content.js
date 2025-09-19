import fs from 'fs'
import path from 'path'
import { prefix } from './prefix.env.js'

const prefix1 = `${prefix}:`

const srcDir = path.resolve('./src')
const tempDir = path.resolve('./.temp')

if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

function addPrefix(token) {
  if (!token) return token
  if (token.startsWith(prefix1)) return token
  return `${prefix1}${token}`
}

function addImportant(token) {
  if (!token) return token
  const parts = token.split(':')
  const utility = parts.pop()
  if (!utility || utility.startsWith('!')) {
    return token
  }
  parts.push(`!${utility}`)
  return parts.join(':')
}

// function prefixStaticClasses(str) {
//   // Prefix whitespace-separated class tokens (outside ${ ... })
//   return str.split(/\s+/).filter(Boolean).map(addPrefix).join(' ')
// }

// ✅ Safe prefixing for static classes
function prefixStaticClasses(str) {
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      if (!token) return token
      if (token.startsWith(prefix1)) return addImportant(token)

      // ✅ Handle opening arbitrary value like "z-["
      if (/^[a-z0-9-]+-\[$/i.test(token)) {
        return addImportant(`${prefix1}${token}`)
      }

      // ✅ Leave closing bracket "]" untouched
      if (token === ']') {
        return token
      }

      // ✅ Handle complete arbitrary values like "z-[999]" or "top-[50%]"
      // const match = token.match(/^([a-z0-9-]+(?:\/[a-z0-9-]+)?):?\[(.+)\]$/i)
      // if (match) {
      //   const [, key, val] = match
      //   return `${prefix1}${key}-[${val}]`
      // }

      return addImportant(addPrefix(token))
    })
    .join(' ')
}

// Prefix classes inside quoted strings ONLY, e.g. "...${cond ? 'lg:w-[...]' : 'lg:w-[...]'}..."
function prefixQuotedStringsInExpression(expr) {
  // Replace '..."' or '...' with prefixed contents
  return expr.replace(/(['"])((?:\\.|(?!\1).)*)\1/g, (_, quote, inner) => {
    return `${quote}${prefixStaticClasses(inner)}${quote}`
  })
}

// Handle className
function prefixClassesInCode(code) {
  // 1) Plain string: className="..."
  code = code.replace(/className\s*=\s*["']([^"']*)["']/g, (_, classStr) => {
    return `className="${prefixStaticClasses(classStr)}"`
  })

  // 2) Template literal: className={`...`}
  code = code.replace(/className\s*=\s*{\s*`([\s\S]*?)`\s*}/g, (_, tplBody) => {
    const parts = tplBody.split(/(\$\{[\s\S]*?\})/g)

    // const rebuilt = parts
    //   .map((part) => {
    //     if (part.startsWith('${')) {
    //       return part.replace(
    //         /^\$\{([\s\S]*?)\}$/,
    //         (_m, inner) => '${' + prefixQuotedStringsInExpression(inner) + '}',
    //       )
    //     }
    //     return prefixStaticClasses(part)
    //   })
    //   .join('')
    

      // return `className={\`${rebuilt}\`}`
      const rebuilt = parts
        .map((part, i) => {
          if (part.startsWith('${')) {
            // normalize: always prefix with one space
            return ' ' + part.replace(
              /^\$\{([\s\S]*?)\}$/,
              (_m, inner) => '${' + prefixQuotedStringsInExpression(inner) + '}',
            )
          }
          // static classes
          return prefixStaticClasses(part).trim()
        })
        .join(' ')
        .replace(/\s+/g, ' ') // collapse multiple spaces

      return `className={\`${rebuilt.trim()}\`}`
  })

  // 3) Ternary expressions: className={cond ? "..." : "..."}
  code = code.replace(
    /className\s*=\s*{([^{};]+?\?[^:]+:[^}]+)}/g,
    (match, inner) => {
      const ternaryMatch = inner.match(
        /^(.*?\?)\s*(['"][^'"]*['"])\s*:\s*(['"][^'"]*['"])\s*$/,
      )
      if (!ternaryMatch) return match

      const [, condition, whenTrue, whenFalse] = ternaryMatch
      const prefixedTrue = whenTrue.replace(
        /(['"])(.*?)\1/,
        (_, q, cls) => `${q}${prefixStaticClasses(cls)}${q}`,
      )
      const prefixedFalse = whenFalse.replace(
        /(['"])(.*?)\1/,
        (_, q, cls) => `${q}${prefixStaticClasses(cls)}${q}`,
      )

      return `className={${condition} ${prefixedTrue} : ${prefixedFalse}}`
    },
  )

  // 4) Variables with "DynamicClassName"
  code = code.replace(
    /(const|let|var)\s+([A-Za-z0-9_]*DynamicClassName[A-Za-z0-9_]*)\s*=\s*([^;]+);/g,
    (match, decl, varName, value) => {
      if (/^{[\s\S]*}$/.test(value.trim())) {
        const transformed = value.replace(/["'`](.*?)["'`]/g, (m, cls) => {
          return `"${prefixStaticClasses(cls)}"`
        })
        return `${decl} ${varName} = ${transformed};`
      }
      if (/\?.*:/.test(value)) {
        const transformed = value.replace(/["'`](.*?)["'`]/g, (m, cls) => {
          return `"${prefixStaticClasses(cls)}"`
        })
        return `${decl} ${varName} = ${transformed};`
      }
      if (/^["'`].*["'`]$/.test(value.trim())) {
        const cls = value.trim().slice(1, -1)
        return `${decl} ${varName} = "${prefixStaticClasses(cls)}";`
      }
      return match
    },
  )

  // 5) Handle classNames(...) or clsx(...)
  code = code.replace(
    /className\s*=\s*{?\s*(classNames|clsx)\(([\s\S]*?)\)}?/g,
    (match, fnName, args) => {
      const transformedArgs = args.replace(/(['"])(.*?)\1/g, (_, q, cls) => {
        return `${q}${prefixStaticClasses(cls)}${q}`
      })
      return `className={${fnName}(${transformedArgs})}`
    },
  )

  return code
}

// 🔥 helper: recursively collect all `.tsx` files under src
function getAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      getAllTsxFiles(fullPath, fileList)
    } else if (file.endsWith('.tsx')) {
      fileList.push(fullPath)
    }
  }
  return fileList
}

// Pre-build static file for Tailwind
export default async function tailwindContent() {
  const srcFiles = getAllTsxFiles(srcDir) // auto-load all .tsx
  let allPrefixedClasses = ''

  for (const filePath of srcFiles) {
    const code = fs.readFileSync(filePath, 'utf-8')
    const transformed = prefixClassesInCode(code)
    allPrefixedClasses += transformed + '\n'
  }

  const outputPath = path.resolve(tempDir, 'tailwind-classes.tsx')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, allPrefixedClasses, 'utf-8')

  // Return the file as Tailwind content
  return [
    {
      raw: allPrefixedClasses,
      extension: 'tsx',
    },
  ]
}

tailwindContent()

// console.log('✅ All classNames prefixed!', tailwindContent());
