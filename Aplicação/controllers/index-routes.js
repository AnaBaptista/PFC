const Router = require('express')
const router = Router()

const service = require('../services/file-service')

module.exports = router

router.get('/', home)

router.post('/populate/data', populateWithData)
router.post('/populate', populateWithoutData)

function home (req, res, next) {
  service.getOntologyFiles((err, ofiles) => {
    if (err) return next(err)
    service.getDataFiles((err, dfiles) => {
      if (err) return next(err)
      let dFiles = dfiles.files.map(f => {
        return {name: f.name, _id: f._id}
      })
      let oFiles = ofiles.files.map(f => {
        let name = f.path.split('\\').pop()
        return {name: name, _id: f._id}
      })
      // TODO: distinct ontology namspace
      let ctx = {dataFiles: dFiles, ontologyFiles: oFiles}
      res.render('index', ctx)
    })
  })
}

function populateWithData (req, res, next) {
  let ontologyFileIds = req.body.ontologyFiles
  let dataFileIds = req.body.dataFiles
  service.getOntologyFileClasses(ontologyFileIds, (err, classes) => {
    if (err) return next(err)
    let ctx = {
      classes: classes,
      dataFileIds:  dataFileIds,
      ontologyFileIds: ontologyFileIds,
      layout: false
    }
    res.render('populateWithData', ctx)
  })
}

function populateWithoutData (req, res, next) {
  res.render('populateWithoutData')
}

