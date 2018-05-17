module.exports = {
  createIndividualMapping,
  getAllIndividualMappings,
  getIndividualMapping,
  updateIndividualMapping,
  createEmptyMapping,
  updateMapping,
  updateIndividualMappingProperties,
  removeIndividualMapping
}

const dataAccess = require('../data-access/individual-mapping-access')
const idGen = require('shortid')
const parser = require('../utils/PropertiesParser')

/**
 * @param tag
 * @param IRI
 * @param fileIds list
 * @param {function} cb(err, id from result)
 */
//@todo verify if result has id
function createIndividualMapping (tag, IRI, fileIds, cb) {

  dataAccess.createIndividualMapping(tag, IRI, fileIds, (err, id) => {
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
 *
 * @param id
 * @param dataProps
 * @param objProps
 * @param cb (err, results)
 */
function updateIndividualMappingProperties (id, dataProps, objProps, cb) {
}

/**
 *
 * @param cb(err,result)
 */
function createEmptyMapping (cb) {
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
  dataAccess.removeIndividualMapping(id, (err, result) =>{
    if(err) cb(err)
    return cb(null, result)
  })
}