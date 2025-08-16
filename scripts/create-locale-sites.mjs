import fs from 'fs'
import path from 'path'
import siteMetadata from '../data/siteMetadata.js' // adjust path

// --- Directories ---
const rootDir = path.resolve('app', '(root)') // source pages
const i18nDir = path.resolve('app', '(i18n)') // locale copies
const componentsDir = path.resolve('components') // components folder
const layoutDir = path.resolve('layouts') // layouts folder
const defaultLocale = Object.values(siteMetadata)[0].defaultLocale

// --- Get all locales from siteMetadata ---
const siteLocales = Object.keys(siteMetadata)
if (!siteLocales.length) {
  console.error('❌ No locales found in siteMetadata.')
  process.exit(1)
}

// --- Clean i18n directory ---
if (fs.existsSync(i18nDir)) {
  console.log(`🧹 Cleaning i18n directory: ${i18nDir}`)
  fs.rmSync(i18nDir, { recursive: true, force: true })
}
fs.mkdirSync(i18nDir, { recursive: true })

// --- Utility to copy directories/files recursively ---
function copyEntry(srcPath, destPath, locale) {
  const stats = fs.statSync(srcPath)

  if (stats.isDirectory()) {
    if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true })
    for (const entry of fs.readdirSync(srcPath)) {
      copyEntry(path.join(srcPath, entry), path.join(destPath, entry), locale)
    }
  } else {
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

    let content = fs.readFileSync(srcPath, 'utf8')
    content = content.replace(/getSiteHelpers\s*\(\s*\)/g, `getSiteHelpers('${locale}')`)
    fs.writeFileSync(destPath, content, 'utf8')
  }
}

// --- Scan components that use getSiteHelpers() ---
function getComponentsUsingGetSiteHelpers() {
  // return fs.readdirSync(componentsDir)
  //   .filter(file => (file.endsWith(".ts") || file.endsWith(".tsx")))
  //   .filter(file => /getSiteHelpers\s*\(/.test(fs.readFileSync(path.join(componentsDir, file), "utf8")));
  return ['Header.tsx', 'MobileNav.tsx', 'Link.tsx']
}

// --- Delete created locale-specific components ---
function deleteLocaleComponents(components, locales) {
  for (const locale of locales) {
    if (locale === defaultLocale) continue

    for (const comp of components) {
      const [name, ext] = comp.split('.')
      const filePath = path.join(componentsDir, `${name}__${locale}.${ext}`)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log(`🗑 Deleted: ${name}__${locale}.${ext}`)
      }
    }
  }
}

deleteLocaleComponents(getComponentsUsingGetSiteHelpers(), siteLocales)

// --- Copy and rename components per locale ---
function copyComponent(componentName, locale) {
  const srcPath = path.join(componentsDir, componentName)
  if (!fs.existsSync(srcPath)) return

  const [name, ext] = componentName.split('.')
  const destName = `${name}__${locale}.${ext}`
  const destPath = path.join(componentsDir, destName)

  let content = fs.readFileSync(srcPath, 'utf8')
  content = content.replace(/getSiteHelpers\s*\(\s*\)/g, `getSiteHelpers('${locale}')`)
  content = content.replace("import Link from './Link'", `import Link from './Link__${locale}'`)
  fs.writeFileSync(destPath, content, 'utf8')
}

// --- Update imports in files recursively ---
function updateImports(filePath, components, locale) {
  if (!fs.existsSync(filePath)) return
  const stats = fs.statSync(filePath)

  if (stats.isDirectory()) {
    for (const entry of fs.readdirSync(filePath)) {
      updateImports(path.join(filePath, entry), components, locale)
    }
  } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8')
    for (const component of components) {
      const [name] = component.split('.')
      const regex = new RegExp(`from ['"]@/components/${name}['"]`, 'g')
      content = content.replace(regex, `from '@/components/${name}__${locale}'`)
    }
    fs.writeFileSync(filePath, content, 'utf8')
  }
}

// --- Main logic ---
const componentsToCopy = getComponentsUsingGetSiteHelpers()
console.log('Components to copy:', componentsToCopy.join(', '))

for (const locale of siteLocales) {
  if (locale === defaultLocale) {
    console.log(`\nSkipping default locale: ${locale}`)
    continue
  }

  console.log(`\n🌐 Processing locale: ${locale}`)

  // Copy all root pages
  const entriesToCopy = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .map((e) => e.name)
    .filter((name) => !siteLocales.includes(name)) // skip any locale dirs

  for (const entryName of entriesToCopy) {
    const srcPath = path.join(rootDir, entryName)
    const destPath = path.join(i18nDir, locale, entryName)
    copyEntry(srcPath, destPath, locale)
  }

  // Copy components that use getSiteHelpers()
  for (const comp of componentsToCopy) {
    copyComponent(comp, locale)
  }

  // Update imports in i18n pages
  const localeAppDir = path.join(i18nDir, locale)
  updateImports(localeAppDir, componentsToCopy, locale)
}

console.log('\n✅ All locales processed successfully!')
