module.exports = {
  addPopulate,
  addIndividualToPopulate,
  createOutputFile,
  deleteIndividualFromPopulate,
  getPopulateDataTree,
  getPopulateDataMapping,
  getPopulateDataIndividualTree,
  getPopulateDataIndividual,
  getPopulateNonDataIndividual,
  renderPopulate
}
const fileService = require('../services/file-service')
const individualService = require('../services/individual-mapping-service')
const treeFunctions = require('../utils/tree-functions')
const dataAccess = require('../data-access/populate-access')
const db = require('../data-access/mongodb-access')
const populates = 'Populates'
const ontologyFiles = 'OntologyFiles'
const dataFiles = 'DataFiles'

/**
 * GENERIC POPULATE
 */
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

function createOutputFile (id, cb) {
  db.findById(populates, id, (err, pop) => {
    if (!pop.chaosid) {
      let error = new Error('Create the mapping first')
      error.statusCode = 400
      return cb(error)
    } else {
      let data = {
        mappingIds: [pop.chaosid]
      }
      dataAccess.createBatch(data, (err, batchId) => {
        batchId = JSON.parse(batchId)
        if (err) return cb(err)
        dataAccess.processBatch(batchId, (err, res) => {
          if (err) return cb(err)
          cb(null, res)
        })
      })
    }
  })
}

function addIndividualToPopulate (id, ind, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    let indMappings = (pop.indMappings === undefined && []) || pop.indMappings
    indMappings.push(ind)
    db.updateById(populates, id, {indMappings: indMappings}, (err) => {
      if (err) return cb(err)
      cb()
    })
  })
}

function deleteIndividualFromPopulate (id, ind, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    let indMappings = pop.indMappings.filter(individual => individual._id !== ind)
    db.updateById(populates, id, {indMappings: indMappings}, (err) => {
      if (err) return cb(err)
      cb()
    })
  })
}

function renderPopulate (id, cb) {
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
        if (pop.chaosid) {
          ctx.chaosid = pop.chaosid
        }
        cb(null, ctx)
      })
    })
  })
}

function getPopulateOntologyFiles (id, cb) {
  getPopulate(id, (err, res) => {
    if (err) return cb(err)
    db.findByIds(ontologyFiles, res.ontologyFiles.map(o => o.id), (err, oFiles) => {
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

/**
 * POPULATE WITH DATA
 */

function getPopulateDataFiles (id, cb) {
  getPopulate(id, (err, res) => {
    if (err) return cb(err)
    db.findByIds(dataFiles, res.dataFiles.map(d => d.id), (err, dFiles) => {
      if (err) return cb(err)
      let files = dFiles.map(file => {
        return {
          _id: file._id.toString(),
          name: file.name,
          chaosid: file.chaosid,
          nodes: file.nodes
        }
      })
      cb(null, files)
    })
  })
}

function getPopulateDataTree (id, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    if (pop.tree) {
      return cb(null, pop.tree)
    } else {
      getPopulateDataFiles(id, (err, files) => {
        if (err) return cb(err)
        let tree = getPopulateTreeAux(files)
        db.updateById(populates, id, {tree: tree}, (err) => {
          if (err) return cb(err)
          cb(null, tree)
        })
      })
    }
  })
}

function getPopulateTreeAux (files) {
  let tree = []
  files.forEach(file => {
    let root = treeFunctions.listToTree(file.nodes)
    root.parentid = '0'
    root.dataFileId = file.chaosid
    tree.push(root)
  })
  return tree
}

function getPopulateDataMapping (id, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    if (pop.indMappings) {
      individualService.getIndividualMappingByIds(pop.indMappings.map(i => i._id), (err, results) => {
        if (err) return cb(err)
        let indMappings = results.filter(i => i.chaosid)
        cb(null, {indMappings: indMappings, _id: id})
      })
    } else {
      cb(null, [])
    }
  })
}

function getPopulateDataIndividual (ind, cb) {
  individualService.getIndividualMapping(ind, (err, individual) => {
    if (err) return cb(err)
    cb(null, individual)
  })
}

function getPopulateDataIndividualTree (id, ind, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    individualService.getIndividualMapping(ind, (err, individual) => {
      if (err) return cb(err)
      let tree = pop.tree.find(obj => obj.dataFileId === individual.dataFileId)
      let indtree = []
      let aux = treeFunctions.searchById(tree, individual.nodeId)
      indtree.push(aux)
      cb(null, indtree)
    })
  })
}

/**
 * POPULATE WITHOUT DATA
 */

function getPopulateNonDataIndividual (id, ind, cb) {
  individualService.getIndividualMapping(ind, (err, individual) => {
    if (err) return cb(err)
    cb(null, individual)
  })
}
