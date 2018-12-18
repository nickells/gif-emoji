const url = 'https://www.unicode.org/emoji/charts/full-emoji-list.html'
const fs = require('fs')
const puppeteer = require('puppeteer')

const go = async () => {
  console.log('Launching')
  const browser = await puppeteer.launch()
  console.log('Waiting for page')
  const page = await browser.newPage()
  console.log('Going to URL')
  await page.goto(url, {
    timeout: 0
  })
  console.log('Got to URL')
  // Get the "viewport" of the page, as reported by the page.
  const emoji = await page.evaluate(() => {
    // First three rows are headers and stuff
    const rows = [...document.getElementsByTagName('tr')]
    // .slice(0, 10)
    const data = rows.map(row => ({
      code: row.getElementsByTagName('a')[0] && row.getElementsByTagName('a')[0].getAttribute('name'),
      data: row.getElementsByTagName('img')[0] && row.getElementsByTagName('img')[0].src
    }))
      .filter(row => row.data)

    return data
  })

  fs.writeFile('images.json', JSON.stringify(emoji))

  emoji.forEach(datum => {
    console.log(datum)
    fs.writeFile('images/' + datum.code + '.png', Buffer.from(datum.data.replace(/^data:image\/\w+;base64,/, ''), 'base64'))
  })

  await browser.close()
}

try {
  go()
} catch (e) {
  console.log(e)
}
