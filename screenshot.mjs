import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const puppeteer = require('/home/sung/.nvm/versions/node/v22.16.0/lib/node_modules/puppeteer')
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const url = process.argv[2] || 'http://localhost:3000'
const label = process.argv[3] || ''

const screenshotDir = path.join(__dirname, 'temp-screenshots')
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true })
}

const existing = fs.readdirSync(screenshotDir)
  .map(f => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map(m => parseInt(m[1]))
  .sort((a, b) => b - a)

const n = (existing[0] ?? 0) + 1
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`
const filepath = path.join(screenshotDir, filename)

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle2' })
await page.screenshot({ path: filepath, fullPage: false })
await browser.close()

console.log(`Saved: ${filepath}`)
