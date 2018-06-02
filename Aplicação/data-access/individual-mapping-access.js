module.exports = {
  createIndividualMapping,
  sendIndividualMappingToChaos,
  getAllIndividualMappings,
  getIndividualMapping,
  updateIndividualMapping,
  removeIndividualMapping
}

// Basic HTTP request
const req = require('request')
const handleResponse = require('../utils/handle-response')

// ChaosPop requests
// const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
 const api = 'http://localhost:8080/chaos/wsapi'
const individualMappingManager = `${api}/individualMappingManager`
// const mappingManager = `${api}/mappingManager`


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
  //TODO: add individual to chaos pop
}
