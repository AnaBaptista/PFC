const Router = require('express')

const service = require('../services/file-service')
const multipart = require('connect-multiparty')

const router = Router()
const multipartMiddleware = multipart()

router.post('/dataFile', multipartMiddleware, addDataFile)
router.post('/ontologyFile', multipartMiddleware, addOntologyFile)

function addDataFile (req, res, next) {
  let file = req.files['file']
  service.addFile(file, (err, id) => {
    if (err) return next(err)
    res.status(200).end()
  })
}

function addOntologyFile (req, res, next) {
  let file = req.files['file']
  service.addFile(file, (err, id) => {
    if (err) return next(err)
    res.status(200).end()
  })
}

module.exports = router
