const debug = require('debug')('HOMI::Server')

const Router = require('express')
const router = Router()

const service = require('../services/index-service')

module.exports = router

router.get('/', home)
router.get('/download', download)

/*
 * Renders Home
 */
function home (req, res, next) {
  debug('GET /')
  service.home((err, home) => {
    if (err) return next(err)
    res.render('index', home)
  })
}

/*
 * Renders download page
 */
function download (req, res, next) {
  debug('GET /dowload')
  res.render('download')
}
