module.exports = {
  sendIndividualMappingToChaos,
  updateIndividualMapping,
  deleteIndividualMapping
}

// Basic HTTP request
const req = require('request')
const handleResponse = require('../utils/handle-response')

// ChaosPop requests
 // const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
const api = 'http://localhost:8080/chaos/wsapi'
const individualMappingManager = `${api}/individualMappingManager`

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
 *
 * @param id
 * @param newIndividual
 * @param cb
 */
function updateIndividualMapping (newIndividual, cb) {
  let url = `${individualMappingManager}/replaceIndividualMapping`
  let options = {
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newIndividual)
  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    return cb(null, res)
  })
}

function deleteIndividualMapping (id, cb) {
  let url = `${individualMappingManager}/removeIndividualMapping`
  let options = {
    url: url,
    form: {
      ids: JSON.stringify(id)
    }
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}
