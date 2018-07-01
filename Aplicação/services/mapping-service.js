module.exports = {
  createMapping,
  deleteMapping
}

const db = require('../data-access/mongodb-access')
const dataAcces = require('../data-access/mapping-access')
const populates = 'Populates'
const individualMappings = 'IndividualMappings'
const ontologies = 'OntologyFiles'
const namespace = 'http://chaospop.sysresearch.org/ontologies/'

function createMapping (data, cb) {
  db.findById(populates, data.populateId, (err, pop) => {
    if (err) return cb(err)
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
          db.updateById(populates, data.populateId, {chaosid: JSON.parse(id)}, (err) => {
            if (err) return cb(err)
            cb()
          })
        })
      })
    })
  })
}

function deleteMapping (id, cb) {
  dataAcces.deleteMapping(id, cb)
}