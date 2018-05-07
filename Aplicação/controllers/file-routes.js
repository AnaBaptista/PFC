const Router = require('express')

const service = require('../services/file-service')
const multipart = require('connect-multiparty')

const router = Router()
const multipartMiddleware = multipart()

module.exports = router

router.post('/dataFile', multipartMiddleware, addDataFile)
router.get('/dataFile/:id/nodes', getDataFileNodes)

router.post('/ontologyFile', multipartMiddleware, addOntologyFile)
router.get('/ontologyFile/:id/classes', getOntologyFileClasses)
router.get('/ontologyFile/:id/objectproperties', getOntologyFileObjectProperties)
router.get('/ontologyFile/:id/dataproperties', getOntologyFileDataProperties)
router.get('/ontologyFiles', getOntologyFiles)

/***
 *
 */
router.get('/mapping/:dataFileId/to/:ontologyFileId', getMapperContent)
router.post('/mapping/:dataFileId/individualMapping', addIndividualMapping)

let maps = {}
const listTotree = require('../utils/list-to-tree')

function addDataFile (req, res, next) {
  /* let file = req.files['file']
  service.addDataFile(file, (err, id) => {
    if (err) return next(err)
    res.redirect(`/dataFile/${id}/nodes`)
  }) */
  let id = '5ae3919a4f0cc6946f90afb8'
  res.json({dataFileId: id})
  // res.redirect(`/dataFile/${id}/nodes`)
}

function addOntologyFile (req, res, next) {
  /* let file = req.files['file']
  service.addOntologyFile(file, (err, id) => {
    if (err) return next(err)
    res.redirect(`/ontologyFile/${id}/classes`)
  }) */
  let id = '5ac4b52e4f0c4b28125c8512'
  res.json({ontologyFileId: id})
  // const ctx = {layout: false, id: id}
  // res.render('partials/ontologycontent', ctx)
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

function getOntologyFiles (req, res, next) {
  service.getOntologyFiles((err, files) => {
    if (err) return next(err)
    res.json(files)
  })
}

function getMapperContent (req, res, next) {
  let ontologyId = req.params.ontologyFileId
  let dataFileId = req.params.dataFileId
  service.getOntologyFileClasses(ontologyId, (err, classes) => {
    const ctx = {
      ontologyFileId: ontologyId,
      dataFileId: dataFileId,
      classes: classes.classes
    }
    res.render('mapper', ctx)
  })
}

function addIndividualMapping (req, res, next) {
  let dataFileId = req.params.dataFileId
  let ontologyId = req.body.ontologyId
  let map = req.body.map
  maps[map.nodeId] = map

  service.getOntologyFileDataProperties(ontologyId, (err, dproperties) => {
    service.getOntologyFileObjectProperties(ontologyId, (err, oproperties) => {
      const ctx = {
        layout: false,
        ontologyFileId: ontologyId,
        dataFileId: dataFileId,
        dproperties: dproperties.properties,
        oproperties: oproperties.properties,
        nodeId: map.nodeId
      }
      res.render('partials/individualmaps', ctx)
    })
  })
}

module.exports = router
