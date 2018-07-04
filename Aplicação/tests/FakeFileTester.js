let id = 'agdg-ahsbd'
while (id.indexOf('-') > -1)
  id = idGen.generate()


// const mdb = require('../data-access/mongodb-access')
// const fakefilemaker = require('../utils/FakeFileMaker')
//
// mdb.findById('IndividualMappings', '5b1fef788b45ea1c34a34db2', (err, indMap) => {
//   if (err) console.log(err)
//   fakefilemaker([indMap], (err, result) => {
//     if (err) console.log(err)
//     console.log(result)
//   })
// })