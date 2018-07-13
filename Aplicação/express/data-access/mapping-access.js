module.exports = {
  createMapping,
  deleteMapping,
  getMapping
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
const mappingManager = `${api}/mappingManager`

/**
 * This function creates a mapping on Chaos Pop
 * @param mapping {Object} mapping
 * @param cb {Function} callback
 */
function createMapping (mapping, cb) {
  let url = `${mappingManager}/createMapping`

  let options = {
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mapping)
  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * This function deletes a mapping
 * @param id {String} mapping id
 * @param cb {Function} callback function
 */
function deleteMapping (id, cb) {
  let url = `${mappingManager}/removeMapping`

  let options = {
    url: url,
    form: {
      ids: JSON.stringify([id])
    }
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * This function returns a mapping
 * @param id {String} mapping id
 * @param cb {Function} callback function
 */
function getMapping (id, cb) {
  let url = `${mappingManager}/getMapping`

  let options = {
    url: url,
    form: {
      id: id
    }
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}
