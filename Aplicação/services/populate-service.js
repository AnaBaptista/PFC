module.exports = {
  addPopulate,
  getPopulate,
  addIndividualToPopulate,
  createOutputFile,
  deleteIndividualFromPopulate,
  beginProcessOfPopulateWithoutData,
  getPopulateDataTree,
  getPopulateDataMapping,
  getPopulateDataIndividualTree,
  getPopulateDataIndividual,
  getPopulateNonDataMapping,
  getPopulateNonDataIndividual,
  renderPopulate
}
const fileService = require('../services/file-service')
const indMapService = require('../services/individual-mapping-service')
const treeFunctions = require('../utils/tree-functions')
const fakeFileMaker = require('../utils/FakeFileMaker')
const dataAccess = require('../data-access/populate-access')
const db = require('../data-access/mongodb-access')

const async = require('async')
const fs = require('fs')

const populates = 'Populates'
const ontologyFiles = 'OntologyFiles'
const dataFiles = 'DataFiles'
const indMapping = 'IndividualMappings'

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
          let outputFileId = JSON.parse(res)
          let set = {outputFileId: outputFileId}
          db.updateById(populates, id, set, (err) => {
            if (err) return cb(err)
            cb()
          })
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
          chaosid: file.chaosid
        }
      })
      cb(null, files)
    })
  })
}

function getPopulateMapping (id, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    if (pop.indMappings) {
      indMapService.getIndividualMappingByIds(pop.indMappings.map(i => i._id), (err, results) => {
        if (err) return cb(err)
        cb(null, results)
      })
    } else {
      cb(null, [])
    }
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
  getPopulateMapping(id, (err, results) => {
    if (err) return cb(err)
    let indMappings = results.filter(i => i.chaosid)
    cb(null, {indMappings: indMappings, _id: id})
  })
  // getPopulate(id, (err, pop) => {
  //   if (err) return cb(err)
  //   if (pop.indMappings) {
  //     indMapService.getIndividualMappingByIds(pop.indMappings.map(i => i._id), (err, results) => {
  //       if (err) return cb(err)
  //       let indMappings = results.filter(i => i.chaosid)
  //       cb(null, {indMappings: indMappings, _id: id})
  //     })
  //   } else {
  //     cb(null, [])
  //   }
  // })
}

function getPopulateDataIndividual (ind, cb) {
  indMapService.getIndividualMapping(ind, (err, individual) => {
    if (err) return cb(err)
    cb(null, individual)
  })
}

function getPopulateDataIndividualTree (id, ind, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    indMapService.getIndividualMapping(ind, (err, individual) => {
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

function beginProcessOfPopulateWithoutData (listOfIds, cb) {
  async.map(listOfIds,
    (id, next) => {
      db.findById(indMapping, id, (err, results) => {
        if (err) return next(err)
        next(null, results)
      })
    },
    (err, listOfIndividuals) => {
      if (err) return cb(err)
      return postFakeFile(listOfIndividuals, cb)
    })
}

function postFakeFile (listOfIndividuals, cb) {
  if (listOfIndividuals[0].dataFileId !== undefined) saveToDBAndChaos(listOfIndividuals, cb)
  else {
    fakeFileMaker(listOfIndividuals, (err, name, path) => {
      if (err) return cb(err)
      fileService.addDataFile({name, path}, (err, id) => {
        if (err) return cb(err)
        listOfIndividuals.forEach(individual => parseIndividualToInMap(individual, id._id.toString()))
        fs.unlink(path, (err) => {
          if (err) return cb(err)
        })
        saveToDBAndChaos(listOfIndividuals, cb)
      })
    })
  }
}

function parseIndividualToInMap (individual, dataFileId) {
  individual.tag = `_${individual._id.toString()}`
  let base = `.inspecificchild-_${individual._id.toString()}`
  individual.individualName = `${base}-individualName`
  individual.dataFileId = dataFileId
  individual.specification = false
  if (individual.dataProperties !== undefined) {
    individual.dataProperties.forEach(prop => {
      prop[prop.owlClassIRI] = [`${base}-${prop.id}`, prop.type]
      delete prop.owlClassIRI
      delete prop.type
      delete prop.value
    })
  }
  if (individual.objectProperties !== undefined) {
    individual.objectProperties.forEach(prop => {
      prop['id'] = prop.value.id
      prop[prop.owlClassIRI] = `${base}-_${prop.value.id}`
      delete prop.owlClassIRI
      delete prop.value
    })
  }
  if (individual.annotationProperties !== undefined) {
    individual.annotationProperties.forEach(prop => {
      prop[prop.annotation] = `${base}-${prop.id}`
      delete prop.annotation
      delete prop.value
    })
  }
}

function saveToDBAndChaos (listOfIndividuals, cb) {
  async.each(listOfIndividuals, (indMap, next) => {
    db.updateById(indMapping, indMap._id.toString(), indMap, (err) => {
      if (err) return next(err)
      indMapService.updateIndividualMapping(indMap._id.toString(), (err) => {
        if (err) return next(err)
        next()
      })
    })
  }, (err) => {
    if (err) return cb(err)
    return cb()
  })
}

function getPopulateNonDataMapping (id, cb) {
  getPopulateMapping(id, (err, results) => {
    if (err) return cb(err)
    cb(null, {individuals: results, _id: id})
  })
}

function getPopulateNonDataIndividual (id, ind, cb) {
  indMapService.getIndividualMapping(ind, (err, individual) => {
    if (err) return cb(err)
    cb(null, individual)
  })
}
