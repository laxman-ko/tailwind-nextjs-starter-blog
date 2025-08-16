// scripts/duplicate-locales.js
import fs from 'fs'
import path from 'path'
import siteMetadata from '../data/siteMetadata.js' // adjust path if needed

const rootDir = path.resolve('app', '(root)') // source files
const i18nDir = path.resolve('app', '(i18n)') // locale directories
const defaultLocale = Object.values(siteMetadata)[0].defaultLocale

// --- Get all locales from siteMetadata ---
const siteLocales = Object.keys(siteMetadata)
if (!siteLocales.length) {
  console.error('❌ No locales found in siteMetadata.')
  process.exit(1)
}

function copyEntry(srcPath, destPath, locale) {
  const stats = fs.statSync(srcPath)

  if (stats.isDirectory()) {
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true })
    }
    for (const entry of fs.readdirSync(srcPath)) {
      copyEntry(path.join(srcPath, entry), path.join(destPath, entry), locale)
    }
  } else {
    // Ensure parent directory exists
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    let content = fs.readFileSync(srcPath, 'utf8')
    content = content.replace(/getSiteHelpers\s*\(\s*\)/g, `getSiteHelpers('${locale}')`)
    fs.writeFileSync(destPath, content, 'utf8')
  }
}

// --- Main logic ---
for (const locale of siteLocales) {
  if (locale === defaultLocale) {
    console.log(`\nSkipping default locale: ${locale}`)
    continue
  }

  console.log(`\n🌐 Creating copies for locale: ${locale}`)

  const entriesToCopy = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .map((e) => e.name)
    .filter((name) => !siteLocales.includes(name)) // skip any locale directories

  for (const entryName of entriesToCopy) {
    const srcPath = path.join(rootDir, entryName)
    const destPath = path.join(i18nDir, locale, entryName)

    console.log(`📂 Copying ${srcPath} -> ${destPath}`)
    copyEntry(srcPath, destPath, locale)
  }
}

console.log('\n✅ All locales processed successfully!')
