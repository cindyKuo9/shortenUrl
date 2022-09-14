const db = require('../../config/mongoose')
const urlShorten = require('../urlShorten')
const urls = require('./urlShorten.json')

db.once('open', () => {
  urlShorten.create(urls)
    .then(() => { console.log('urlShortenSeeder done.') })
    .catch(error => console.log(error))
    .finally(() => db.close())
})