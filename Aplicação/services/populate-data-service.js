module.exports = {
  addPopulate,
  getPopulate,
  getPopulateOntologyFiles,
  getPopulateDataFiles,
  getPopulateTree,
  getPopulateIndividualTree,
  getPopulateIndividual,
  renderPopulateWithData,
  renderPopulateWithoutData
}
const fileService = require('../services/file-service')
const treeFunctions = require('../utils/tree-functions')

const db = require('../data-access/mongodb-access')
const populates = 'Populates'
const ontologyFiles = 'OntologyFiles'
const dataFiles = 'DataFiles'
const individual = 'IndividualMappings'

function addPopulate (data, cb) {
  data.indMappings = []
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
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    if (pop.tree) {
      return cb(null, pop.tree)
    } else {
      getPopulateDataFiles(id, (err, files) => {
        if (err) return cb(err)
        fileService.getDataFileNodes(files.map(o => o.chaosid), (err, tree) => {
          if (err) return cb(err)
          db.updateById(populates, id, {tree: tree}, (err) => {
            if (err) return cb(err)
            cb(null, tree)
          })
        })
      })
    }
  })
}

function getPopulateIndividual (id, ind, cb) {
  db.findById(individual, ind, (err, indMap) => {
    if (err) return cb(err)
    getPopulate(id, (err, pop) => {
      if (err) return cb(err)
      let find = pop.indMappings.find(obj => obj._id === ind)
      if (!find) {
        let indMappings = pop.indMappings
        indMappings.push({_id: ind, tag: indMap.tag, owlClassIRI: indMap.owlClassIRI})
        db.updateById(populates, id, {indMappings: indMappings}, (err) => {
          if (err) return cb(err)
          cb(null, indMap)
        })
      } else {
        cb(null, indMap)
      }
    })
  })
}

function getPopulateIndividualTree (id, ind, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    db.findById(individual, ind, (err, indMap) => {
      if (err) return cb(err)
      let tree = pop.tree.find(obj => obj.dataFileId === indMap.dataFileId)
      let indtree = []
      let aux = treeFunctions.searchById(tree, indMap.nodeId)
      indtree.push(aux)
      cb(null, indtree)
    })
  })
}

function renderPopulateWithData (id, cb) {
  getPopulateOntologyFiles(id, (err, files) => {
    if (err) return cb(err)
    getPopulate(id, (err, pop) => {
      if (err) return cb(err)
      fileService.getOntologyFileClasses(files.map(onto => onto.chaosid), (err, classes) => {
        if (err) return cb(err)
        let ctx = {
          classes: classes,
          _id: id,
          indMappings: pop.indMappings
        }
        cb(null, ctx)
      })
    })
  })
}

function renderPopulateWithoutData(id, cb) {
  getPopulateOntologyFiles(id, (err, files) => {

  })
}
