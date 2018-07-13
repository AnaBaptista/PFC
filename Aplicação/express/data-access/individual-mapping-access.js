module.exports = {
  sendIndividualMappingToChaos,
  updateIndividualMapping,
  deleteIndividualMapping
}

/**
 * Basic HTTP request
 */
const req = require('request')
const handleResponse = require('../utils/handle-response')

/**
 * Chaos Pop server uri's
 */
const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
const individualMappingManager = `${api}/individualMappingManager`

/**
 * This functions save an individual mapping on Chaos Pop
 * @param individualMapping {Object} individual mapping
 * @param cb {Function} callback function
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
 * This function updates an individual mapping
 * @param newIndividual {Object} individual mapping to update
 * @param cb {Function} callback function
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
    handleResponse(res, cb)
  })
}

/**
 * This function deletes an individual mapping
 * @param id {String} individual mapping id
 * @param cb {Function} callback function
 */
function deleteIndividualMapping (id, cb) {
  let url = `${individualMappingManager}/removeIndividualMapping`
  let options = {
    url: url,
    body: JSON.stringify(id)
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}
