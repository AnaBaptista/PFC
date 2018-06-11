module.exports = {
  createMapping
}

const db = require('../data-access/mongodb-access')
const dataAcces = require('../data-access/mapping-access')
const populates = 'Populates'
const individualMappings = 'IndividualMappings'
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

      indMappings.forEach(i => {
        if (!mapping.fileNames.includes(i.dataFileId)) {
          mapping.fileNames.push(i.dataFileId)
        }
        if (!mapping.directOntologyImports.includes(i.ontologyFileId)) {
          mapping.directOntologyImports.push(i.ontologyFileId)
        }
      })

      dataAcces.createMapping(mapping, (err, id) => {
        if (err) return cb(err)
        db.updateById(populates, data.populateId, {chaosid: id}, (err) => {
          if (err) return cb(err)
          cb()
        })
      })
    })
  })
}