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

router.post('/dataFile/nodes', getDataFileNodes)
router.post('/ontologyFile/classes', getOntologyFileClasses)
router.post('/ontologyFile/objectproperties', getOntologyFileObjectProperties)
router.post('/ontologyFile/dataproperties', getOntologyFileDataProperties)

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

function getDataFileNodes (req, res, next) {
  let ids = req.body.ids
  service.getDataFileNodes(ids, (err, nodes) => {
    if (err) return next(err)
    res.json(nodes)
  })
}

function getOntologyFileClasses (req, res, next) {
  let ids = req.body.ids
  service.getOntologyFileClasses(ids, (err, classes) => {
    if (err) return next(err)
    const ctx = {layout: false}
    Object.assign(ctx, classes)
    res.render('partials/ontologyClasses', ctx)
  })
}

function getOntologyFileObjectProperties (req, res, next) {
  let ids = req.body.ids
  service.getOntologyFileObjectProperties(ids, (err, properties) => {
    if (err) return next(err)
    const ctx = {layout: false}
    Object.assign(ctx, properties)
    res.render('partials/ontologyProperties', ctx)
  })
}

function getOntologyFileDataProperties (req, res, next) {
  let ids = req.body.ids
  service.getOntologyFileDataProperties(ids, (err, properties) => {
    if (err) return next(err)
    const ctx = {layout: false}
    Object.assign(ctx, properties)
    res.render('partials/ontologyProperties', ctx)
  })
}

module.exports = router
