module.exports = {
  addDataFile,
  addOntologyFile,
  getDataFileNodes,
  getOntologyFileClasses,
  getOntologyFileObjectProperties,
  getOntologyFileDataProperties,
  getOntologyFiles,
  getDataFiles
}

const dataAccess = require('../data-access/file-access')
const db = require('../data-access/mongodb-access')

const dataFileCol = 'DataFiles'
const ontologyFileCol = 'OntologyFiles'

const async = require('async')
const listTotree = require('../utils/list-to-tree')

function addDataFile ({name, path}, cb) {
  addFile(path, name, dataFileCol, (err, id) => {
    if (err) return cb(err)
    cb(null, {_id: id})
  })
}

function addOntologyFile ({name, path}, cb) {
  addFile(path, name, ontologyFileCol, (err, id) => {
    if (err) return cb(err)
    cb(null, {_id: id})
  })
}

function addFile (path, name, col, cb) {
  db.findByQuery(col, {name: name}, (err, file) => {
    if (err) return cb(err)
    if (file.length !== 0) {
      let error = new Error(`File named ${name} already exists`)
      error.status = 409
      return cb(error)
    }
    dataAccess.addFile(path, (err, chaosid) => {
      if (err) return cb(err)
      db.sendDocToDb(col, {name: name, chaosid: chaosid}, (err, id) => {
        if (err) return cb(err)
        cb(null, id)
      })
    })
  })
}

function getDataFiles (cb) {
  getFiles(dataFileCol, cb)
}

function getOntologyFiles (cb) {
  getFiles(ontologyFileCol, cb)
}

function getFiles (col, cb) {
  db.findByQuery(col, {}, (err, res) => {
    if (err) return cb(err)
    let files = res.map(o => {
      return {
        _id: o._id.toString(),
        name: o.name,
        chaosid: o.chaosid
      }
    })
    return cb(null, files)
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

function getOntologyFileClasses (ids, cb) {
  async.map(ids, (ont, cbReq) => {
    dataAccess.getOntologyFileClasses(ont, (err, classes) => {
      if (err) return cb(err)
      return cbReq(null, {classes: JSON.parse(classes), id: ont})
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
    return cb(null, obj)
  })
}

function getOntologyFileDataProperties (id, cb) {
  dataAccess.getOntologyFileDataProperties(id, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.toString())
    return cb(null, obj)
  })
}
