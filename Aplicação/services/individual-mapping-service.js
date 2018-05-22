module.exports = {
  createIndividualMapping,
  getAllIndividualMappings,
  getIndividualMapping,
  updateIndividualMapping,
  updateMapping,
  addIndividualMappingObjectProperties,
  addIndividualMappingDataProperties,
  addIndividualMappingAnnotationProperties,
  removeIndividualMapping
}

const dataAccess = require('../data-access/individual-mapping-access')
const dbAccess = require('../data-access/mongodb-access')
const parser = require('../utils/PropertiesParser')

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
      input.individualName === undefined || input.specification !== false) {
    let error = new Error('Bad Request, missing TAG or IRI or NODEID or INDIVIDUALNAME or SPACFICATION is different from false')
    error.statusCode = 400
    return cb(error)
  }

  parser.parseName(input, (err, result) => {
    if (err) return cb(err)
    let r = result
  })

  dataAccess.createIndividualMapping(input, (err, id) => {
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

/**
 * @param id
 * @param objProps
 * @param cb (err, results)
 */
function addIndividualMappingObjectProperties (id, objProps, cb) {
  if (id === undefined) {
    let error = new Error('Bad Request, missing individual mapping Id')
    error.statusCode = 400
    return cb(error)
  }
  dbAccess.findById(id, (err, indMap) => {
    if (err) cb(err)
    parser.parseObjectProperties(indMap, objProps, (err, listOfParsedProps) => {
      if (err) cb(err)
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
    let error = new Error('Bad Request, missing individual mapping Id')
    error.statusCode = 400
    return cb(error)
  }
  dbAccess.findById(id, (err, indMap) => {
    if (err) cb(err)

    parser.parseDataProperties(indMap, dataProps, (err, listOfParsedProps) => {
      if (err) cb(err)
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
    let error = new Error('Bad Request, missing individual mapping Id')
    error.statusCode = 400
    return cb(error)
  }
  dbAccess.findById(id, (err, indMap) => {
    if (err) cb(err)
    parser.parseDataProperties(indMap, annotationProps, (err, listOfParsedProps) => {
      if (err) cb(err)
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
