module.exports = {
  sendDocToDb,
  findById,
  updateById /*
  findByQuery,
  deleteById */
}

/*
 * MongoDb Requests
 */
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'HomiDb'
const indMapCollectionName = 'IndividualMappings'
const ObjectID = require('mongodb').ObjectID

/**
 * @param doc
 * @param {function} cb(err, result)
 */
function sendDocToDb (doc, cb) {
  MongoClient.connect(url, (err, client) => {
    if (err) return cb(err)
    client.db(dbName).collection(indMapCollectionName).insertOne(doc, (err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(null, result.insertedId.toString())
    })
  })
}

/**
 * @param id
 * @param {function} cb(err, result)
 */
function findById (id, cb) {
  MongoClient.connect(url, (err, client) => {
    if (err) return cb(err)
    client.db(dbName).collection(indMapCollectionName).findOne({_id: ObjectID(id)}, (err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(result)
    })
  })
}

/**
 * @param id
 * @param {function} cb(err, result)
 */
function updateById (id, newValues, cb) {
  MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err)
    let query = {_id: ObjectID('5afdbff24506ee1f084a25f1')}
    client.db(dbName).collection(indMapCollectionName).updateOne(query, newValues, (err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(result)
    })
  })
}

/* function handleMongoResult (client, err, result, cb) {
  client.close()
  if (err) return cb(err)
  return cb(null, result.insertedId.toString())
} */
