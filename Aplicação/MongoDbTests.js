var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017'
const ObjectID = require('mongodb').ObjectID

/**
 * insert a document in MongoDb

MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err)
  let db = client.db('HomiDb')
  let collection = db.collection('HomiCollection')
  collection.insert({teste: 'teste 1'})
  client.close()
})

/**
 * get a document in MongoDb 'ObjectID(5afdbff24506ee1f084a25f1)'
*/
MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err)
  let db = client.db('HomiDb')
  let collection = db.collection('HomiCollection')
  collection.find((err, result) => {
    console.log(result)
  })
  client.close()
})

/**
 * update a document in MongoDb 'ObjectID(5afdbff24506ee1f084a25f1)'

MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err)
  let db = client.db('HomiDb')
  let collection = db.collection('HomiCollection')
  let query = {_id: ObjectID('5afdbff24506ee1f084a25f1')}
  let newValues = { $set: {teste: 'teste 0.0', update: 'added new field'}}
  collection.updateOne(query, newValues, (err, result) => {
    console.log(result)
  })
  client.close()
})
*/