const Router = require('express')

const service = require('../services/file-service')
const multipart = require('connect-multiparty')

const router = Router()
const multipartMiddleware = multipart()

module.exports = router

router.post('/dataFile', multipartMiddleware, addDataFile)
router.post('/ontologyFile', multipartMiddleware, addOntologyFile)

router.get('/dataFile', getDataFiles)
router.get('/ontologyFile', getOntologyFiles)

function addDataFile (req, res, next) {
  let file = req.files['file']
  service.addDataFile(file, (err, id) => {
    if (err) return next(err)
    res.json(id)
  })
}

function addOntologyFile (req, res, next) {
  let file = req.files['file']
  service.addOntologyFile(file, (err, id) => {
    if (err) return next(err)
    res.json(id)
  })
}

function getDataFiles (req, res, next) {
  service.getDataFiles((err, files) => {
    if (err) return next(err)
    res.json(files)
  })
}

function getOntologyFiles (req, res, next) {
  service.getOntologyFiles((err, files) => {
    if (err) return next(err)
    res.json(files)
  })
}

module.exports = router
