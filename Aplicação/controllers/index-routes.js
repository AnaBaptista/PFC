const Router = require('express')
const router = Router()

const service = require('../services/index-service')

module.exports = router

router.get('/', home)

function home (req, res, next) {
  service.home((err, home) => {
    if (err) return next(err)
    res.render('index', home)
  })
}
