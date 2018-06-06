module.exports = {
  home
}

const fileService = require('../services/file-service')
const db = require('../data-access/mongodb-access')
const col = 'Populates'

function home (cb) {
  fileService.getOntologyFiles((err, ofiles) => {
    if (err) return cb(err)
    fileService.getDataFiles((err, dfiles) => {
      if (err) return cb(err)
      let ctx = {dataFiles: dfiles, ontologyFiles: ofiles}
      db.findByQuery(col, {}, (err, pops) => {
        if (err) return cb(err)
        let populates = []
        pops.forEach(pop => {
          let populate = {
            _id: pop._id.toString(),
            ontologyFiles: pop.ontologyFiles.map(file => file.name),
            type: 'without data'
          }
          if (pop.dataFiles) {
            populate.dataFiles = pop.dataFiles.map(file => file.name)
            populate['type'] = 'with data'
          }
          populates.push(populate)
        })
        Object.assign(ctx, {populates: populates})
        cb(null, ctx)
      })
    })
  })
}
