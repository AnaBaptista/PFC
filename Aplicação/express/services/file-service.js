module.exports = {
  addDataFile,
  addOntologyFile,
  getDataFileNodes,
  getOntologyFileClasses,
  getOntologyFileObjectProperties,
  getOntologyFileDataProperties,
  getOntologyFiles,
  getDataFiles,
  deleteDataFile,
  deleteOntologyFile,
  deleteOntologyFileOnChaosPop
}

const dataAccess = require('../data-access/file-access')
const db = require('../data-access/mongodb-access')

const dataFileCol = 'DataFiles'
const ontologyFileCol = 'OntologyFiles'

const async = require('async')

function addDataFile ({name, path}, cb) {
  addFile(path, name, dataFileCol, (err, ids) => {
    if (err) return cb(err)
    dataAccess.getDataFileNodes(ids.chaosid, (err, nodes) => {
      if (err) return cb(err)
      nodes = JSON.parse(nodes)
      db.updateById(dataFileCol, ids.id, {nodes: nodes.nodesTO}, (err) => {
        if (err) return cb(err)
        cb(null, {_id: ids.id})
      })
    })
  })
}

function addOntologyFile ({name, path}, cb) {
  addFile(path, name, ontologyFileCol, (err, ids) => {
    if (err) return cb(err)
    dataAccess.getOntologyFileClasses(ids.chaosid, (err, classes) => {
      if (err) return cb(err)
      getOntologyFileDataProperties(ids.chaosid, (err, dataProps) => {
        if (err) return cb(err)
        getOntologyFileObjectProperties(ids.chaosid, (err, objProps) => {
          if (err) return cb(err)
          let update = {
            classes: JSON.parse(classes),
            dataProperties: dataProps,
            objectProperties: objProps
          }
          db.updateById(ontologyFileCol, ids.id, update, (err) => {
            if (err) return cb(err)
            cb(null, {_id: ids.id})
          })
        })
      })
    })
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
        cb(null, {id: id, chaosid: chaosid})
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
      return cbReq(null, {dataFileId: data, nodes: JSON.parse(nodes)})
    })
  }, (err, res) => {
    if (err) return cb(err)
    let nodes = []
    res.forEach(obj => {
      nodes.push({dataFileId: obj.dataFileId, nodes: obj.nodes.nodesTO})
    })
    return cb(null, nodes)
  })
}

function getOntologyFileClasses (id, cb) {
  dataAccess.getOntologyFileClasses(id, (err, classes) => {
    if (err) return cb(err)
    return cb(null, {classes: JSON.parse(classes)})
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

function deleteDataFile (id, cb) {
  deleteFile(dataFileCol, id, (err, chaosid) => {
    if (err) return cb(err)
    dataAccess.deleteDataFile(chaosid, cb)
  })
}

function deleteOntologyFile (id, cb) {
  deleteFile(ontologyFileCol, id, (err, chaosid) => {
    if (err) return cb(err)
    deleteOntologyFileOnChaosPop(chaosid, cb)
  })
}

function deleteFile (col, id, cb) {
  db.findById(col, id, (err, file) => {
    if (err) return cb(err)
    db.deleteById(col, id, (err) => {
      if (err) return cb(err)
      return cb(null, file.chaosid)
    })
  })
}

function deleteOntologyFileOnChaosPop(id, cb) {
  dataAccess.deleteOntologyFile(id, cb)
}