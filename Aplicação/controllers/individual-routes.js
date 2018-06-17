const router = require('express')()
const service = require('../services/individual-service')

module.exports = router

router.post('/individual', createIndividual)

router.put('/individual/:id/properties/annotation', putIndividualAnnotationProperties)
router.put('/individual/:id/properties/data', putIndividualDataProperties)
router.put('/individual/:id/properties/object', putIndividualObjectProperties)

router.get('/individual/:id/properties/annotation/view', renderAnnotationProperties)
router.get('/individual/:id/properties/data/view', renderDataProperties)
router.get('/individual/:id/properties/object/view', renderObjectProperties)

function createIndividual (req, res, next) {
  console.log('POST -> /individual, createIndividual')
  let input = req.body.data
  let popId = req.body.populateId
  service.createIndividual(input, popId, (err, id) => {
    if (err) return next(err)
    res.json({_id: id})
  })
}

function putIndividualAnnotationProperties (req, res, next) {
  console.log('PUT -> /individual/:id/properties/annotation, putIndividualAnnotationProperties')
  let id = req.params.id
  let data = req.body.annotationProps
  service.putIndividualAnnotationProperties(id, data, (err, props) => {
    if (err) return next(err)
    res.json(props)
  })
}

function putIndividualDataProperties (req, res, next) {
  console.log('PUT -> /individual/:id/properties/data, putIndividualDataProperties')
  let id = req.params.id
  let data = req.body.dataProps
  service.putIndividualDataProperties(id, data, (err, props) => {
    if (err) return next(err)
    res.json(props)
  })
}

function putIndividualObjectProperties (req, res, next) {
  console.log('PUT -> /individual/:id/properties/object, putIndividualObjectProperties')
  let id = req.params.id
  let data = req.body.objProps
  service.putIndividualObjectProperties(id, data, (err, props) => {
    if (err) return next(err)
    res.json(props)
  })
}

function renderAnnotationProperties (req, res, next) {
  console.log('GET -> /individual/:id/properties/annotation/view, renderAnnotationProperties')
  let id = req.params.id
  service.renderAnnotationProperties(id, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id}
    Object.assign(ctx, props)
    res.render('partials/individualAnnotationProps', ctx)
  })
}

function renderDataProperties (req, res, next) {
  console.log('GET -> /individual/:id/properties/data/view, renderDataProperties')
  let id = req.params.id
  service.renderDataProperties(id, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id}
    Object.assign(ctx, props)
    res.render('partials/individualDataProps', ctx)
  })
}

function renderObjectProperties (req, res, next) {
  console.log('GET -> /individual/:id/properties/object/view, renderObjectProperties')
  let id = req.params.id
  let populateId = req.query.populateId
  service.renderObjectProperties(id, populateId, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id, populateId: populateId}
    Object.assign(ctx, props)
    res.render('partials/individualObjectProps', ctx)
  })
}
