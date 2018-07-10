module.exports = {
  createIndividual,
  deleteIndividual,
  putIndividualAnnotationProperties,
  putIndividualDataProperties,
  putIndividualObjectProperties,
  deleteIndividualProperty,
  renderAnnotationProperties,
  renderDataProperties,
  renderObjectProperties
}

const service = require('./generic-individual-service')
const populateService = require('./populate-service')
const db = require('../data-access/mongodb-access')

const idGen = require('shortid')

const collection = 'IndividualMappings'

const updateIndividual = require('./individual-mapping-service').updateIndividualMapping

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
        elem.id = `_${id}`
      }
    })
    let originalProps = indMap.annotationPropsOriginal ? indMap.annotationPropsOriginal : []
    db.updateById(collection, id, {annotationPropsOriginal: originalProps.concat(newProps)}, (err) => {
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
        elem.id = `_${id}`
      }
    })
    let originalProps = indMap.dataPropsOriginal ? indMap.dataPropsOriginal : []
    db.updateById(collection, id, {dataPropsOriginal: originalProps.concat(newProps)}, (err) => {
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
        elem.id = `_${id}`
      }
    })
    let originalProps = indMap.objectPropsOriginal ? indMap.ojectPropsOriginal : []
    db.updateById(collection, id, {objectPropsOriginal: originalProps.concat(newProps)}, (err) => {
      if (err) return cb(err)
      ret(newProps)
    })
  }, cb)
}

function deleteIndividualProperty (id, propertyId, type, cb) {
  service.deleteIndividualProperty(id, propertyId, type, (err, indMap) => {
    if (err) return cb(err)
    let field = `${type}PropsOriginal`
    indMap[field] = indMap[field].filter(p => p.id !== propertyId)
    let set = (type === 'object' && {objectPropsOriginal: indMap[field]}) ||
      (type === 'data' && {dataPropsOriginal: indMap[field]}) ||
      (type === 'annotation' && {annotationPropsOriginal: indMap[field]})
    db.updateById(collection, id, set, (err) => {
      if (err) return cb(err)
      if (indMap.chaosid) {
        updateIndividual(indMap._id.toString(), cb)
      } else {
        cb()
      }
    })
  })
}

function renderAnnotationProperties (id, cb) {
  service.renderAnnotationProperties(id, 'annotationPropsOriginal', cb)
}

function renderDataProperties (id, cb) {
  service.renderDataProperties(id, 'dataPropsOriginal', cb)
}

function renderObjectProperties (id, popId, cb) {
  service.renderObjectProperties(id, 'objectPropsOriginal', (err, object) => {
    if (err) return cb(err)
    populateService.getPopulate(popId, (err, pop) => {
      if (err) return cb(err)
      let individuals = (pop.indMappings !== undefined && pop.indMappings) || []
      object.individuals = individuals.filter(i => i._id !== id)
      cb(null, object)
    })
  })
}
