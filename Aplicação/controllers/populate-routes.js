const Router = require('express')
const router = Router()

module.exports = router

// populate routes
router.post('/populate', addPopulate)
router.put('/populate/:id/output', createOutputFile)
// data routes
router.get('/populate/data/:id', getPopulateWithData)
router.get('/populate/data/:id/tree', getPopulateDataTree)
router.get('/populate/data/:id/mapping', getPopulateDataMapping)
router.get('/populate/data/:id/individual/:ind', getPopulateDataIndividual)
router.get('/populate/data/:id/individual/:ind/tree', getPopulateDataIndividualTree)
// nondata routes
router.put('/populate/:id/finalizeIndividual', finalizeIndividual)
router.get('/populate/nondata/:id', getPopulateWithoutData)
router.get('/populate/nondata/:id/mapping', getPopulateNonDataMapping)
router.get('/populate/nondata/:id/individual/:ind', getPopulateNonDataIndividual)

const service = require('../services/populate-service')

/**
 * GENERIC POPULATE
 */
function addPopulate (req, res, next) {
  console.log('POST -> /populate, addPopulate')
  let data = req.body.data
  service.addPopulate(data, (err, id) => {
    if (err) return next(err)
    res.json({id: id})
  })
}

function createOutputFile (req, res, next) {
  console.log('PUT -> /populate/:id/output, createOutputFile')
  let id = req.params.id
  service.createOutputFile(id, (err, out) => {
    if (err) return next(err)
    res.end()
  })
}

/**
 * POPULATE WITH DATA
 */

function getPopulateWithData (req, res, next) {
  console.log('GET -> /populate/data/:id, getPopulateWithData')
  let id = req.params.id
  service.renderPopulate(id, (err, pop) => {
    if (err) return next(err)
    res.render('populateWithData', pop)
  })
}

function getPopulateDataTree (req, res, next) {
  console.log('GET -> /populate/data/:id/tree, getPopulateDataTree')
  let id = req.params.id
  service.getPopulateDataTree(id, (err, tree) => {
    if (err) return next(err)
    res.json(tree)
  })
}

function getPopulateDataMapping (req, res, next) {
  console.log('GET -> /populate/data/:id/mapping, getPopulateDataMapping')
  let id = req.params.id
  service.getPopulateDataMapping(id, (err, map) => {
    if (err) return next(err)
    res.render('populateWithDataMapping', map)
  })
}

function getPopulateDataIndividual (req, res, next) {
  console.log('GET -> /populate/data/:id/individual/:ind, getPopulateDataIndividual')
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
  console.log('/populate/data/:id/individual/:ind/tree, getPopulateDataIndividualTree')
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
function finalizeIndividual (req, res, next) {
  console.log('PUT -> /populate/:id/finalizeIndividual, finalizeIndividual')
  let indMapIds = req.body.list
  service.beginProcessOfPopulateWithoutData(indMapIds, (err) => {
    if (err) return next(err)
    return res.json(indMapIds)
  })
}

function getPopulateWithoutData (req, res, next) {
  console.log('GET -> /populate/nondata/:id, getPopulateWithoutData')
  let id = req.params.id
  service.renderPopulate(id, (err, pop) => {
    if (err) return next(err)
    res.render('populateWithoutData', pop)
  })
}

function getPopulateNonDataMapping (req, res, next) {
  console.log('GET -> /populate/nondata/:id/mapping, getPopulateNonDataMapping')
  let id = req.params.id
  service.getPopulateNonDataMapping(id, (err, map) => {
    if (err) return next(err)
    res.render('populateWithoutDataMapping', map)
  })
}

function getPopulateNonDataIndividual (req, res, next) {
  console.log('GET -> /populate/nondata/:id/individual/:ind, getPopulateNonDataIndividual')
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
