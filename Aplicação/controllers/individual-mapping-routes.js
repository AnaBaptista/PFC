const router = require('express')()

const service = require('../services/individual-mapping-service')
const fileService = require('../services/file-service')

module.exports = router

router.post('/map/individual', createIndividual)
router.post('/map', createMapping)
router.post('/map/individual/:individualId/properties/object', addIndividualMappingObjectProperties)
router.post('/map/individual/:individualId/properties/data', addIndividualMappingDataProperties)
router.post('/map/individual/:individualId/properties/annotation', addIndividualMappingAnnotationProperties)

router.get('/map/individual', getAllIndividualMappings)
// router.get('/map/individual/:individualId', getIndividualMapping)
// router.get('/map/individual/', removeIndividualMapping)

router.get('/map/individual/:id/objectprops/view', renderObjectProps)
router.get('/map/individual/:id/dataprops/view', renderDataProps)
router.get('/map/individual/:id/annotationprops/view', renderAnnotationProps)

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
 * :individualId -> this id refers to the mapping id for the mapping that was created.
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * (list) objProps. A list of the obj properties to be mapped to this individual.
 * (list-entry) an object containing the owlClassIRI and toMapNodeId,  both string types
 * example:
 * objProps : [
    {
      owlIRI: 'owl iri',
      toMapNodeId: '7531598426'

    },
    {
      owlIRI: 'owl iri',
      toMapNodeId: '159753268'
    }
  ]
 *
 * Returns: Id for that individual mapping
 */
// @todo falta redirects para ter post redirect get
function addIndividualMappingObjectProperties (req, res, next) {
  console.log('/map/individual/:individualId/properties/object', addIndividualMappingObjectProperties)
  let id = req.params.individualId
  let objProps = req.body.objProps
  service.addIndividualMappingProperties(id, objProps, (err, result) => {
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
 * (list) dataProps. A list of the obj properties to be mapped to this individual.
 * (list-entry) an object containing a list of pairs with the nodeid plus the iri to be associated
 * example:
 * objProps : [
    {
        owlIRI: 'owl iri',
        toMapNodeIds: ['123','456']
    },
    {
        owlIRI: 'owl iri',
        toMapNodeId: ['789','753']
    }
  ]
 *
 * Returns: Id for that individual mapping
 */
function addIndividualMappingDataProperties (req, res, next) {
  console.log('/map/individual/:individualId/properties/data', addIndividualMappingDataProperties)
  let id = req.params.individualId
  let objProps = req.body.objProps
  service.addIndividualMappingProperties(id, objProps, (err, result) => {
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
 * (list) annotationProps. A list of the annotation properties to be mapped to this individual.
 * (list-entry) an object containing a list of pairs with the nodeid plus the iri to be associated
 * example:
 * annotationProps : [
 {
     owlIRI: 'owl iri',
     toMapNodeIds: ['123','456']
 },
 {
     owlIRI: 'owl iri',
     toMapNodeId: ['789','753']
 }
 ]
 *
 * Returns: Id for that individual mapping
 */
function addIndividualMappingAnnotationProperties (req, res, next) {
  console.log('/map/individual/:individualId/properties/annotation', addIndividualMappingAnnotationProperties)
  let id = req.params.individualId
  let annotationProps = req.body.annotationProps
  service.addIndividualMappingProperties(id, annotationProps, (err, result) => {
    if (err) return next(err)
    return res.json(result)
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
  const ctx = {
    layout: false,
    _id: id,
    aproperties: ['Label', 'Comment', 'VersionInfo']
  }
  res.render('partials/individualMapAnnotationProps', ctx)
}
