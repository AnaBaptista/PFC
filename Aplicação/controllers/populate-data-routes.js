const Router = require('express')
const router = Router()

module.exports = router

router.post('/populate/data', addPopulate)

router.get('/populate/data/:id', getPopulate)
router.get('/populate/data/:id/tree', getPopulateTree)

const service = require('../services/populate-data-service')

function addPopulate (req, res, next) {
  let data = req.body.data
  service.addPopulate(data, (err, id) => {
    if (err) return next(err)
    res.json({id: id})
  })
}

function getPopulate (req, res, next) {
  let id = req.params.id
  service.renderPopulate(id, (err, pop) => {
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