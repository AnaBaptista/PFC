module.exports = {
  createBatch,
  processBatch
}

const req = require('request')
const handleResponse = require('../utils/handle-response')

// ChaosPop requests
 const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
//const api = 'http://localhost:8080/chaos/wsapi'
const populateManager = `${api}/populationManager`
const batchManager = `${api}/batchManager`

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