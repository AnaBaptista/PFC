module.exports = {
  createMapping,
  deleteMapping,
  getMapping
}

const db = require('../data-access/mongodb-access')
const dataAcces = require('../data-access/mapping-access')

const populateService = require('./populate-service')
const fileService = require('./file-service')

const populates = 'Populates'
const individualMappings = 'IndividualMappings'
const ontologies = 'OntologyFiles'
const namespace = 'http://chaospop.sysresearch.org/ontologies/'

function createMapping (data, cb) {
  db.findByQuery(populates, {outputFileName: data.name}, (err, pops) => {
    if (err) return cb(err)
    if (pops.length !== 0) {
      let error = new Error(`Output file name: ${data.name} already exists`)
      error.status = 409
      return cb(error)
    }
    db.findById(populates, data.populateId, (err, pop) => {
      if (err) return cb(err)
      let cbFunc = (err) => {
        if (err) return cb(err)
      }
      if (pop.chaosid) {
        deleteMapping(pop.chaosid, cbFunc)
        pop.batchId && populateService.deleteBatch(pop.batchId, cbFunc)
        pop.outputFileId && fileService.deleteOntologyFileOnChaosPop(pop.outputFileId, cbFunc)
        putMapping(data, pop, cb)
      } else {
        putMapping(data, pop, cb)
      }
    })
  })
}

function putMapping (data, pop, cb) {
  let ids = pop.indMappings.filter(i => data.indMappings.includes(i._id)).map(i => i._id)
  db.findByIds(individualMappings, ids, (err, indMappings) => {
    if (err) return cb(err)
    let mapping = {
      outputOntologyFileName: data.name,
      outputOntologyNamespace: `${namespace}${data.name}.owl#`,
      individualMappings: indMappings.map(i => i.chaosid),
      fileNames: [],
      directOntologyImports: []
    }
    db.findByIds(ontologies, indMappings.map(i => i.ontologyFileId), (err, files) => {
      if (err) return cb(err)
      indMappings.forEach(i => {
        if (!mapping.fileNames.includes(i.dataFileId)) {
          mapping.fileNames.push(i.dataFileId)
        }
      })
      files.forEach(f => {
        if (!mapping.directOntologyImports.includes(f.chaosid)) {
          mapping.directOntologyImports.push(f.chaosid)
        }
      })
      dataAcces.createMapping(mapping, (err, id) => {
        if (err) return cb(err)
        db.updateById(populates, data.populateId, {chaosid: JSON.parse(id), batchId: '', outputFileId: '', outputFileName: data.name}, (err) => {
          if (err) return cb(err)
          cb()
        })
      })
    })
  })
}

function deleteMapping (id, cb) {
  dataAcces.deleteMapping(id, cb)
}

function getMapping (id, cb) {
  dataAcces.getMapping(id, cb)
}
