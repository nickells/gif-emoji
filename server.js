
const express = require('express')
const emojiUnicode = require('emoji-unicode')
const emojiMap = require('emoji-name-map')
const GIFEncoder = require('gifencoder')
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

const app = express()

const data = require('./images.json')

const index = data.reduce((map, item) => {
  map[item.code] = item.data.replace(/^data:image\/png;base64,/, '')
  return map
}, {})

const backgroundColor = 0xffffff

app.get('/generate/:string', async (req, res) => {
  console.log(req.params.string)

  const names = req.params.string.split('+')

  const encoder = new GIFEncoder(72, 72)
  encoder.start()
  encoder.setRepeat(0) // 0 for repeat, -1 for no-repeat
  encoder.setDelay(500) // frame delay in ms
  encoder.setQuality(10) // image quality. 10 is default.
  // encoder.setTransparent(backgroundColor) // UNCOMMENT FOR TRANSPARENCY

  const canvas = createCanvas(72, 72)
  const ctx = canvas.getContext('2d')

  for (let name of names) {
    const code = emojiUnicode(emojiMap.get(name) || name)

    // TODO: See if raw base64 data is any quicker
    // const data = index[code]

    const img = await loadImage(`./images/png/${code}.png`)
    ctx.clearRect(0, 0, 72, 72)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, 72, 72)
    ctx.drawImage(img, 0, 0, 72, 72)
    encoder.addFrame(ctx)
  }

  encoder.finish()

  const buffer = encoder.out.getData()

  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': buffer.length
  })
  res.end(buffer)
})

app.listen('9000')
