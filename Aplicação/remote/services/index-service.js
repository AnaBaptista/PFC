module.exports = {
  home
}

const fileService = require('../services/file-service')

function home (cb) {
  fileService.getOntologyFiles((err, ofiles) => {
    if (err) return cb(err)
    fileService.getDataFiles((err, dfiles) => {
      if (err) return cb(err)
      let ctx = {dataFiles: dfiles, ontologyFiles: ofiles}
      cb(null, ctx)
    })
  })
}
