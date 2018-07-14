const debug = require('debug')('HOMI::Server')

const router = require('express')()

module.exports = router

router.post('/map', createMapping)
router.get('/map/:id', getMapping)
router.delete('/map/:id', deleteMapping)

const service = require('../services/mapping-service')

/*
 * creates a new Individual mapping
 * needs in body: (Object) data
 * data : {
 *    name:
 *    populateId
 *    indmappings
 * }
 */
function createMapping (req, res, next) {
  debug('POST /map')
  let data = req.body.data
  service.createMapping(data, (err) => {
    if (err) return next(err)
    res.end()
  })
}

/*
 * Returns a specific mapping
 * needs in path: id, mapping id
 */
function getMapping (req, res, next) {
  debug('GET /map:id, getMapping')
  let data = req.params.id
  service.getMapping(data, (err) => {
    if (err) return next(err)
    res.end()
  })
}

/*
 * Deletes a specific mapping
 * needs in body: data, mapping id
 */
function deleteMapping (req, res, next) {
  debug('DELETE /map:id')
  let data = req.body.data
  service.deleteMapping(data, (err) => {
    if (err) return next(err)
    res.end()
  })
}
