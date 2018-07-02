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

router.delete('/dataFile/:id', deleteDataFile)
router.delete('/ontologyFile/:id', deleteOntologyFile)

function addDataFile (req, res, next) {
  console.log('POST -> /dataFile, addDataFile')
  let file = req.files['file']
  service.addDataFile(file, (err, id) => {
    if (err) return next(err)
    res.json(id)
  })
}

function addOntologyFile (req, res, next) {
  console.log('POST -> /ontologyFile, addOntologyFile')
  let file = req.files['file']
  service.addOntologyFile(file, (err, id) => {
    if (err) return next(err)
    res.json(id)
  })
}

function getDataFiles (req, res, next) {
  console.log('GET -> /dataFile, getDataFiles')
  service.getDataFiles((err, files) => {
    if (err) return next(err)
    res.json(files)
  })
}

function getOntologyFiles (req, res, next) {
  console.log('GET -> /ontologyFile, getOntologyFiles')
  service.getOntologyFiles((err, files) => {
    if (err) return next(err)
    res.json(files)
  })
}

function deleteDataFile (req, res, next) {
  let id = req.params.id
  service.deleteDataFile(id, (err) => {
    if (err) return next(err)
    res.end()
  })
}

function deleteOntologyFile (req, res, next) {
  let id = req.params.id
  service.deleteOntologyFile(id, (err) => {
    if (err) return next(err)
    res.end()
  })
}
