module.exports = {
  createBatch,
  processBatch,
  deleteBatch
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
const populateManager = `${api}/populationManager`
const batchManager = `${api}/batchManager`

/**
 * This function creates a batch
 * @param data {Object} batch object to send to Chaos Pop
 * @param cb {Function} callback function
 */
function createBatch (data, cb) {
  let url = `${batchManager}/createBatch`

  let options = {
    url: url,
    body: JSON.stringify(data)
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * This function process a batch to generate output file
 * @param batchId {String} batch id
 * @param cb {Function} callback function
 */
function processBatch (batchId, cb) {
  let url = `${populateManager}/processBatch`

  let options = {
    url: url,
    form: {
      id: batchId
    }
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * This function delete a batch identified by batchId
 * @param batchId {String} batch id
 * @param cb {Function} callback function
 */
function deleteBatch (batchId, cb) {
  let url = `${batchManager}/removeBatch`
  let options = {
    url: url,
    body: JSON.stringify([batchId])
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}