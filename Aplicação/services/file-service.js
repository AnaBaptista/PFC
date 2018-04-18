module.exports = {
  addDataFile,
  addOntologyFile
}

const dataAccess = require('../data-access/file-access')

function addDataFile ({name, path}, cb) {
  getDataFiles((err, files) => {
    if (err) return cb(err)
    addFile(path, (err, res) => {
      if (err) return cb(err)
      getDataFiles((err, currFiles) => {
        if (err) return cb(err)
        let id = currFiles.files.filter(elem => !files.files.includes(elem))
        getDataFileNodes(id, (err, nodes) => {
          if (err) return cb(err)
          cb(null, nodes)
        })
      })
    })
  })
}

function addOntologyFile ({name, path, cb}) {
  getOntologyFiles((err, files) => {
    if (err) return cb(err)
    addFile(path, (err, res) => {
      if (err) return cb(err)
      getOntologyFiles((err, currFiles) => {
        if (err) return cb(err)
        let id = currFiles.files.filter(elem => !files.files.includes(elem))
        getOntologyFileClasses(id, (err, nodes) => {
          if (err) return cb(err)
          cb(null, nodes)
        })
      })
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
