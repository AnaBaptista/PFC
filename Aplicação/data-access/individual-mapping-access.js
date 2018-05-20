module.exports = {
  createIndividualMapping,
  sendIndividualMappingToChaos,
  getAllIndividualMappings,
  getIndividualMapping,
  updateIndividualMapping,
  removeIndividualMapping
}

/*
 * Basic HTTP request
 */
const req = require('request')
const handleResponse = require('../utils/handle-response')

/*
 * ChaosPop requests
 */
// const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
const api = 'http://localhost:8080/chaos/wsapi'
const individualMappingManager = `${api}/individualMappingManager`
// const mappingManager = `${api}/mappingManager`

/*
 * MongoDb Requests
 */
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'HomiDb'
const indMapCollectionName = 'IndividualMappings'
const ObjectID = require('mongodb').ObjectID

/**
 * @param {string} id
 * @param tag
 * @param IRI
 * @param fileIds
 * @param {function} cb(err, result)
 */
function sendIndividualMappingToChaos (individualMapping, cb) {
  let url = `${individualMappingManager}/createIndividualMapping`

  let options = {
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(individualMapping)

  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * @param {function} cb(err, result)
 */

function getAllIndividualMappings (cb) {
  let url = `${individualMappingManager}/getAllIndividualMappings`
  req(url, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

function getIndividualMapping (id, cb) {
  let url = `${individualMappingManager}/getIndividualMappings`
}

/**
 *
 * @param id
 * @param newIndividual
 * @param cb
 */
function updateIndividualMapping (id, newIndividual, cb) {
  let url = `${individualMappingManager}/replaceIndividualMappings`
  let options = {
    url: url,
    individualMappingTO: newIndividual
  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    return cb(null, res)
  })
}

function removeIndividualMapping (id, cb) {
  let url = `${individualMappingManager}/removeIndividualMapping`
  let options = {
    url: url,
    form: {
      ids: id
    }
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    return cb(null, res)
  })
}

function createIndividualMapping (indMap, cb) {
  sendDocToDb(indMap, cb)
}

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
      return cb(null, result.insertedId)
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
      if (err) return cb(err)
      handleResponse(err, cb)
    })
    client.close()
  })
}
