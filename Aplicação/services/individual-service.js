module.exports = {
  createIndividual,
  deleteIndividual,
  putIndividualAnnotationProperties,
  putIndividualDataProperties,
  putIndividualObjectProperties,
  renderAnnotationProperties,
  renderDataProperties,
  renderObjectProperties
}

const service = require('./generic-individual-service')
const populateService = require('./populate-service')

const idGen = require('shortid')

function createIndividual (individual, populateId, cb) {
  let obj = {individualName: individual.individualName, owlClassIRI: individual.owlClassIRI}
  service.createIndividual(individual, populateId, obj, (err, id) => {
    if (err) return cb(err)
    cb(null, id)
  })
}

function deleteIndividual (id, populateId, cb) {
  service.deleteIndividual(id, populateId, cb)
}

function putIndividualAnnotationProperties (id, props, cb) {
  service.putIndividualAnnotationProperties(id, props, (newProps, ret) => {
    newProps.forEach(elem => {
      if (!elem.id) {
        let id = idGen.generate()
        while (id.indexOf('-') > -1) id = idGen.generate()
        elem.id = id
      }
    })
    ret(newProps)
  }, cb)
}

function putIndividualDataProperties (id, props, cb) {
  service.putIndividualDataProperties(id, props, (newProps, ret) => {
    newProps.forEach(elem => {
      if (!elem.id) {
        let id = idGen.generate()
        while (id.indexOf('-') > -1) id = idGen.generate()
        elem.id = id
      }
    })
    ret(newProps)
  }, cb)
}

function putIndividualObjectProperties (id, props, cb) {
  service.putIndividualObjectProperties(id, props, (newProps, ret) => {
    newProps.forEach(elem => {
      if (!elem.id) {
        let id = idGen.generate()
        while (id.indexOf('-') > -1) id = idGen.generate()
        elem.id = id
      }
    })
    ret(newProps)
  }, cb)
}

function renderAnnotationProperties (id, cb) {
  service.renderAnnotationProperties(id, cb)
}

function renderDataProperties (id, cb) {
  service.renderDataProperties(id, cb)
}

function renderObjectProperties (id, popId, cb) {
  service.renderObjectProperties(id, (err, object) => {
    if (err) return cb(err)
    populateService.getPopulate(popId, (err, pop) => {
      if (err) return cb(err)
      let individuals = (pop.indMappings !== undefined && pop.indMappings) || []
      object.individuals = individuals.filter(i => i._id !== id)
      cb(null, object)
    })
  })
}
