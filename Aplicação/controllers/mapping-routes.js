const router = require('express')()

module.exports = router

router.post('/map', createMapping)
router.put('/map/:id', updateMapping)

const service = require('../services/mapping-service')


function createMapping (req, res, next) {
  console.log('/map, createMapping')
  let data = req.body.data
  service.createMapping(data, (err) => {
    if (err) return next(err)
    res.end()
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