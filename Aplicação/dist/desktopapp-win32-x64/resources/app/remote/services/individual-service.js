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
const db = require('../data-access/mongodb-access')

const idGen = require('shortid')

const collection = 'IndividualMappings'

function createIndividual (individual, populateId, cb) {
  let obj = {originalIndividualName: individual.originalIndividualName, owlClassIRI: individual.owlClassIRI}
  service.createIndividual(individual, populateId, obj, (err, id) => {
    if (err) return cb(err)
    cb(null, id)
  })
}

function deleteIndividual (id, populateId, cb) {
  service.deleteIndividual(id, populateId, cb)
}

function putIndividualAnnotationProperties (id, props, cb) {
  service.putIndividualAnnotationProperties(id, props, (newProps, ret, indMap) => {
    newProps.forEach(elem => {
      if (!elem.id) {
        let id = idGen.generate()
        while (id.indexOf('-') > -1) id = idGen.generate()
        elem.id = id
      }
    })
    let originalProps = indMap.originalAnnotationProps ? indMap.originalAnnotationProps : []
    db.updateById(collection, id, {originalAnnotationProps: originalProps.concat(newProps)}, (err) => {
      if (err) return cb(err)
      ret(newProps)
    })
  }, cb)
}

function putIndividualDataProperties (id, props, cb) {
  service.putIndividualDataProperties(id, props, (newProps, ret, indMap) => {
    newProps.forEach(elem => {
      if (!elem.id) {
        let id = idGen.generate()
        while (id.indexOf('-') > -1) id = idGen.generate()
        elem.id = id
      }
    })
    let originalProps = indMap.originalDataProps ? indMap.originalDataProps : []
    db.updateById(collection, id, {originalDataProps: originalProps.concat(newProps)}, (err) => {
      if (err) return cb(err)
      ret(newProps)
    })
  }, cb)
}

function putIndividualObjectProperties (id, props, cb) {
  service.putIndividualObjectProperties(id, props, (newProps, ret, indMap) => {
    newProps.forEach(elem => {
      if (!elem.id) {
        let id = idGen.generate()
        while (id.indexOf('-') > -1) id = idGen.generate()
        elem.id = id
      }
    })
    let originalProps = indMap.originalObjectProps ? indMap.originalObjectProps : []
    db.updateById(collection, id, {originalObjectProps: originalProps.concat(newProps)}, (err) => {
      if (err) return cb(err)
      ret(newProps)
    })
  }, cb)
}

function renderAnnotationProperties (id, cb) {
  service.renderAnnotationProperties(id, 'originalAnnotationProps', cb)
}

function renderDataProperties (id, cb) {
  service.renderDataProperties(id, 'originalDataProps', cb)
}

function renderObjectProperties (id, popId, cb) {
  service.renderObjectProperties(id, 'originalObjectProps', (err, object) => {
    if (err) return cb(err)
    populateService.getPopulate(popId, (err, pop) => {
      if (err) return cb(err)
      let individuals = (pop.indMappings !== undefined && pop.indMappings) || []
      object.individuals = individuals.filter(i => i._id !== id)
      cb(null, object)
    })
  })
}
