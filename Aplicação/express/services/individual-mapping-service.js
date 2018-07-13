module.exports = {
  createIndividualMapping,
  updateIndividualMapping,
  deleteIndividualMapping,
  putIndividualMappingName,
  putIndividualMappingAnnotationProperties,
  putIndividualMappingDataProperties,
  putIndividualMappingObjectProperties,
  deleteIndividualMappingProperty,
  renderDataProperties,
  renderAnnotationProperties,
  renderObjectProperties,
  getNodesFromParsed
}

const dataAccess = require('../data-access/individual-mapping-access')
const dbAccess = require('../data-access/mongodb-access')
const parser = require('../utils/properties-parser')

const collection = 'IndividualMappings'

const service = require('./generic-individual-service')

/**
 * @param input {tag: , nodeId: , owlClassIRI: , ontologyFileId: , dataFileId:}
 * @param {function} cb(err, status, id from result)
 */
function createIndividualMapping (input, populateId, cb) {
  if (input.ontologyFileId === undefined || input.dataFileId === undefined) {
    let error = new Error('Bad Request, missing ontology or data file Id\'s')
    error.statusCode = 400
    return cb(error)
  }

  if (input.tag === undefined || input.owlClassIRI === undefined || input.nodeId === undefined ||
       input.specification !== false) {
    let error = new Error('Bad Request, missing TAG or IRI or NODEID, or SPECIFICATION is different from false')
    error.statusCode = 400
    return cb(error)
  }

  let obj = {tag: input.tag, owlClassIRI: input.owlClassIRI}
  service.createIndividual(input, populateId, obj, (err, id) => {
    if (err) return cb(err)
    cb(null, id)
  })
}

/**
 *
 * @param id {String} individual mapping id
 * @param cb {Function}
 */
function updateIndividualMapping (id, cb) {
  dbAccess.findById(collection, id, (err, individual) => {
    if (err) return cb(err)
    if (individual.individualName === undefined) return cb(new Error('Missing individual name'))
    let individualMapping = {
      tag: individual.tag,
      dataFileIds: [individual.dataFileId],
      individualName: individual.individualName,
      owlClassIRI: individual.owlClassIRI,
      specification: individual.specification,
      annotationProperties: {},
      objectProperties: {},
      dataProperties: {}
    }
    propertyArrayToPropertyMap(individualMapping.annotationProperties, individual.annotationProperties)
    propertyArrayToPropertyMap(individualMapping.dataProperties, individual.dataProperties)
    propertyArrayToPropertyMap(individualMapping.objectProperties, individual.objectProperties)

    if (individual.chaosid) {
      individualMapping._id = individual.chaosid
      dataAccess.updateIndividualMapping(individualMapping, (err) => {
        if (err) return cb(err)
        cb()
      })
    } else {
      dataAccess.sendIndividualMappingToChaos(individualMapping, (err, res) => {
        if (err) return cb(err)
        dbAccess.updateById(collection, id, {chaosid: JSON.parse(res)}, (err) => {
          if (err) return cb(err)
          cb()
        })
      })
    }
  })
}

function propertyArrayToPropertyMap (object, array) {
  if (array === undefined) {
    return
  }
  array.forEach(p => {
    let keys = Object.keys(p)
    object[keys[1]] = p[keys[1]]
  })
}

function deleteIndividualMapping (id, populateId, cb) {
  service.deleteIndividual(id, populateId, cb)
}

function putIndividualMappingName (id, listOfNodes, cb) {
  if (id === undefined) {
    let error = new Error('Bad Request, missing individual mapping id')
    error.statusCode = 400
    return cb(error)
  }
  if (listOfNodes === undefined || listOfNodes.length === 0) {
    let error = new Error('Bad Request, missing individualName or individualName array size is 0')
    error.statusCode = 400
    return cb(error)
  }

  dbAccess.findById(collection, id, (err, indMap) => {
    if (err) cb(err)
    parser.parseName(listOfNodes, indMap.nodeId, indMap.dataFileId, (err, parsedName) => {
      if (err) return cb(err)
      let set = {individualName: parsedName}
      dbAccess.updateById(collection, id, set, (err) => {
        if (err) return cb(err)
        let name = getNodesFromParsed(parsedName)
        cb(null, name)
      })
    })
  })
}

