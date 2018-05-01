const Router = require('express')

const service = require('../services/file-service')
const multipart = require('connect-multiparty')

const router = Router()
const multipartMiddleware = multipart()

router.post('/dataFile', multipartMiddleware, addDataFile)
router.get('/dataFile/:id/nodes', getDataFileNodes)

router.post('/ontologyFile', multipartMiddleware, addOntologyFile)
router.get('/ontologyFile/:id/classes', getOntologyFileClasses)
router.get('/ontologyFile/:id/objectproperties', getOntologyFileObjectProperties)
router.get('/ontologyFile/:id/dataproperties', getOntologyFileDataProperties)
router.get('/ontologyFiles', getOntologyFiles)

function addDataFile (req, res, next) {
  /* let file = req.files['file']
  service.addDataFile(file, (err, id) => {
    if (err) return next(err)
    res.redirect(`/dataFile/${id}/nodes`)
  }) */
  let id = '5ae3919a4f0cc6946f90afb8'
  res.redirect(`/dataFile/${id}/nodes`)
}

function addOntologyFile (req, res, next) {
  /* let file = req.files['file']
  service.addOntologyFile(file, (err, id) => {
    if (err) return next(err)
    res.redirect(`/ontologyFile/${id}/classes`)
  }) */
  let id = '5ac4b52e4f0c4b28125c8512'
  const ctx = {layout: false, id: id}
  res.render('partials/ontologycontent', ctx)
}

function getDataFileNodes (req, res, next) {
  let id = req.params.id
  service.getDataFileNodes(id, (err, nodes) => {
    if (err) return next(err)
    let root = list_to_tree(nodes.nodes)
    res.json(root)
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

function getOntologyFiles (req, res, next) {
  service.getOntologyFiles((err, files) => {
    if (err) return next(err)
    res.json(files)
  })
}

function list_to_tree (list) {
  let map = {}, node, roots = [], i
  let nodes = []
  for (i = 0; i < list.length; i += 1) {
    map[list[i]._id] = i // initialize the map
    nodes[i] = {
      tag: list[i].tag,
      value: list[i].value
    }
    if (list[i].parent) {
      nodes[i].parent = list[i].parent
    }
    nodes[i].children = [] // initialize the children
  }
  for (i = 0; i < nodes.length; i += 1) {
    node = nodes[i]
    if (node.parent) {
      // if you have dangling branches check that map[node.parentId] exists
      nodes[map[node.parent]].children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

module.exports = router
