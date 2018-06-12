const mdb = require('../data-access/mongodb-access')
const fakefilemaker = require('../utils/FakeFile')

mdb.findById('IndividualMappings', '5b1fef788b45ea1c34a34db2', (err, indMap) => {
  if (err) console.log(err)
  fakefilemaker([indMap], (err, result) => {
    if (err) console.log(err)
    console.log(result)
  })
})