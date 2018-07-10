const database = 'HomiDb'
const collections = ['DataFiles', 'IndividualMappings', 'OntologyFiles', 'Populates']

const MongoClient = require('mongodb').MongoClient
const url = `mongodb://localhost:27017/${database}`
const mongoOptions = {useNewUrlParser: true}

const async = require('async')

MongoClient.connect(url, mongoOptions, (err, db) => {
  if (err) throw err
  db.close()
})

MongoClient.connect(url, mongoOptions, (err, db) => {
  if (err) throw err
  const dbo = db.db(database)
  async.map(collections, (collection, next) => {
    dbo.createCollection(collection, (err, res) => {
      if (err) next(err)
      next()
    })
  }, (err) => {
    if (err) throw err
    db.close()
  })
})
