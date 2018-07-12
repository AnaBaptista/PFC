module.exports = {
  sendDocToDb,
  findById,
  findByIds,
  updateById,
  findByQuery,
  deleteById,
  deleteByIds
}

/*
 * MongoDb Requests
 */
const MongoClient = require('mongodb').MongoClient
// let { config } = require('../app')
// let url = config.mongoDb

url = 'mongodb://localhost:27017'
const dbName = 'HomiDb'
const ObjectID = require('mongodb').ObjectID
const mongoOptions = {useNewUrlParser: true}

/**
 * This function inserts a new document into col
 * @param col {String} colletion name
 * @param doc {Object} document to insert
 * @param cb {function} (err, result) callback function
 */
function sendDocToDb (col, doc, cb) {
  MongoClient.connect(url, mongoOptions, (err, client) => {
    if (err) return cb(err)
    client.db(dbName).collection(col).insertOne(doc, (err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(null, result.insertedId.toString())
    })
  })
}

/**
 *  This searchs in col for a document identified by id
 *  and returns it
 * @param col {String} colletion name
 * @param id {String} document id
 * @param cb {function} (err, result) callback function
 */
function findById (col, id, cb) {
  MongoClient.connect(url, mongoOptions, (err, client) => {
    if (err) return cb(err)
    client.db(dbName).collection(col).findOne({_id: ObjectID(id)}, (err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(null, result)
    })
  })
}

/**
 *
 * @param col {String} collection name
 * @param ids {Array} id's
 * @param cb {function} (err, result)
 */
function findByIds (col, ids, cb) {
  ids = ids.map(id => ObjectID(id))
  findByQuery(col, {_id: {$in: ids}}, cb)
}

/**
 *
 * @param col {String} collection name
 * @param id {String} document id
 * @param newValues {Object} data to update
 * @param cb {function}
 */
function updateById (col, id, newValues, cb) {
  MongoClient.connect(url, mongoOptions, (err, client) => {
    if (err) return cb(err)
    let query = {_id: ObjectID(id)}
    let set = { $set: newValues }
    client.db(dbName).collection(col).updateOne(query, set, (err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(null, result)
    })
  })
}

/**
 *
 * @param col {String} collection id
 * @param query {Object} query to filter
 * @param cb {function}
 */
function findByQuery (col, query, cb) {
  MongoClient.connect(url, mongoOptions,(err, client) => {
    if (err) return cb(err)
    client.db(dbName).collection(col).find(query).toArray((err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(null, result)
    })
  })
}

function deleteById (col, id, cb) {
  MongoClient.connect(url, mongoOptions, (err, client) => {
    if (err) return cb(err)
    let query = {_id: ObjectID(id)}
    client.db(dbName).collection(col).deleteOne(query, (err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(null, result)
    })
  })
}

function deleteByIds (col, ids, cb) {
  MongoClient.connect(url, mongoOptions, (err, client) => {
    if (err) return cb(err)
    ids = ids.map(id => ObjectID(id))
    let query = {_id: {$in: ids}}
    client.db(dbName).collection(col).remove(query, (err, result) => {
      client.close()
      if (err) return cb(err)
      return cb(null, result)
    })
  })
}
