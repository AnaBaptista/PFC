const Router = require('express')
const router = Router()

const service = require('../services/file-service')

module.exports = router

router.get('/', home)

function home (req, res, next) {
  service.getOntologyFiles((err, ofiles) => {
    if (err) return next(err)
    service.getDataFiles((err, dfiles) => {
      if (err) return next(err)
      let dFiles = dfiles.files.map(f => {
        let name = `${f.name.split('-')[0]}.${f.name.split('.')[1]}`
        return {name: name, _id: f._id}
      })
      let oFiles = ofiles.files.map(f => {
        let name = f.namespace.split('/').pop()
        return {name: name, _id: f._id}
      })
      // TODO: distinct ontology namspace
      let ctx = {dataFiles: dFiles, ontologyFiles: oFiles}
      res.render('index', ctx)
    })
  })
}
