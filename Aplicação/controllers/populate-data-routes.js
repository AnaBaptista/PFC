const Router = require('express')
const router = Router()

module.exports = router

router.post('/populate', addPopulate)

router.get('/populate/nondata/:id', getPopulateWithoutData)
router.get('/populate/data/:id', getPopulateWithData)
router.get('/populate/data/:id/tree', getPopulateTree)
router.get('/populate/data/:id/individual/:ind', getPopulateIndividual)
router.get('/populate/data/:id/individual/:ind/tree', getPopulateIndividualTree)

const service = require('../services/populate-data-service')

function addPopulate (req, res, next) {
  let data = req.body.data
  service.addPopulate(data, (err, id) => {
    if (err) return next(err)
    res.json({id: id})
  })
}

function getPopulateWithoutData (req, res, next) {
  let id = req.params.id
  service.renderPopulateWithoutData(id, (err, pop) => {
    if (err) return next(err)
    res.render('popolateWithoutData', pop)
  })
}

function getPopulateWithData (req, res, next) {
  let id = req.params.id
  service.renderPopulateWithData(id, (err, pop) => {
    if (err) return next(err)
    res.render('populateWithData', pop)
  })
}

function getPopulateTree (req, res, next) {
  let id = req.params.id
  service.getPopulateTree(id, (err, tree) => {
    if (err) return next(err)
    res.json(tree)
  })
}

function getPopulateIndividual (req, res, next) {
  let ind = req.params.ind
  let id = req.params.id
  service.getPopulateIndividual(id, ind, (err, individual) => {
    if (err) return next(err)
    let ctx = {
      popId: req.params.id
    }
    Object.assign(ctx, individual)
    res.render('individualMapping', ctx)
  })
}

function getPopulateIndividualTree (req, res, next) {
  let id = req.params.id
  let ind = req.params.ind
  service.getPopulateIndividualTree(id, ind, (err, tree) => {
    if (err) return next(err)
    res.json(tree)
  })
}
