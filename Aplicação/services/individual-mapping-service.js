module.exports = {
  createIndividualMapping,
  getIndividualMapping,
  addIndividualMappingName,
  addIndividualMappingObjectProperties,
  addIndividualMappingDataProperties,
  addIndividualMappingAnnotationProperties,
  renderObjectProperties,
  renderDataProperties
}

const dataAccess = require('../data-access/individual-mapping-access')
const dbAccess = require('../data-access/mongodb-access')
const parser = require('../utils/PropertiesParser')

const collection = 'IndividualMappings'

const fileService = require('../services/file-service')

/**
 * @param input {tag: , nodeId: , owlClassIRI: , ontologyFileId: , dataFileId:}
 * @param {function} cb(err, status, id from result)
 */
function createIndividualMapping (input, cb) {
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

  dbAccess.sendDocToDb(collection, input, (err, id) => {
    if (err) return cb(err)
    return cb(null, id)
  })
}

/**
 * @param {function} cb(err,results)
 */
function getAllIndividualMappings (cb) {
  dataAccess.getAllIndividualMappings((err, results) => {
    if (err) return cb(err)
    let obj = JSON.parse(results.toString())
    cb(null, obj)
  })
}

function getIndividualMapping (id, cb) {
  dataAccess.getIndividualMapping()
}

/**
 * @param id
 * @param fileList
 * @param tag
 * @param name
 * @param label
 * @param specification
 * @param IRI
 * @param dataProps
 * @param objProps
 * @param cb(err, result)
 */
function updateIndividualMapping (id, fileList, tag, name, label, specification, IRI, dataProps, objProps, cb) {
  let listOfDataProps = parser.parseDataProperties(dataProps)
  let listOfObjProps = parser.parseObjectProperties(objProps)

  let individualMappingTO = {
    _id: id,
    dataFileIds: fileList,
    tag: tag,
    individualName: name,
    individualLabel: label,
    owlClassIRI: IRI,
    specification: specification,
    objectProperties: listOfObjProps,
    dataProperties: listOfDataProps
  }
  dataAccess.updateIndividualMapping(id, individualMappingTO, (err, result) => {
    if (err) return cb(err)
    return cb(null, result)
  })
}

function addIndividualMappingName (id, listOfNodes, cb) {
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
    parser.parseName(listOfNodes, indMap.nodeId, (err, parsedName) => {
      if (err) return cb(err)
      let set = {individualName: parsedName}
      dbAccess.updateById(collection, id, set, (err) => {
        if (err) return cb(err)
        cb()
      })
    })
  })
}

/**
 * @param id
 * @param objProps
 * @param cb (err, results)
 */
function addIndividualMappingObjectProperties (id, objProps, cb) {
  if (id === undefined) {
    let error = new Error('Bad Request, missing individual mapping id')
    error.statusCode = 400
    return cb(error)
  }
  if (objProps === undefined || objProps.length === 0) {
    let error = new Error('Bad Request, missing objProps or objProps array size is 0')
    error.statusCode = 400
    return cb(error)
  }

  dbAccess.findById(collection, id, (err, indMap) => {
    if (err) cb(err)
    parser.parseObjectProperties(objProps, indMap.nodeId, (err, parsedProps) => {
      if (err) return cb(err)
      let set = {objectProperties: parsedProps}
      dbAccess.updateById(collection, id, set, (err) => {
        if (err) return cb(err)
        cb()
      })
    })
  })
}

/**
 * @param id
 * @param dataProps
 * @param cb (err, results)
 */
function addIndividualMappingDataProperties (id, dataProps, cb) {
  if (id === undefined) {
    let error = new Error('Bad Request, missing individual mapping id')
    error.statusCode = 400
    return cb(error)
  }
  if (dataProps === undefined || dataProps.length === 0) {
    let error = new Error('Bad Request, missing dataProps or dataProps array size is 0')
    error.statusCode = 400
    return cb(error)
  }
  dbAccess.findById(collection, id, (err, indMap) => {
    if (err) cb(err)
    parser.parseDataProperties(dataProps, indMap.nodeId, (err, parsedProps) => {
      if (err) return cb(err)
      let set = {dataProperties: parsedProps}
      dbAccess.updateById(collection, id, set, (err) => {
        if (err) return cb(err)
        cb()
      })
    })
  })
}

/**
 * @param id (string)
 * @param annotationProps (list)
 * @param cb (err, results)
 */
function addIndividualMappingAnnotationProperties (id, annotationProps, cb) {
  if (id === undefined) {
    let error = new Error('Bad Request, missing individual mapping id')
    error.statusCode = 400
    return cb(error)
  }
  if (annotationProps === undefined || annotationProps.length === 0) {
    let error = new Error('Bad Request, missing annotationproperties or annotationproperties array size is 0')
    error.statusCode = 400
    return cb(error)
  }
  dbAccess.findById(collection, id, (err, indMap) => {
    if (err) cb(err)
    parser.parseAnnotationProperties(annotationProps, indMap.nodeId, (err, parsedProps) => {
      if (err) return cb(err)
      let set = {annotationProperties: parsedProps}
      dbAccess.updateById(collection, id, set, (err) => {
        if (err) return cb(err)
        cb()
      })
    })
  })
}

/**
 * @param id
 * @param outputOntologyFileName
 * @param outputOntologyNamespace
 * @param fileList
 * @param directOntologyImports
 * @param individualMappings
 * @param cb (err, result)
 */
function updateMapping (id, outputOntologyFileName, outputOntologyNamespace, fileList, directOntologyImports, individualMappings, cb) {
}

function removeIndividualMapping (id, cb) {
  dataAccess.removeIndividualMapping(id, (err, result) => {
    if (err) cb(err)
    return cb(null, result)
  })
}

function renderObjectProperties (id, cb) {
  dbAccess.findById(collection, id, (err, pop) => {
    if (err) return cb(err)
    fileService.getOntologyFileObjectProperties(pop.ontologyFileId, (err, props) => {
      if (err) return cb(err)
      cb(null, {oproperties: props})
    })
  })
}
function renderDataProperties (id, cb) {
  dbAccess.findById(collection, id, (err, pop) => {
    if (err) return cb(err)
    fileService.getOntologyFileDataProperties(pop.ontologyFileId, (err, props) => {
      if (err) return cb(err)
      let obj = {
        dproperties: props,
        dpropertyTypes: ['String', 'Integer', 'Float', 'Double', 'Boolean']
      }
      cb(null, obj)
    })
  })
}
