const Router = require('express')

const service = require('../services/file-service')
const multipart = require('connect-multiparty')

const router = Router()
const multipartMiddleware = multipart()

module.exports = router

router.post('/dataFile', multipartMiddleware, addDataFile)
router.post('/ontologyFile', multipartMiddleware, addOntologyFile)

router.get('/dataFile', getDataFiles)
router.get('/dataFile/:id/nodes', getDataFileNodes)
router.get('/ontologyFile', getOntologyFiles)
router.get('/ontologyFile/:id/classes', getOntologyFileClasses)
router.get('/ontologyFile/:id/objectproperties', getOntologyFileObjectProperties)
router.get('/ontologyFile/:id/dataproperties', getOntologyFileDataProperties)

const listTotree = require('../utils/list-to-tree')

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

const fs = require('fs')
function getDataFileNodes (req, res, next) {
  let id = req.params.id
  // service.getDataFileNodes(id, (err, nodes) => {
  //   if (err) return next(err)
  //   let root = listTotree(nodes.nodes)
  //   res.json(root)
  // })
  let data = fs.readFileSync(`./utils/${id}`, 'utf8')
  let list = JSON.parse(data)
  let root = listTotree(list)
  res.json(root)
}

function getOntologyFiles (req, res, next) {
  service.getOntologyFiles((err, files) => {
    if (err) return next(err)
    res.json(files)
  })
}

function getOntologyFileClasses (req, res, next) {
  let id = req.params.id
  service.getOntologyFileClasses(id, (err, classes) => {
    if (err) return next(err)
    const ctx = {layout: false, id: id}
    Object.assign(ctx, classes)
    res.render('partials/ontologyclasses', ctx)
  })
}

function getOntologyFileObjectProperties (req, res, next) {
  let id = req.params.id
  service.getOntologyFileObjectProperties(id, (err, properties) => {
    if (err) return next(err)
    const ctx = {layout: false, id: id}
    Object.assign(ctx, properties)
    res.render('partials/ontologyproperties', ctx)
  })
}

function getOntologyFileDataProperties (req, res, next) {
  let id = req.params.id
  service.getOntologyFileDataProperties(id, (err, properties) => {
    if (err) return next(err)
    const ctx = {layout: false, id: id}
    Object.assign(ctx, properties)
    res.render('partials/ontologyproperties', ctx)
  })
}

module.exports = router
