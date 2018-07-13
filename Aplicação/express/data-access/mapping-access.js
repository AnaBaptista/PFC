module.exports = {
  createMapping,
  deleteMapping,
  getMapping
}

const req = require('request')
const handleResponse = require('../utils/handle-response')

// ChaosPop requests
const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
const mappingManager = `${api}/mappingManager`

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
