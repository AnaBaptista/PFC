module.exports = {
  addPopulate,
  getPopulate,
  getPopulateOntologyFiles,
  getPopulateDataFiles,
  getPopulateTree,
  renderPopulate
}
const fileService = require('../services/file-service')

const db = require('../data-access/mongodb-access')
const populates = 'Populates'
const ontologyFiles = 'OntologyFiles'
const dataFiles = 'DataFiles'

function addPopulate (data, cb) {
  db.sendDocToDb(populates, data, (err, id) => {
    if (err) return cb(err)
    cb(null, id)
  })
}

function getPopulate (id, cb) {
  db.findById(populates, id, (err, res) => {
    if (err) return cb(err)
    cb(null, res)
  })
}

function getPopulateOntologyFiles (id, cb) {
  getPopulate(id, (err, res) => {
    if (err) return cb(err)
    db.findByIds(ontologyFiles, res.ontologyFiles, (err, oFiles) => {
      if (err) return cb(err)
      let files = oFiles.map(file => {
        return {
          _id: file._id.toString(),
          name: file.name,
          chaosid: file.chaosid}
      })
      cb(null, files)
    })
  })
}

function getPopulateDataFiles (id, cb) {
  getPopulate(id, (err, res) => {
    if (err) return cb(err)
    db.findByIds(dataFiles, res.dataFiles, (err, dFiles) => {
      if (err) return cb(err)
      let files = dFiles.map(file => {
        return {
          _id: file._id.toString(),
          name: file.name,
          chaosid: file.chaosid}
      })
      cb(null, files)
    })
  })
}

function getPopulateTree (id, cb) {
  getPopulateDataFiles(id, (err, files) => {
    if (err) return cb(err)
    fileService.getDataFileNodes(files.map(o => o.chaosid), (err, tree) => {
      if (err) return cb(err)
      cb(null, tree)
    })
  })
}

function renderPopulate (id, cb) {
  getPopulateOntologyFiles(id, (err, files) => {
    if (err) return cb(err)
    fileService.getOntologyFileClasses(files.map(onto => onto.chaosid), (err, classes) => {
      if (err) return cb(err)
      let ctx = {
        classes: classes,
        _id: id
      }
      cb(null, ctx)
    })
  })
}
