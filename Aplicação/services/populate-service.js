module.exports = {
  addPopulate,
  addIndividualToPopulate,
  getPopulate,
  getPopulates,
  deletePopulate,
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

const fileService = require('./file-service')
const genericIndividual = require('./generic-individual-service')
const indMapService = require('./individual-mapping-service')
const mappingService = require('./mapping-service')

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

function getPopulates (cb) {
  db.findByQuery(populates, {}, (err, pops) => {
    if (err) return cb(err)
    let populates = []
    pops.forEach(pop => {
      let populate = {
        _id: pop._id.toString(),
        ontologyFiles: pop.ontologyFiles.map(file => file.name),
        type: 'without data'
      }
      if (pop.dataFiles) {
        populate.dataFiles = pop.dataFiles.map(file => file.name)
        populate['type'] = 'with data'
      }
      if (pop.chaosid) {
        populate.chaosid = pop.chaosid
      }
      populates.push(populate)
    })
    cb(null, {populates: populates})
  })
}

function deletePopulate (id, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    let indIds = pop.indMappings.map(i => i._id)
    db.findByIds(indMapping, indIds, (err, indMaps) => {
      if (err) return cb(err)
      let chaosIds = []
      indMaps.forEach(i => {
        if (i.chaosid) {
          chaosIds.push(i.chaosid)
        }
      })
      db.deleteByIds(indMapping, indIds, (err) => {
        if (err) return cb(err)
        genericIndividual.deleteIndividualsByIdOnChaosPop(chaosIds, (err) => {
          if (err) return cb(err)
          if (pop.chaosid) {
            mappingService.deleteMapping(pop.chaosid, (err) => {
              if (err) return cb(err)
              pop.batchId ? dataAccess.deleteBatch(pop.batchId, cb) : cb()
            })
          } else {
            cb()
          }
        })
      })
    })
  })
}

function createOutputFile (id, cb) {
  db.findById(populates, id, (err, pop) => {
    if (err) cb(err)
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
          let set = {outputFileId: outputFileId[0], batchId: batchId}
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
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    let ontIds = pop.ontologyFiles.map(file => file.id)
    getPopulateOntologyFiles(ontIds, (err, files) => {
      if (err) return cb(err)
      let classes = []
      files.forEach(f => {
        classes = classes.concat(f.classes.map(c => { return {ontologyId: f._id, IRI: c} }))
      })
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
}

function getPopulateOntologyFiles (ids, cb) {
  db.findByIds(ontologyFiles, ids, (err, oFiles) => {
    if (err) return cb(err)
    let files = oFiles.map(file => {
      return {
        _id: file._id.toString(),
        name: file.name,
        chaosid: file.chaosid,
        classes: file.classes
      }
    })
    cb(null, files)
  })
}

function getPopulateMapping (id, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    if (pop.indMappings) {
      genericIndividual.getIndividualByIds(pop.indMappings.map(i => i._id), (err, results) => {
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

function getPopulateDataFiles (ids, cb) {
  db.findByIds(dataFiles, ids, (err, dFiles) => {
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
}

function getPopulateDataTree (id, cb) {
  getPopulate(id, (err, pop) => {
    if (err) return cb(err)
    if (pop.tree) {
      return cb(null, pop.tree)
    } else {
      getPopulateDataFiles(pop.dataFiles.map(d => d.id), (err, files) => {
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
}

function getPopulateDataIndividual (ind, cb) {
  genericIndividual.getIndividual(ind, (err, individual) => {
    if (err) return cb(err)
    cb(null, individual)
  })
}

function getPopulateDataIndividualTree (id, ind, cb) {
  genericIndividual.getIndividual(ind, (err, individual) => {
    if (err) return cb(err)
    if (individual.indTree) {
      cb(null, individual.indTree)
    } else {
      getPopulate(id, (err, pop) => {
        if (err) return cb(err)
        let tree = pop.tree.find(obj => obj.dataFileId === individual.dataFileId)
        let indTree = []
        let aux = treeFunctions.searchById(tree, individual.nodeId)
        indTree.push(aux)
        db.updateById(indMapping, individual._id, {indTree: indTree}, (err) => {
          if (err) return cb(err)
          cb(null, indTree)
        })
      })
    }
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
        db.findById(dataFiles, id._id, (err, file) => {
          if (err) return cb(err)
          listOfIndividuals.forEach(individual => parseIndividualToInMap(individual, file.chaosid))
          fs.unlink(path, (err) => {
            if (err) return cb(err)
          })
          saveToDBAndChaos(listOfIndividuals, cb)
        })
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
    individual.originalDataProps = individual.dataProperties
    individual.dataProperties.forEach(prop => {
      prop[prop.owlClassIRI] = [`${base}-${prop.id}`, prop.type]
      delete prop.owlClassIRI
      delete prop.type
      delete prop.value
    })
  }
  if (individual.objectProperties !== undefined) {
    individual.originalObjProps = individual.objectProperties
    individual.objectProperties.forEach(prop => {
      prop['id'] = prop.value.id
      prop[prop.owlClassIRI] = `${base}-_${prop.value.id}`
      delete prop.owlClassIRI
      delete prop.value
    })
  }
  if (individual.annotationProperties !== undefined) {
    individual.originalAnnProps = individual.annotationProperties
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
  genericIndividual.getIndividual(ind, (err, individual) => {
    if (err) return cb(err)
    cb(null, individual)
  })
}
