const Router = require('express')

const service = require('../services/file-service')
const multipart = require('connect-multiparty')

const router = Router()
const multipartMiddleware = multipart()

router.post('/dataFile', multipartMiddleware, addDataFile)
router.post('/ontologyFile', multipartMiddleware, addOntologyFile)

router.get('/dataFile/:id/nodes', getDataFileNodes)
router.get('/ontologyFile/:id/classes', getOntologyFileClasses)

router.get('/ontologyFiles', getOntologyFiles)

function addDataFile (req, res, next) {
  let file = req.files['file']
  service.addDataFile(file, (err, id) => {
    if (err) return next(err)
    res.redirect(`/dataFile/${id}/nodes`)
  })
}

function addOntologyFile (req, res, next) {
  let file = req.files['file']
  service.addOntologyFile(file, (err, id) => {
    if (err) return next(err)
    res.redirect(`/ontologyFile/${id}/classes`)
  })
}

function getDataFileNodes (req, res, next) {
  let id = req.params.id
  service.getDataFileNodes(id, (err, nodes) => {
    if (err) return next(err)
    res.json(nodes)
  })
}

function getOntologyFileClasses (req, res, next) {
  let id = req.params.id
  service.getOntologyFileClasses(id, (err, classes) => {
    if (err) return next(err)
    res.json(classes)
  })
}

function getOntologyFiles (req, res, next) {
  service.getOntologyFiles((err, files) => {
    if (err) return next(err)
    res.json(files)
  })
}

module.exports = router
