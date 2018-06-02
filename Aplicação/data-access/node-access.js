module.exports = {
  getNodeById
}

const req = require('request')
const handleResponse = require('../utils/handle-response')

const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
//const api = 'http://localhost:8080/chaos/wsapi'
const nodeManager = `${api}/nodeManager`

function getNodeById (id, cb) {
  let url = `${nodeManager}/getNode`
  let options = {
    url: url,
    form: {
      id: id
    }
  }
  req.post(options, (err, node) => {
    if (err) return cb(err)
    handleResponse(node, cb)
  })
}
