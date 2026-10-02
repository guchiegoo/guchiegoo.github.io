// Bundle budget check: initial JS must stay at or under 200 KB gzipped.
// Gzips every dist/assets/*.js, prints sizes and the total, then exits 1 when
// the largest entry chunk (or the entry plus its modulepreloads) is over budget.
// Run after `npm run build`.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const BUDGET = 200 * 1024
const dist = 'dist'
const assets = join(dist, 'assets')

if (!existsSync(assets)) {
  console.error('check-size: dist/assets not found. Run `npm run build` first.')
  process.exit(1)
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`
const gz = (file) => gzipSync(readFileSync(join(assets, file)), { level: 9 }).length

const files = readdirSync(assets).filter((f) => f.endsWith('.js'))
const sizes = new Map(files.map((f) => [f, gz(f)]))

// Entry chunks are the module scripts in index.html; preloads are fetched up front too.
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const refs = (re) => [...html.matchAll(re)].map((m) => m[1].split('/').pop())
const entries = refs(/<script[^>]+type="module"[^>]+src="([^"]+\.js)"/g)
const preloads = refs(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+\.js)"/g)

let total = 0
for (const [file, size] of sizes) {
  total += size
  const tag = entries.includes(file) ? ' (entry)' : preloads.includes(file) ? ' (preload)' : ''
  console.log(`  ${file.padEnd(32)} ${kb(size).padStart(10)} gzip${tag}`)
}
console.log(`  ${'total'.padEnd(32)} ${kb(total).padStart(10)} gzip`)

const largestEntry = Math.max(0, ...entries.map((f) => sizes.get(f) ?? 0))
const initial = [...entries, ...preloads].reduce((n, f) => n + (sizes.get(f) ?? 0), 0)
console.log(`  largest entry chunk: ${kb(largestEntry)}   initial JS: ${kb(initial)}   budget: ${kb(BUDGET)}`)

if (entries.length === 0) {
  console.error('check-size: no entry <script type="module"> found in dist/index.html.')
  process.exit(1)
}
if (largestEntry > BUDGET || initial > BUDGET) {
  console.error(`check-size: FAIL, initial JS is over the ${kb(BUDGET)} gzip budget.`)
  process.exit(1)
}
console.log('check-size: OK')
