const router = require('express')()

const service = require('../services/individual-mapping-service')
const fileService = require('../services/file-service')

module.exports = router

router.post('/map/individual', createIndividual)
router.post('/map', createMapping)
router.post('/map/individual/:individualId/properties/object', addIndividualMappingObjectProperties)
// router.post('/map/individual/:individualId/properties/data', addIndividualMappingDataProperties)
// router.post('/map/individual/:individualId/properties/annotation', addIndividualMappingAnnotationProperties)

router.put('/map/individual/:individualId', updateIndividualMapping)
router.put('/map/:mappingId', updateMapping)

router.get('/map/individual', getAllIndividualMappings)
// router.get('/map/individual/:individualId', getIndividualMapping)
router.get('/map/individual/:individualId/objectProperties', getIndividualObjProps)
router.get('/map/individual/:individualId/dataProperties', getIndividualDataProps)
router.get('/map/individual/:individualId/annotationProperties', getIndividualAnnotationProps)
// router.get('/map/individual/', removeIndividualMapping)

/**
 * Body Parameters:
 * (Object) data
 *  data = {tag: , nodeId: , owlClassIRI: , ontologyFileId: , dataFileId:}
 */
function createIndividual (req, res, next) {
  console.log('/map/individual, createIndividual')
  let input = req.body.data
  service.createIndividualMapping(input, (err, id) => {
    if (err) return next(err)
    const ctx = {
      layout: false,
      _id: id,
      tag: input.tag,
      IRI: input.owlClassIRI
    }
    res.render('partials/individualMapping', ctx)
  })
}

/**
 * Id's needed in path:
 * :mappingId -> this id refers to the mapping id for the mapping that was created.
 * Will return 400 if not present
 *
 * Id's needed in query:
 * :ontologyFileId
 * :dataFIleId
 * :nodeId
 * Will return a 400 status code if not present
 */
function getIndividualObjProps (req, res, next) {
  console.log('/map/individual/:individualId/objectProperties, getIndividualObjProps')
  let dataFileId = req.query.dataFileId
  let ontologyId = req.query.ontologyFileId
  let nodeId = req.query.nodeId
  let id = req.params.individualId

  fileService.getOntologyFileObjectProperties(ontologyId, (err, result) => {
    const ctx = {
      layout: false,
      _id: id,
      nodeId: nodeId,
      ontologyFileId: ontologyId,
      dataFileId: dataFileId,
      oproperties: result.properties
    }
    res.render('partials/individualMapObjectProps', ctx)
  })
}

function getIndividualDataProps (req, res, next) {
  console.log('/map/individual/:individualId/dataProperties, getIndividualDataProps')
  let dataFileId = req.query.dataFileId
  let ontologyId = req.query.ontologyFileId
  let parentNodeId = req.query.nodeId
  // let toMapNodeId
  let id = req.params.individualId

  fileService.getOntologyFileDataProperties(ontologyId, (err, result) => {
    const ctx = {
      layout: false,
      _id: id,
      nodeId: parentNodeId,
      ontologyFileId: ontologyId,
      dataFileId: dataFileId,
      dproperties: result.properties,
      dpropertyTypes: ['String', 'Integer', 'Float', 'Double', 'Boolean']
    }
    res.render('partials/individualMapDataProps', ctx)
  })
}

function getIndividualAnnotationProps (req, res, next) {
  console.log('/map/individual/:individualId/annotationProperties, getIndividualAnnotationProps')
  let dataFileId = req.query.dataFileId
  let ontologyId = req.query.ontologyFileId
  let nodeId = req.query.nodeId
  let id = req.params.individualId

  const ctx = {
    layout: false,
    _id: id,
    ontologyFileId: ontologyId,
    dataFileId: dataFileId,
    nodeId: nodeId,
    aproperties: ['Label', 'Comment', 'VersionInfo']
  }
  res.render('partials/individualMapAnnotationProps', ctx)
}

/**
 * Id's needed in path:
 * :individualId -> this id refers to the individual mapping id for the individual mapping that was created.
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * A data object with the following fields:
 * (string) tag. The node's tag
 * (string) name. The individual's name or the property that will become it's name
 * (string) label. A label (?)
 * (boolean) specification. It indicates that the created individual will modify the class of a previously created individual, as this is a subclass of the previously assigned class
 * (string) iri. The OWL IRI that identifies the OWL class that is being mapped
 * ** Optional **
 * (list) dataProps. A list of the data properties to be mapped to this individual. Can be an empty list and replaced later with the endpoint '/map/individual/:individualId/properties'
 * (list) objProps. A list of the object properties to be mapped to this individual. Can be an empty list and replaced later with the endpoint '/map/individual/:individualId/properties'
 *
 * Returns: Id for that individual mapping
 */
