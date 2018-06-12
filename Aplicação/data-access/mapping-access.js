module.exports = {
  createMapping
}

const req = require('request')
const handleResponse = require('../utils/handle-response')

// ChaosPop requests
 const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
//const api = 'http://localhost:8080/chaos/wsapi'
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
