module.exports = {
  createIndividual,
  deleteIndividual,
  deleteIndividualsByIdOnChaosPop,
  getIndividual,
  getIndividualByIds,
  putIndividualAnnotationProperties,
  putIndividualDataProperties,
  putIndividualObjectProperties,
  deleteIndividualProperty,
  renderAnnotationProperties,
  renderDataProperties,
  renderObjectProperties
}

const db = require('../data-access/mongodb-access')
const dataAccess = require('../data-access/individual-mapping-access')

const collection = 'IndividualMappings'
const ontoFiles = 'OntologyFiles'

const populateService = require('./populate-service')

function createIndividual (individual, populateId, obj, cb) {
  db.sendDocToDb(collection, individual, (err, id) => {
    if (err) return cb(err)
    Object.assign(obj, {_id: id})
    populateService.addIndividualToPopulate(populateId, obj, (err) => {
      if (err) return cb(err)
      cb(null, id)
    })
  })
}

function deleteIndividual (id, populateId, cb) {
  db.findById(collection, id, (err, ind) => {
    if (err) return cb(err)
    db.deleteById(collection, id, (err) => {
      if (err) return cb(err)
      populateService.deleteIndividualFromPopulate(populateId, id, (err) => {
        if (err) return cb(err)
        if (ind.chaosid) {
          dataAccess.deleteIndividualMapping([ind.chaosid], (err) => {
            if (err) return cb(err)
            cb()
          })
        } else {
          cb()
        }
      })
    })
  })
}

function deleteIndividualsByIdOnChaosPop (ids, cb) {
  ids.length !== 0 ? dataAccess.deleteIndividualMapping(ids, cb) : cb()
}

function getIndividual (id, cb) {
  db.findById(collection, id, (err, results) => {
    if (err) return cb(err)
    return cb(null, results)
  })
}

function getIndividualByIds (ids, cb) {
  db.findByIds(collection, ids, (err, results) => {
    if (err) return cb(err)
    cb(null, results)
  })
}

function putIndividualAnnotationProperties (id, props, func, cb) {
  if (props === undefined || props.length === 0) {
    let error = new Error('Bad Request, missing annotationProperties or annotationProperties array size is 0')
    error.statusCode = 400
    return cb(error)
  }

  let idsToRemove = []
  props.forEach(elem => idsToRemove.push(elem.id))

  db.findById(collection, id, (err, indMap) => {
    if (err) cb(err)

    func(props, (newProps) => {
      if (err) return cb(err)

      indMap.annotationProperties = (indMap.annotationProperties === undefined && []) ||
        indMap.annotationProperties.filter(elem => !idsToRemove.includes(elem.id))

      let set = {annotationProperties: indMap.annotationProperties.concat(newProps)}
      db.updateById(collection, id, set, (err) => {
        if (err) return cb(err)
        cb(null, newProps)
      })
    }, indMap)
  })
}

function putIndividualDataProperties (id, props, func, cb) {
  if (props === undefined || props.length === 0) {
    let error = new Error('Bad Request, missing dataProperties or dataProperties array size is 0')
    error.statusCode = 400
    return cb(error)
  }

  let idsToRemove = []
  props.forEach(elem => idsToRemove.push(elem.id))

  db.findById(collection, id, (err, indMap) => {
    if (err) cb(err)
    func(props, (newProps) => {
      if (err) return cb(err)

      indMap.dataProperties = (indMap.dataProperties === undefined && []) ||
        indMap.dataProperties.filter(elem => !idsToRemove.includes(elem.id))

      let set = {dataProperties: indMap.dataProperties.concat(newProps)}
      db.updateById(collection, id, set, (err) => {
        if (err) return cb(err)
        cb(null, newProps)
      })
    }, indMap)
  })
}

function putIndividualObjectProperties (id, props, func, cb) {
  if (props === undefined || props.length === 0) {
    let error = new Error('Bad Request, missing objectProperties or objectProperties array size is 0')
    error.statusCode = 400
    return cb(error)
  }
  let idsToRemove = []
  props.forEach(elem => idsToRemove.push(elem.id))

  db.findById(collection, id, (err, indMap) => {
    if (err) cb(err)

    func(props, (newProps) => {
      if (err) return cb(err)

      indMap.objectProperties = (indMap.objectProperties === undefined && []) ||
        indMap.objectProperties.filter(elem => !idsToRemove.includes(elem.id))

      let set = {objectProperties: indMap.objectProperties.concat(newProps)}
      db.updateById(collection, id, set, (err) => {
        if (err) return cb(err)
        cb(null, newProps)
      })
    }, indMap)
  })
}

function deleteIndividualProperty (id, propertyId, type, cb) {
  db.findById(collection, id, (err, indMap) => {
    if (err) return cb(err)
    let field = `${type}Properties`
    indMap[field] = indMap[field].filter(p => p.id !== propertyId)
    let set = (type === 'object' && {objectProperties: indMap[field]}) ||
      (type === 'data' && {dataProperties: indMap[field]}) ||
      (type === 'annotation' && {annotationProperties: indMap[field]})
    db.updateById(collection, id, set, (err) => {
      if (err) return cb(err)
      cb(null, indMap)
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
  db.findById(collection, id, (err, indMap) => {
    if (err) return cb(err)
    db.findById(ontoFiles, indMap.ontologyFileId, (err, file) => {
      if (err) return cb(err)
      let obj = {
        dproperties: file.dataProperties,
        dpropertyTypes: ['String', 'Integer', 'Float', 'Double', 'Boolean'],
        dataProperties: []
      }
      if (indMap.dataProperties) {
        obj['dataProperties'] = indMap.dataProperties
      }
      cb(null, obj)
    })
  })
}

function renderObjectProperties (id, cb) {
  db.findById(collection, id, (err, indMap) => {
    if (err) return cb(err)
    db.findById(ontoFiles, indMap.ontologyFileId, (err, file) => {
      if (err) return cb(err)
      let obj = {
        oproperties: file.objectProperties,
        objectProperties: []
      }
      if (indMap.objectProperties) {
        obj['objectProperties'] = indMap.objectProperties
      }
      cb(null, obj)
    })
  })
}
