// replace-translations.js
import fs from 'fs'
import path from 'path'
import translations from './data/translations.js'

// Directories to scan (you can add more)
const scanDirs = ['./app', './components', './layouts', './css']

function getAllFiles(dir, files = []) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)

    // Skip node_modules, .git, and dist/build output
    if (/node_modules|\.git|\.next|\.vercel|dist|build/.test(fullPath)) continue

    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      getAllFiles(fullPath, files)
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      files.push(fullPath)
    }
  }
  return files
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  for (const key of Object.keys(translations)) {
    const enText = translations[key].en

    // Match only if not already inside _t('...')
    const regex = new RegExp(`(?<!_t\\(['"\`])${escapeRegex(enText)}`, 'g')

    if (regex.test(content)) {
      content = content.replace(regex, `_t('${enText}')`)
      modified = true
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Updated: ${filePath}`)
  }
}

// Scan all directories
let files = []
for (const dir of scanDirs) {
  if (fs.existsSync(dir)) {
    files = files.concat(getAllFiles(dir))
  }
}

files.forEach(replaceInFile)

console.log('✅ Replacement done.')
