
const express = require('express')
const emojiUnicode = require('emoji-unicode')
const emojiMap = require('emoji-name-map')
const gifshot = require('gifshot')

const app = express()

const data = require('./images.json')

const index = data.reduce((map, item) => {
  map[item.code] = item.data.replace(/^data:image\/png;base64,/, '')
  return map
}, {})

app.get('/generate/:string', (req, res) => {
  console.log(req.params.string)
  console.log(emojiMap.get(req.params.string))
  const code = emojiUnicode(emojiMap.get(req.params.string))
  const data = index[code]

  const img = Buffer.from(data, 'base64')

  res.writeHead(200, {
    'Content-Type': 'image/gif',
    'Content-Length': img.length
  })
  res.end(img)
})

app.listen('9000')