function updateIndividualMapping (req, res, next) {
  console.log('/map/individual/:individualId, updateIndividualMapping')
  let id = req.params.individualId
  if (id === undefined) {
    res.statusCode = 400
    res.json('Missing: individualId in path')
    return
  }
  let ontologyFileId = req.query.ontologyFileId
  let dataFileId = req.query.dataFIleId
  if (ontologyFileId === undefined || dataFileId === undefined) {
    res.statusCode = 400
    res.json('Missing: ontologyFileId or dataFIleId in query')
    return
  }

  let tag = req.body.tag
  let name = req.body.name
  let label = req.body.tag
  let specification = req.body.specification
  let IRI = req.body.iri
  let dataProps = req.body.dataProps
  let objProps = req.body.objProps

  service.updateIndividualMapping(id, [ontologyFileId, dataFileId], tag, name, label, specification, IRI, dataProps, objProps, (err, result) => {
    if (err) return next(err)
    return res.json(result)
  })
}

/**
 * Id's needed in path:
 * :individualId -> this id refers to the mapping id for the mapping that was created.
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * (string) dataFileId
 * (list) objProps. A list of the obj properties to be mapped to this individual.
 * (list-entry) an object containing a list of pairs with the nodeid and its parent it, plus the iri to be associated
 * example:
 * objProps : [
 {
   owlIRI: 'owl iri',
   nodeIds: [
     {
       parentId: 12,
       toMapId: 34
     },
     {
       parentId: 45,
       toMapId: 67
     }
   ]
 },
 {
   owlIRI: 'owl iri',
   nodeIds: [
     {
       parentId: 12,
       toMapId: 34
     },
     {
       parentId: 45,
       toMapId: 67
     }
   ]
 }
 ]
 * Returns: Id for that individual mapping
*/
// @todo falta redirects para ter post redirect get
function addIndividualMappingObjectProperties (req, res, next) {
  /*console.log('/map/individual/:individualId/properties/object', addIndividualMappingObjectProperties)
  let id = req.params.individualId
  let objProps = req.body.objProps
  service.addIndividualMappingProperties(id, objProps, (err, result) => {
    if (err) return next(err)
    return res.json(result)
  })*/
}

/**
 * @todo
 * Creates an Empty Individual and returns it or its id (?)
 */
function createMapping (req, res, next) {
  console.log('/map, createMapping')
  service.createEmptyMapping((err, result) => {
    if (err) return next(err)
    else res.json(result)
  })
}

/**
 * Id's needed in path:
 * :mappingId -> this id refers to the mapping id for the mapping that was created.
 * Will return 400 if not present
 *
 * Body Parameters:
 * (string) outputOntologyFileName. The name of the output file
 * (string) outputOntologyNamespace. The namespace of the output file
 * (string) fileList. A list containing the ids of the indput files (?)
 * (string) directOntologyImports. The ontology imports
 * (list) individualMappings. A list containing the id's for the individual mappings to be mapped now
 *
 * Returns: Id for that mapping
 */
function updateMapping (req, res, next) {
  console.log('/map/:mappingId, updateMapping')
  let id = req.params.mappingId
  if (id === undefined) {
    res.statusCode = 400
    res.json('Id needed')
    return
  }
  let outputOntologyFileName = req.body.outputOntologyFileName
  let outputOntologyNamespace = req.body.outputOntologyNamespace
  let fileList = req.body.fileList
  let directOntologyImports = req.body.directOntologyImports
  let individualMappings = req.body.individualMappings

  service.updateMapping(id, outputOntologyFileName, outputOntologyNamespace, fileList, directOntologyImports, individualMappings, (err, result) => {
    if (err) return next(err)
    return res.json(result)
  })
}

function getAllIndividualMappings (req, res, next) {
  console.log('/map/individual, getAllIndividualMappings')
  service.getAllIndividualMappings((err, indMappings) => {
    if (err) return next(err)
    return res.json(indMappings)
  })
}

function removeIndividualMapping (req, res, next) {
  console.log('/map/individual/, removeIndividualMapping')
  let id = req.body.id
  service.removeIndividualMapping(id, (err, result) => {
    if (err) return next(err)
    return res.json(result)
  })
}
