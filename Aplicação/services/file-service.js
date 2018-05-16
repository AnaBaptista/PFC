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

function getDataFileNodes (id, cb) {
  dataAccess.getDataFileNodes(id, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.toString())
    return cb(null, {nodes: obj})
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
  dataAccess.getOntologyFileClasses(ids, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.toString())
    return cb(null, {classes: obj})
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
  dataAccess.getOntologyFileDataProperties(id, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.toString())
    return cb(null, {properties: obj})
  })
}
