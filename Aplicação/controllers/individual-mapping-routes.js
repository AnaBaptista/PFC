const router = require('express')()

const service = require('../services/individual-mapping-service')

module.exports = router
router.post('/map/individual', createIndividual)

router.put('/map/individual/:individualId/name', putIndividualMappingName)
router.put('/map/individual/:individualId/properties/object', putIndividualMappingObjectProperties)
router.put('/map/individual/:individualId/properties/data', putIndividualMappingDataProperties)
router.put('/map/individual/:individualId/properties/annotation', putIndividualMappingAnnotationProperties)

router.get('/map/individual', getAllIndividualMappings)
router.get('/map/individual/:individualId', getIndividualMapping)
router.get('/map/individual/:id/properties/object/view', renderObjectProps)
router.get('/map/individual/:id/properties/data/view', renderDataProps)
router.get('/map/individual/:id/properties/annotation/view', renderAnnotationProps)

router.delete('/map/individual/:individualId', removeIndividualMapping)
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
    res.json({_id: id})
  })
}

/**
 * Id's needed in path:
 * :individualId -> this id refers to the mapping id for the mapping that was created.
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * (list) individualName. A list of node id's that will make the individual's name
 *
 * Returns: Id for that individual mapping
 */
function putIndividualMappingName (req, res, next) {
  console.log('/map/individual/:individualId/name, addIndividualMappingName')
  let id = req.params.individualId
  let input = req.body.individualName
  service.putIndividualMappingName(id, input, (err, name) => {
    if (err) return next(err)
    res.json(name)
  })
}

/**  Adds new obj properties or update existing ones
 * Id's needed in path:
 * :individualId -> this id refers to the mapping id for the mapping that was created.
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * (list) objProps. A list of the obj properties to be mapped to this individual.
 * (list-entry) an object containing the owlClassIRI and toMapNodeId,  both string types
 * example:
 * objProps : [  // if its adding a new property
    {
      owlIRI: 'owl iri',
      toMapNodeId: ['7531598426']

    },        // or if its updating an existing one
    {
      id: HyBVfiZxm,
      owlIRI: 'owl iri',
      toMapNodeId: ['159753268']
    }
  ]
 *
 * Returns: Id for that individual mapping
 */
// @todo falta redirects para ter post redirect get
function putIndividualMappingObjectProperties (req, res, next) {
  console.log('PUT - /map/individual/:individualId/properties/object, addIndividualMappingObjectProperties')
  let id = req.params.individualId
  let objProps = req.body.objProps
  service.putIndividualMappingObjectProperties(id, objProps, (err, props) => {
    if (err) return next(err)
    res.json(props)
  })
}

/** Adds new data properties or update existing ones
 * Id's needed in path:
 * :individualId -> this id refers to the mapping id for the mapping that was created.
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * (list) dataProps. A list of the obj properties to be mapped to this individual.
 * (list-entry) an object containing a list of pairs with the nodeid plus the iri to be associated
 * example:
 * dataProps : [     // if its adding a new property
    {
        owlIRI: 'owl iri',
        toMapNodeIds: ['123','456']
        type: 'Integer'
    }, // or if its updating an existing one
    {
        id: HyBVfiZxm,
        owlIRI: 'owl iri',
        toMapNodeId: ['789','753']
        type: 'String'
 }
  ]
 *
 * Returns: Id for that individual mapping
 */
function putIndividualMappingDataProperties (req, res, next) {
  console.log('/map/individual/:individualId/properties/data, addIndividualMappingDataProperties')
  let id = req.params.individualId
  let dataProps = req.body.dataProps
  service.putIndividualMappingDataProperties(id, dataProps, (err, props) => {
    if (err) return next(err)
    res.json(props)
  })
}

/** Adds new annotation properties or update existing ones
 * Id's needed in path:
 * :individualId -> this id refers to the mapping id for the mapping that was created.
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * (list) annotationProps. A list of the annotation properties to be mapped to this individual.
 * (list-entry) an object containing a list of pairs with the nodeid plus the iri to be associated
 * example:
 * annotationProps : [     // if its adding a new property
 {
     annotation: 'label',
     toMapNodeIds: ['123','456']
 }, // or if its updating an existing one
 {
     id: HyBVfiZxm,
     annotation: 'comment',
     toMapNodeId: ['789','753']
}
 ]
 *
 * Returns: Id for that individual mapping
 */
function putIndividualMappingAnnotationProperties (req, res, next) {
  console.log('/map/individual/:individualId/properties/annotation, addIndividualMappingAnnotationProperties')
  let id = req.params.individualId
  let annotationProps = req.body.annotationProps
  service.putIndividualMappingAnnotationProperties(id, annotationProps, (err, props) => {
    if (err) return next(err)
    res.json(props)
  })
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

function getIndividualMapping (req, res, next) {
  console.log('GET - /map/individual/:individualId, getAllIndividualMappings')
  let id = req.params.individualId
  service.getIndividualMapping(id, (err, indMapping) => {
    if (err) return next(err)
    return res.json(indMapping)
  })
}

function getAllIndividualMappings (req, res, next) {
  console.log('GET - /map/individual, getAllIndividualMappings')
  service.getAllIndividualMappings((err, indMappings) => {
    if (err) return next(err)
    return res.json(indMappings)
  })
}

function removeIndividualMapping (req, res, next) {
  console.log('/map/individual/, removeIndividualMapping')
  let id = req.body.id
  service.deleteIndividualMapping(id, (err, result) => {
    if (err) return next(err)
    return res.json(result)
  })
}

function renderObjectProps (req, res, next) {
  let id = req.params.id
  service.renderObjectProperties(id, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id}
    Object.assign(ctx, props)
    res.render('partials/individualMapObjectProps', ctx)
  })
}

function renderDataProps (req, res, next) {
  let id = req.params.id
  service.renderDataProperties(id, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id}
    Object.assign(ctx, props)
    res.render('partials/individualMapDataProps', ctx)
  })
}

function renderAnnotationProps (req, res, next) {
  let id = req.params.id
  service.renderAnnotationProperties(id, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id}
    Object.assign(ctx, props)
    res.render('partials/individualMapAnnotationProps', ctx)
  })
}
