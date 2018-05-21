const Router = require('express')
const router = Router()

const fileService = require('../services/file-service')
const populateService = require('../services/populate-service')

module.exports = router

router.get('/', home)
router.get('/session/data/:id', populateWithData)
router.get('/session/:id', populateWithoutData)

function home (req, res, next) {
  fileService.getOntologyFiles((err, ofiles) => {
    if (err) return next(err)
    fileService.getDataFiles((err, dfiles) => {
      if (err) return next(err)
      let ctx = {dataFiles: dfiles, ontologyFiles: ofiles}
      res.render('index', ctx)
    })
  })
}

function populateWithData (req, res, next) {
  let id = req.params.id
  populateService.getPopulateOntologyFiles(id, (err, files) => {
    if (err) return next(err)
    fileService.getOntologyFileClasses(files.map(onto => onto.chaosid), (err, classes) => {
      if (err) return next(err)
      let ctx = {
        classes: classes,
        id: id
      }
      res.render('populateWithData', ctx)
    })
  })
}

function populateWithoutData (req, res, next) {
  res.render('populateWithoutData')
}
