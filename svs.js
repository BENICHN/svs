import fs from 'fs'
import path from 'path'
import { launch } from 'puppeteer'

let argv = process.argv.slice(2)
if (argv.length < 2) {
    console.log("usage: node svs.js <url> <output_path> [selector_to_hide=''] [pages_delay=2000] [first_page_delay=3000]")
    process.exit(0)
}
let dir = path.dirname(process.argv[1])
let vars = JSON.parse(fs.readFileSync(`${dir}/vars.json`, 'utf8'))
let url = argv[0]
let dest = argv[1]
let selectorToHide = argv.length >= 3 ? argv[2] : ''
let pagesDelay = argv.length >= 4 ? argv[3] : 2000
let firstPageDelay = argv.length >= 5 ? argv[4] : 3000
console.log(`opening browser ...`)
const browser = await launch({ headless: false, args: ['--no-sandbox'], protocolTimeout: 999999999 })
let page = await browser.newPage();
console.log(`opening url ${url} ...`)
await page.goto(url)
await page.$eval('#pscope', (el, v) => el.value = v, vars.pscope)
await page.$eval('#username', (el, v) => el.value = v, vars.username)
await page.$eval('#password', (el, v) => el.value = v, vars.password)
await page.$eval('#login-form', el => el.submit())
await page.waitForSelector('#player')
let pUrl = await page.$eval('#player', el => el.src)
page.goto(pUrl)
await page.waitForSelector('#page-container')
console.log(`collecting pages ...`)
if (selectorToHide.length > 0) {
    let c = `${selectorToHide}{visibility:collapse;}`
    await page.addStyleTag({ content: c })
    console.log(`added style tag ${c}`)
}
let [elems, szs] = await page.$eval('#page-container', async (pc, firstPageDelay, pagesDelay) => {
    let szs = []
    let elems = []
    let n = pc.children.length
    for (let i = 0; i < n; i++) {
        let el = pc.children[i]
        if (el.classList.contains('pf')) {
            el.scrollIntoView()
            await new Promise(r => setTimeout(r, i == 0 ? firstPageDelay : pagesDelay));
            el = pc.children[i]
            elems.push(el.innerHTML)
            szs.push({
                width: el.clientWidth,
                height: el.clientHeight
            })
        }
    }
    return [elems, szs]
}, firstPageDelay, pagesDelay)
let n = elems.length
let z = n.toString().length
console.log(`collected ${n} pages`)
console.log(`saving pages in folder ${dest} ...`)
fs.mkdirSync(dest, { recursive: true })
await page.addStyleTag({ content: 'body{margin:0;}' })
for (let i = 0; i < n; i++) {
    const el = elems[i];
    const vp = szs[i];
    console.log(`size of page ${i} : ${JSON.stringify(vp)}`)
    await page.setViewport(vp)
    await page.$eval('body', (b, el) => {
        b.innerHTML = el
    }, el)
    let path = `${dest}/page${i.toString().padStart(z, '0')}.pdf`
    await page.pdf({
        path: path,
        width: vp.width * 3,
        height: vp.height * 3
    })
    console.log(`${path} saved`)
}

await browser.close()