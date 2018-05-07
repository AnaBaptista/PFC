const router = require('express')()

const service = require('../services/mapping-service')
const fileService = require('../services/file-service')


module.exports = router

router.post('/map/individual/', createIndividual)
router.post('/map', createMapping)

router.put('/map/individual/:individualId', updateIndividualMapping)
router.put('/map/individual/:individualId/properties', updateIndividualMappingProperties)
router.put('/map/:mappingId', updateMapping)

router.get('/map/individual/:individualId/objectProperties', getIndividualObjProperties)
router.get('/map/individual/:individualId/dataProperties', getIndividualDataProperties)
router.get('/map/individual/:individualId/nameAndLabel', getIndividualNameAndLabel)


/**
 * Id's needed in query:
 * :ontologyFileId
 * :dataFIleId
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * (string) tag. The node's tag
 * (string) iri. The OWL IRI that identifies the OWL class that is being mapped
 * (string) nodeId.
 *
 */
function createIndividual (req, res, next) {
  let dataFileId = req.query.dataFileId
  let ontologyId = req.query.ontologyFileId
  let tag = req.body.tag
  let nodeId = req.body.nodeId
  let IRI = req.body.IRI

  service.createIndividualMapping(tag,IRI,[dataFileId,ontologyId],(err, result) =>{
    if(err) return next(err)
    const ctx = {
      layout: false,
      _id : result._id,
      tag : result.tag,
      IRI : result.owlClassIRI,
      ontologyFileId: ontologyId,
      dataFileId: dataFileId,
      nodeId: nodeId
    }
    res.render('partials/individualmap', ctx)
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
function getIndividualObjProperties(req,res,next){
  let dataFileId = req.query.dataFileId
  let ontologyId = req.query.ontologyFileId
  let nodeId = req.query.nodeId
  let id = req.params.individualId

  fileService.getOntologyFileObjectProperties(ontologyId,(err,result)=>{
    const ctx = {
      layout: false,
      _id : id,
      nodeId: nodeId,
      ontologyFileId: ontologyId,
      dataFileId: dataFileId,
      oproperties: result.properties
    }
    res.render('partials/individualmapoproperties', ctx)

  })


}

function getIndividualDataProperties(req,res,next){
  let dataFileId = req.query.dataFileId
  let ontologyId = req.query.ontologyFileId
  let nodeId = req.query.nodeId
  let id = req.params.individualId

  fileService.getOntologyFileDataProperties(ontologyId,(err,result)=>{
    const ctx = {
      layout: false,
      _id : id,
      nodeId: nodeId,
      ontologyFileId: ontologyId,
      dataFileId: dataFileId,
      dproperties: result.properties
    }
    res.render('partials/individualmapdproperties', ctx)

  })
}

function getIndividualNameAndLabel(req,res,next){
  let dataFileId = req.query.dataFileId
  let ontologyId = req.query.ontologyFileId
  let nodeId = req.query.nodeId
  let id = req.params.individualId

  const ctx = {
    layout: false,
    _id : id,
    ontologyFileId: ontologyId,
    dataFileId: dataFileId,
    nodeId: nodeId
  }
  res.render('partials/individualmapoproperties', ctx)
}




/**
 * Id's needed in path:
 * :individualId -> this id refers to the individual mapping id for the individual mapping that was created.
 * Will return a 400 status code if not present
 *
 * Id's needed in query:
 * :ontologyFileId
 * :dataFIleId
 * Will return a 400 status code if not present
 *
 * Body Parameters:
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
  let id = req.params.individualId
  if(id === undefined) {
    res.statusCode = 400
    res.json('Missing: individualId in path')
    return
  }
  let ontologyFileId = req.query.ontologyFileId
  let dataFileId = req.query.dataFIleId
  if(ontologyFileId === undefined || dataFIleId === undefined) {
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

  // @todo verificar se a lista de file ids é assim sou se precisa de ser key-value
  service.updateIndividualMapping(id,[ontologyFileId,dataFileId],tag,name,label,specification,IRI,dataProps,objProps, (err,result)=>{
    if(err) return next(err)
    return res.json(result)
  })
}

/**
 * Id's needed in path:
 * :individualId -> this id refers to the mapping id for the mapping that was created.
 * Will return a 400 status code if not present
 *
 * Body Parameters:
 * (list) dataProps. A list of the data properties to be mapped to this individual.
 * (list) objectProps. A list of the object properties to be mapped to this individual.
 *
 * Returns: Id for that individual mapping
 */
function updateIndividualMappingProperties (req, res, next) {
  let id = req.params.individualId
  if(id === undefined) {
    res.statusCode = 400
    res.json('Id needed')
    return
  }

  let dataProps = req.body.dataProps
  let objProps = req.body.objProps
  service.updateIndividualMappingProperties(id, dataProps,objProps, (err,result)=>{
    if(err) return next(err)
    return res.json(result)
  })
}

/**
 * @todo
 * Creates an Empty Individual and returns it or its id (?)
 */
function createMapping (req, res, next) {

  service.createEmptyMapping((err, result) =>{
    if(err) return next(err)
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
  let id = req.params.mappingId
  if(id === undefined) {
    res.statusCode = 400
    res.json('Id needed')
    return
  }
  let outputOntologyFileName = req.body.outputOntologyFileName
  let outputOntologyNamespace = req.body.outputOntologyNamespace
  let fileList = req.body.fileList
  let directOntologyImports = req.body.directOntologyImports
  let individualMappings = req.body.individualMappings

  service.updateMapping(id,outputOntologyFileName,outputOntologyNamespace,fileList,directOntologyImports,individualMappings, (err,result)=>{
    if(err) return next(err)
    return res.json(result)
  })
}