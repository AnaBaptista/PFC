const debug = require('debug')('HOMI::Server')

const Router = require('express')
const router = Router()

module.exports = router

// populate routes
router.post('/populate', addPopulate)
router.put('/populate/:id/output', createOutputFile)
router.get('/populate', getPopulates)
router.delete('/populate/:id', deletePopulate)
// populate with data routes
router.get('/populate/data/:id', getPopulateWithData)
router.get('/populate/data/:id/tree', getPopulateDataTree)
router.get('/populate/data/:id/mapping', getPopulateDataMapping)
router.get('/populate/data/:id/individual/:ind', getPopulateDataIndividual)
router.get('/populate/data/:id/individual/:ind/tree', getPopulateDataIndividualTree)
// populate without data routes
router.put('/populate/nondata/:id/finalize', finalize)
router.get('/populate/nondata/:id', getPopulateWithoutData)
router.get('/populate/nondata/:id/mapping', getPopulateNonDataMapping)
router.get('/populate/nondata/:id/individual/:ind', getPopulateNonDataIndividual)

const service = require('../services/populate-service')

/**
 * GENERIC POPULATE
 */
function addPopulate (req, res, next) {
  debug('POST /populate')
  let data = req.body.data
  service.addPopulate(data, (err, id) => {
    if (err) return next(err)
    res.json({id: id})
  })
}

function createOutputFile (req, res, next) {
  debug('PUT /populate/:id/output')
  let id = req.params.id
  service.createOutputFile(id, (err, out) => {
    if (err) return next(err)
    res.end()
  })
}

function getPopulates (req, res, next) {
  debug('GET /populate')
  service.getPopulates((err, pops) => {
    if (err) return next(err)
    res.render('populates', pops)
  })
}

function deletePopulate (req, res, next) {
  debug('DELETE /populate/:id')
  let id = req.params.id
  service.deletePopulate(id, (err) => {
    if (err) return next(err)
    res.end()
  })
}

/**
 * POPULATE WITH DATA
 */

function getPopulateWithData (req, res, next) {
  debug('GET /populate/data/:id')
  let id = req.params.id
  service.renderPopulate(id, (err, pop) => {
    if (err) return next(err)
    res.render('populateWithData', pop)
  })
}

function getPopulateDataTree (req, res, next) {
  debug('GET /populate/data/:id/tree')
  let id = req.params.id
  service.getPopulateDataTree(id, (err, tree) => {
    if (err) return next(err)
    res.json(tree)
  })
}

function getPopulateDataMapping (req, res, next) {
  debug('GET /populate/data/:id/mapping')
  let id = req.params.id
  service.getPopulateDataMapping(id, (err, map) => {
    if (err) return next(err)
    res.render('populateWithDataMapping', map)
  })
}

function getPopulateDataIndividual (req, res, next) {
  debug('GET /populate/data/:id/individual/:ind')
  let ind = req.params.ind
  let id = req.params.id
  service.getPopulateDataIndividual(ind, (err, individual) => {
    if (err) return next(err)
    let ctx = {
      popId: id
    }
    Object.assign(ctx, individual)
    res.render('individualMapping', ctx)
  })
}

function getPopulateDataIndividualTree (req, res, next) {
  debug('GET /populate/data/:id/individual/:ind/tree')
  let id = req.params.id
  let ind = req.params.ind
  service.getPopulateDataIndividualTree(id, ind, (err, tree) => {
    if (err) return next(err)
    res.json(tree)
  })
}

/**
 * POPULATE WITHOUT DATA
 */

// receives a list of individual mappings id's to be inserted into chaos pop and etc
function finalize (req, res, next) {
  decodeURI('PUT /populate/nondata/:id/finalize')
  let indMapIds = req.body.list
  service.beginProcessOfPopulateWithoutData(indMapIds, (err) => {
    if (err) return next(err)
    return res.json(indMapIds)
  })
}

function getPopulateWithoutData (req, res, next) {
  debug('GET /populate/nondata/:id')
  let id = req.params.id
  service.renderPopulate(id, (err, pop) => {
    if (err) return next(err)
    res.render('populateWithoutData', pop)
  })
}

function getPopulateNonDataMapping (req, res, next) {
  debug('GET /populate/nondata/:id/mapping')
  let id = req.params.id
  service.getPopulateNonDataMapping(id, (err, map) => {
    if (err) return next(err)
    res.render('populateWithoutDataMapping', map)
  })
}

function getPopulateNonDataIndividual (req, res, next) {
  debug('GET /populate/nondata/:id/individual/:ind')
  let id = req.params.id
  let ind = req.params.ind
  service.getPopulateNonDataIndividual(id, ind, (err, individual) => {
    if (err) return next(err)
    let ctx = {
      popId: id
    }
    Object.assign(ctx, individual)
    res.render('individual', ctx)
  })
}
