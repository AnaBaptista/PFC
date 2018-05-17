module.exports = {
  addDataFile,
  addOntologyFile,
  getDataFileNodes,
  getOntologyFileClasses,
  getOntologyFileObjectProperties,
  getOntologyFileDataProps: getOntologyFileDataProperties,
  getOntologyFiles,
  getDataFiles
}

const dataAccess = require('../data-access/file-access')
const async = require('async')
const listTotree = require('../utils/list-to-tree')

function addDataFile ({name, path}, cb) {
  addFile(path, (err, id) => {
    if (err) return cb(err)
    cb(null, {dataFileId: id})
  })
}

function addOntologyFile ({name, path}, cb) {
  addFile(path, (err, id) => {
    if (err) return cb(err)
    cb(null, {ontologyFileId: id})
  })
}

function addFile (path, cb) {
  dataAccess.addFile(path, (err, id) => {
    if (err) return cb(err)
    cb(null, id)
  })
}

function getDataFiles (cb) {
  dataAccess.getDataFiles((err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.toString())
    return cb(null, {files: obj.dataFilesTO})
  })
}

function getDataFileNodes (ids, cb) {
  async.map(ids, (data, cbReq) => {
    dataAccess.getDataFileNodes(data, (err, nodes) => {
      if (err) return cb(err)
      return cbReq(null, JSON.parse(nodes))
    })
  }, (err, res) => {
    if (err) return cb(err)
    let tree = []
    res.forEach(nodes => {
      let root = listTotree(nodes.nodesTO)
      root.parentid = '0'
      tree.push(root)
    })
    return cb(null, tree)
  })
}

function getOntologyFiles (cb) {
  dataAccess.getOntologyFiles((err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.toString())
    return cb(null, {files: obj.ontologyFilesTO})
  })
}

function getOntologyFileClasses (ids, cb) {
  async.map(ids, (ont, cbReq) => {
    dataAccess.getOntologyFileClasses(ont.id, (err, classes) => {
      if (err) return cb(err)
      return cbReq(null, {classes: JSON.parse(classes), id: ont.id})
    })
  }, (err, res) => {
    if (err) return cb(err)
    let classes = []
    res.forEach(obj => {
      let map = (obj.classes).map(c => {
        return {IRI: c, ontologyId: obj.id}
      })
      classes = classes.concat(map)
    })
    cb(null, classes)
  })
}

function getOntologyFileObjectProperties (id, cb) {
  dataAccess.getOntologyFileObjectProperties(id, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.toString())
    return cb(null, {properties: obj})
  })
}

function getOntologyFileDataProperties (id, cb) {
  dataAccess.getOntologyFileDataProps(id, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.toString())
    return cb(null, {properties: obj})
  })
}
