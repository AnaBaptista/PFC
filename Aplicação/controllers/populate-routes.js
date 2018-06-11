const Router = require('express')
const router = Router()

module.exports = router

router.post('/populate', addPopulate)

router.put('/populate/:id/output', createOutputFile)

router.get('/populate/data/:id', getPopulateWithData)
router.get('/populate/data/:id/tree', getPopulateDataTree)
router.get('/populate/data/:id/mapping', getPopulateDataMapping)
router.get('/populate/data/:id/individual/:ind', getPopulateDataIndividual)
router.get('/populate/data/:id/individual/:ind/tree', getPopulateDataIndividualTree)

router.get('/populate/nondata/:id', getPopulateWithoutData)
router.get('/populate/nondata/:id/individual/:ind', getPopulateNonDataIndividual)

const service = require('../services/populate-service')

/**
 * GENERIC POPULATE
 */
function addPopulate (req, res, next) {
  let data = req.body.data
  service.addPopulate(data, (err, id) => {
    if (err) return next(err)
    res.json({id: id})
  })
}

function createOutputFile (req, res, next) {
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
  let id = req.params.id
  service.renderPopulate(id, (err, pop) => {
    if (err) return next(err)
    res.render('populateWithData', pop)
  })
}

function getPopulateDataTree (req, res, next) {
  let id = req.params.id
  service.getPopulateDataTree(id, (err, tree) => {
    if (err) return next(err)
    res.json(tree)
  })
}

function getPopulateDataMapping (req, res, next) {
  let id = req.params.id
  service.getPopulateDataMapping(id, (err, map) => {
    if (err) return next(err)
    res.render('populateWithDataMapping', map)
  })
}

function getPopulateDataIndividual (req, res, next) {
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

function getPopulateWithoutData (req, res, next) {
  let id = req.params.id
  service.renderPopulate(id, (err, pop) => {
    if (err) return next(err)
    res.render('populateWithoutData', pop)
  })
}

function getPopulateNonDataIndividual (req, res, next) {
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
