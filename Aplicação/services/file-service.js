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
  addFile(path, (err, res) => {
    if (err) return cb(err)
    getDataFiles((err, currFiles) => {
      if (err) return cb(err)
      let currFile = currFiles.files.pop()
      cb(null, currFile._id)
    })
  })
}

function addOntologyFile ({name, path}, cb) {
  addFile(path, (err, res) => {
    if (err) return cb(err)
    getOntologyFiles((err, currFiles) => {
      if (err) return cb(err)
      let currFile = currFiles.files.pop()
      return cb(null, currFile._id)
    })
  })
}

function addFile (path, cb) {
  dataAccess.addFile(path, (err, id) => {
    if (err) return cb(err)
    cb()
  })
}

function getDataFiles (cb) {
  dataAccess.getDataFiles((err, res) => {
    if (err) return cb(err)
    return cb(null, {files: res})
  })
}

function getDataFileNodes (id, cb) {
  dataAccess.getDataFileNodes(id, (err, res) => {
    if (err) return cb(err)
    return cb(null, {nodes: res})
  })
}

function getOntologyFiles (cb) {
  dataAccess.getOntologyFiles((err, res) => {
    if (err) return cb(err)
    return cb(null, {files: res})
  })
}

function getOntologyFileClasses (id, cb) {
  dataAccess.getOntologyFileClasses(id, (err, res) => {
    if (err) return cb(err)
    return cb(null, {classes: res})
  })
}

function getOntologyFileObjectProperties (id, cb) {
  dataAccess.getOntologyFileObjectProperties(id, (err, res) => {
    if (err) return cb(err)
    return cb(null, {properties: res})
  })
}

function getOntologyFileDataProperties (id, cb) {
  dataAccess.getOntologyFileDataProperties(id, (err, res) => {
    if (err) return cb(err)
    return cb(null, {properties: res})
  })
}
