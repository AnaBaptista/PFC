var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017'
const ObjectID = require('mongodb').ObjectID

// // insert a document in MongoDb
//
// MongoClient.connect(url, (err, client) => {
//   if (err) return console.log(err)
//   let db = client.db('HomiDb')
//   let collection = db.collection('HomiCollection')
//   collection.insert({teste: 'teste 1'})
//   client.close()
// })
//
// /**
//  * get a document in MongoDb 'ObjectID(5afdbff24506ee1f084a25f1)'
// */
// MongoClient.connect(url, (err, client) => {
//   if (err) return console.log(err)
//   let db = client.db('HomiDb')
//   let collection = db.collection('testes')
//   collection.find((err, result) => {
//     console.log(result)
//   })
//   client.close()
// })
//
// // update a document in MongoDb 'ObjectID(5afdbff24506ee1f084a25f1)'
//
// MongoClient.connect(url, (err, client) => {
//   if (err) return console.log(err)
//   let db = client.db('HomiDb')
//   let collection = db.collection('HomiCollection')
//   let query = {_id: ObjectID('5afdbff24506ee1f084a25f1')}
//   let newValues = { $set: {teste: 'teste 0.0', update: 'added new field'}}
//   collection.updateOne(query, newValues, (err, result) => {
//     console.log(result)
//   })
//   client.close()
// })

MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err)
  let db = client.db('HomiDb')
  let collection = db.collection('DataFiles')
  let query = {
    nodes: {
      $elemMatch: {tag: 'XML'}
    }
  }
  collection.find(query).toArray((err, res) => {
    console.log(res)
    client.close()
  })

  // collection.findOne({_id: ObjectID('5b38eae4f09ed32244dba080')}, query).toArray((err, res => {
  //   console.log(res)
  //   client.close()
  // }))
})
