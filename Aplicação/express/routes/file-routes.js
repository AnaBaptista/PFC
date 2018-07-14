const debug = require('debug')('HOMI::Server')

const Router = require('express')
const service = require('../services/file-service')
const router = Router()
const formidable = require('formidable')
const fs = require('fs')
const path = require('path')

module.exports = router

router.post('/dataFile', addDataFile)
router.post('/ontologyFile', addOntologyFile)

router.get('/dataFile', getDataFiles)
router.get('/ontologyFile', getOntologyFiles)

router.delete('/dataFile/:id', deleteDataFile)
router.delete('/ontologyFile/:id', deleteOntologyFile)

/** Adds a new Data file.
 * Body Parameters:
 * ( File ) file
 */
function addDataFile (req, res, next) {
  debug('POST /dataFile')
  setFileDir(req, (file, path) => {
    service.addDataFile(file, (err, id) => {
      if (err) return next(err)
      fs.unlink(path, (err) => {
        if (err) return next(err)
      })
      res.json(id)
    })
  })
}

/** Adds a new Ontology file.
 * Body Parameters:
 * ( File ) file
 */
function addOntologyFile (req, res, next) {
  debug('POST /ontologyFile')
  setFileDir(req, (file, path) => {
    service.addOntologyFile(file, (err, id) => {
      if (err) return next(err)
      fs.unlink(path, (err) => {
        if (err) return next(err)
      })
      res.json(id)
    })
  })
}

/*
 * Adiciona o ficheiro de input a uma diretoria temporaria
 */
function setFileDir (req, cb) {
  var form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.uploadDir = path.join(__dirname, '../tempFiles')
  form.on('file', (fields, file) => {
    let dir = path.join(form.uploadDir, file.name)
    fs.rename(file.path, dir)
    file.path = dir
    cb(file, dir)
  })
  form.parse(req)
}

/*
 * Returns all data files
 */
function getDataFiles (req, res, next) {
  debug('GET /dataFile')
  service.getDataFiles((err, files) => {
    if (err) return next(err)
    res.render('files', {files: files, type: 'Data'})
  })
}

/*
 * Returns all ontology files
 */
function getOntologyFiles (req, res, next) {
  debug('GET /ontologyFile')
  service.getOntologyFiles((err, files) => {
    if (err) return next(err)
    res.render('files', {files: files, type: 'Ontology'})
  })
}
/*
 * Deletes the datafile specified by Id
 */
function deleteDataFile (req, res, next) {
  debug('DELETE /dataFile/:id')
  let id = req.params.id
  service.deleteDataFile(id, (err) => {
    if (err) return next(err)
    res.end()
  })
}
/*
 * Deletes the ontology file specified by Id
 */
function deleteOntologyFile (req, res, next) {
  debug('DELETE /ontologyFile/:id')
  let id = req.params.id
  service.deleteOntologyFile(id, (err) => {
    if (err) return next(err)
    res.end()
  })
}
