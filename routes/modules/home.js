const express = require('express')
const router = express.Router()
const urlShorten = require('../../models/urlShorten')


router.get('/', (req, res) => {
  res.render('index')
  console.log('home')
})

router.post('/', (req, res) => {
  const oriUrl = req.body.oriUrl
  let urlItem = {}
  let shortUrl = ''
  urlShorten.find()
    .lean()
    .then(urls => {
      urlItem = urls.find(urlItem => urlItem.url === oriUrl)
      if (urlItem) {
        shortUrl = urlItem.shortenUrl
      } else {
        do {
          shortUrl = randomString(5)
          console.log(shortUrl)
        } while (urls.some(urlItem => urlItem.shortenUrl === shortUrl))
        urlShorten.create({ url: oriUrl, shortenUrl: shortUrl })
      }
    })
    .then(() => {
      res.render('shortenUrl', { oriUrl, shortUrl: req.headers.host + '/' + shortUrl })
    })
    .catch(error => console.log(error))
})

router.get('/:shortUrl', (req, res) => {
  console.log(req.params.shortUrl)
  urlShorten.findOne({ shortenUrl: req.params.shortUrl })
    .lean()
    .then(url => {
      if (url) {
        console.log(url.url)
        res.redirect(url.url)
      } else {
        res.render('notFind', { shortUrl: req.headers.host + '/' + req.params.shortUrl })
      }
    })
    .catch(error => console.log(error))
})

function randomString(length) {
  let alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const characters = alphabet + alphabet.toUpperCase() + '0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIdx = Math.floor(Math.random() * characters.length)
    result += characters[randomIdx]
  }
  return result
}

module.exports = router