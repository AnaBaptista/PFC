module.exports = {
  createIndividual,
  putIndividualAnnotationProperties,
  putIndividualDataProperties,
  putIndividualObjectProperties,
  renderAnnotationProperties,
  renderDataProperties,
  renderObjectProperties
}

const db = require('../data-access/mongodb-access')
const collection = 'IndividualMappings'

const populateService = require('./populate-service')
const fileService = require('./file-service')

function createIndividual (individual, populateId, cb) {
  db.sendDocToDb(collection, individual, (err, id) => {
    if (err) return cb(err)
    let obj = {_id: id, individualName: individual.individualName, owlClassIRI: individual.owlClassIRI}
    populateService.addIndividualToPopulate(populateId, obj, (err) => {
      if (err) return cb(err)
      cb(null, id)
    })
  })
}

function putIndividualAnnotationProperties (id, props, cb) {
  if (props === undefined || props.length === 0) {
    let error = new Error('Bad Request, missing annotationProperties or annotationProperties array size is 0')
    error.statusCode = 400
    return cb(error)
  }
  let idsToRemove = []
  props.forEach(elem => idsToRemove.push(elem.id))

  db.findById(collection, id, (err, indMap) => {
    if (err) cb(err)
    indMap.annotationProperties = (indMap.annotationProperties === undefined && []) ||
      indMap.annotationProperties.filter(elem => !idsToRemove.includes(elem.id))

    let set = {annotationProperties: indMap.annotationProperties.concat(props)}
    db.updateById(collection, id, set, (err) => {
      if (err) return cb(err)
      cb(null, props)
    })
  })
}

function putIndividualDataProperties (id, props, cb) {
  if (props === undefined || props.length === 0) {
    let error = new Error('Bad Request, missing dataProperties or dataProperties array size is 0')
    error.statusCode = 400
    return cb(error)
  }
  let idsToRemove = []
  props.forEach(elem => idsToRemove.push(elem.id))

  db.findById(collection, id, (err, indMap) => {
    if (err) cb(err)
    indMap.dataProperties = (indMap.dataProperties === undefined && []) ||
      indMap.dataProperties.filter(elem => !idsToRemove.includes(elem.id))

    let set = {dataProperties: indMap.dataProperties.concat(props)}
    db.updateById(collection, id, set, (err) => {
      if (err) return cb(err)
      cb(null, props)
    })
  })
}

function putIndividualObjectProperties (id, props, cb) {
  if (props === undefined || props.length === 0) {
    let error = new Error('Bad Request, missing objectProperties or objectProperties array size is 0')
    error.statusCode = 400
    return cb(error)
  }
  let idsToRemove = []
  props.forEach(elem => idsToRemove.push(elem.id))

  db.findById(collection, id, (err, indMap) => {
    if (err) cb(err)
    indMap.objectProperties = (indMap.objectProperties === undefined && []) ||
      indMap.objectProperties.filter(elem => !idsToRemove.includes(elem.id))

    let set = {objectProperties: indMap.objectProperties.concat(props)}
    db.updateById(collection, id, set, (err) => {
      if (err) return cb(err)
      cb(null, props)
    })
  })
}

function renderAnnotationProperties (id, cb) {
  const obj = {
    aproperties: ['label', 'comment', 'seeAlso'],
    annotationProperties: []
  }
  db.findById(collection, id, (err, indMap) => {
    if (err) return cb(err)
    if (indMap.annotationProperties) {
      obj['annotationProperties'] = indMap.annotationProperties
    }
    cb(null, obj)
  })
}

function renderDataProperties (id, cb) {
  db.findById(collection, id, (err, pop) => {
    if (err) return cb(err)
    fileService.getOntologyFileDataProperties(pop.ontologyFileId, (err, props) => {
      if (err) return cb(err)
      db.findById(collection, id, (err, indMap) => {
        if (err) return cb(err)
        let obj = {
          dproperties: props,
          dpropertyTypes: ['String', 'Integer', 'Float', 'Double', 'Boolean'],
          dataProperties: []
        }
        if (indMap.dataProperties) {
          obj['dataProperties'] = indMap.dataProperties
        }
        cb(null, obj)
      })
    })
  })
}

function renderObjectProperties (id, cb) {
  db.findById(collection, id, (err, pop) => {
    if (err) return cb(err)
    fileService.getOntologyFileObjectProperties(pop.ontologyFileId, (err, props) => {
      if (err) return cb(err)
      db.findById(collection, id, (err, indMap) => {
        if (err) return cb(err)
        let obj = {
          oproperties: props,
          objectProperties: [],
          indMappings: pop.indMappings
        }
        if (indMap.objectProperties) {

        }
        cb(null, obj)
      })
    })
  })
}
