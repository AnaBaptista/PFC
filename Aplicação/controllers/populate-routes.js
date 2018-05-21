const Router = require('express')
const router = Router()

const service = require('../services/populate-service')
const fileService = require('../services/file-service')

module.exports = router

router.post('/populate', addPopulate)

router.get('/populate/:id', getPopulate)
router.get('/populate/:id/nodes', getPopulateTree)

function addPopulate (req, res, next) {
  let data = req.body.data
  service.addPopulate(data, (err, id) => {
    if (err) return next(err)
    res.json({id: id})
  })
}

function getPopulate (req, res, next) {
  service.getPopulate(req.params.id, (err, pop) => {
    if (err) return next(err)
    res.json(pop)
  })
}

function getPopulateTree (req, res, next) {
  let id = req.params.id
  service.getPopulateDataFiles(id, (err, files) => {
    if (err) return next(err)
    fileService.getDataFileNodes(files.map(o => o.chaosid), (err, tree) => {
      if (err) return next(err)
      res.json(tree)
    })
  })
}