/**
 * @param id (string)
 * @param annotationProps (list)
 * @param cb (err, results)
 */
function putIndividualMappingAnnotationProperties (id, annotationProps, cb) {
  service.putIndividualAnnotationProperties(id, annotationProps, (props, ret, indMap) => {
    parser.parseAnnotationProperties(props, indMap.nodeId, indMap.dataFileId, (err, parsedProps) => {
      if (err) return cb(err)
      ret(parsedProps)
    })
  }, (err, props) => {
    if (err) return cb(err)
    cb(null, parseObjectAndAnnotationProperties(props, 'annotation'))
  })
}

/**
 * @param id
 * @param dataProps
 * @param cb (err, results)
 */
function putIndividualMappingDataProperties (id, dataProps, cb) {
  service.putIndividualDataProperties(id, dataProps, (props, ret, indMap) => {
    parser.parseDataProperties(props, indMap.nodeId, indMap.dataFileId, (err, parsedProps) => {
      if (err) return cb(err)
      ret(parsedProps)
    })
  }, (err, props) => {
    if (err) return cb(err)
    cb(null, parseDataProperties(props))
  })
}

/**
 * @param id
 * @param objProps
 * @param cb (err, results)
 */
function putIndividualMappingObjectProperties (id, objProps, cb) {
  service.putIndividualObjectProperties(id, objProps, (props, ret, indMap) => {
    parser.parseObjectProperties(props, indMap.nodeId, indMap.dataFileId, (err, parsedProps) => {
      if (err) return cb(err)
      ret(parsedProps)
    })
  }, (err, props) => {
    if (err) return cb(err)
    cb(null, parseObjectAndAnnotationProperties(props, 'object'))
  })
}

function deleteIndividualMappingProperty (id, propertyId, type, cb) {
  service.deleteIndividualProperty(id, propertyId, type, (err, indMap) => {
    if (err) return cb(err)
    if (indMap.chaosid) {
      updateIndividualMapping(id, (err) => {
        if (err) return cb(err)
      })
    }
    cb()
  })
}

function renderAnnotationProperties (id, cb) {
  service.renderAnnotationProperties(id, 'annotationProperties', (err, object) => {
    if (err) return cb(err)
    if (object.annotationProperties.length > 0) {
      object.annotationProperties = parseObjectAndAnnotationProperties(object.annotationProperties, 'annotation')
    }
    cb(null, object)
  })
}

function renderDataProperties (id, cb) {
  service.renderDataProperties(id, 'dataProperties', (err, object) => {
    if (err) return cb(err)
    if (object.dataProperties.length > 0) {
      object.dataProperties = parseDataProperties(object.dataProperties)
    }
    cb(null, object)
  })
}

function renderObjectProperties (id, cb) {
  service.renderObjectProperties(id, 'objectProperties', (err, object) => {
    if (err) return cb(err)
    if (object.objectProperties.length > 0) {
      object.objectProperties = parseObjectAndAnnotationProperties(object.objectProperties, 'object')
    }
    cb(null, object)
  })
}

function parseObjectAndAnnotationProperties (props, type) {
  return props.map(obj => {
    let keys = Object.keys(obj)
    return {
      id: obj.id,
      name: keys[1],
      nodes: getNodesFromParsed(obj[keys[1]]),
      type: type
    }
  })
}

function parseDataProperties (props) {
  return props.map(obj => {
    let keys = Object.keys(obj)
    return {
      id: obj.id,
      name: keys[1],
      nodes: getNodesFromParsed(obj[keys[1]][0]),
      type: 'data'
    }
  })
}

function getNodesFromParsed (metadata) {
  let res = ''
  let split = metadata.split(';')
  split.forEach(node => {
    res = res.concat(`${node.substring(node.lastIndexOf('-') + 1)} `)
  })
  return res
}
