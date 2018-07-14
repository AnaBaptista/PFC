const debug = require('debug')('HOMI::Server')

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

router.delete('/individual/:id', deleteIndividual)
router.delete('/individual/:id/properties/:pid', deleteIndividualProperty)

/*
 * creates new individual
 * needs in body: id, the individual  id
 *                populateId, the id for the populate
 */
function createIndividual (req, res, next) {
  debug('POST /individual')
  let input = req.body.data
  let popId = req.body.populateId
  service.createIndividual(input, popId, (err, id) => {
    if (err) return next(err)
    res.json({_id: id})
  })
}
/*
 * inserts a new or updates an existing Annotation property
 * needs in body: (list) annotationProps, a list containing the annotation properties
 * neesd in path: id, individual mappings' id
 */
function putIndividualAnnotationProperties (req, res, next) {
  debug('PUT /individual/:id/properties/annotation')
  let id = req.params.id
  let data = req.body.annotationProps
  service.putIndividualAnnotationProperties(id, data, (err, props) => {
    if (err) return next(err)
    let ctx = {layout: false, type: 'annotation'}
    Object.assign(ctx, {props: props, _id: id})
    res.render('partials/individualProps', ctx)
  })
}

/*
 * inserts a new or updates an existing data property
 * needs in body: (list) dataProps, a list containing the data properties
 * neesd in path: id, individual mappings' id
 */
function putIndividualDataProperties (req, res, next) {
  debug('PUT /individual/:id/properties/data')
  let id = req.params.id
  let data = req.body.dataProps
  service.putIndividualDataProperties(id, data, (err, props) => {
    if (err) return next(err)
    let ctx = {layout: false, type: 'data'}
    Object.assign(ctx, {props: props, _id: id})
    res.render('partials/individualProps', ctx)
  })
}

/*
 * inserts a new or updates an existing object property
 * needs in body: (list) objProps, a list containing the object properties
 *                       populateId, the populate's id
 * needs in path: id, individual mappings' id
 */
function putIndividualObjectProperties (req, res, next) {
  debug('PUT /individual/:id/properties/object')
  let id = req.params.id
  let data = req.body.objProps
  let populateId = req.body.populateId
  service.putIndividualObjectProperties(id, data, (err, props) => {
    if (err) return next(err)
    let ctx = {layout: false, type: 'object'}
    Object.assign(ctx, {props: props, _id: id, populateId: populateId})
    res.render('partials/individualProps', ctx)
  })
}

/*
 * renders annotation properties
 * needs in path: id, the individual's id
 */
function renderAnnotationProperties (req, res, next) {
  debug('GET /individual/:id/properties/annotation/view')
  let id = req.params.id
  service.renderAnnotationProperties(id, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id}
    Object.assign(ctx, props)
    res.render('partials/individualAnnotationProps', ctx)
  })
}

/*
 * renders data properties
 * needs in path: id, the individual's id
 */
function renderDataProperties (req, res, next) {
  debug('GET /individual/:id/properties/data/view')
  let id = req.params.id
  service.renderDataProperties(id, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id}
    Object.assign(ctx, props)
    res.render('partials/individualDataProps', ctx)
  })
}

/*
 * renders object properties
 * needs in path: id, the individual's id
 */
function renderObjectProperties (req, res, next) {
  debug('GET /individual/:id/properties/object/view')
  let id = req.params.id
  let populateId = req.query.populateId
  service.renderObjectProperties(id, populateId, (err, props) => {
    if (err) return next(err)
    const ctx = {layout: false, _id: id, populateId: populateId}
    Object.assign(ctx, props)
    res.render('partials/individualObjectProps', ctx)
  })
}

/*
 * deletes an individual
 * needs in path: id, the individual's id
 */
function deleteIndividual (req, res, next) {
  debug('DELETE /individual/:id')
  let id = req.params.id
  let populateId = req.query.populateId
  service.deleteIndividual(id, populateId, (err) => {
    if (err) return next(err)
    res.end()
  })
}

/*
 * Delete an individual's property
 * needs in path : id, this refers to the id of the desired individual mapping
 *                pid, this refers to the id of the property to be deleted
 * needs in query: type, describes the type of property to be deleted (Data, Object or Annotation)
 */
function deleteIndividualProperty (req, res, next) {
  debug('DELETE /individual/:id/properties/:pid')
  let type = req.query.type
  let id = req.params.id
  let propId = req.params.pid
  service.deleteIndividualProperty(id, propId, type, (err) => {
    if (err) return next(err)
    res.end()
  })
}
