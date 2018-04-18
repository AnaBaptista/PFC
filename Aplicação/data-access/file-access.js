module.exports = {
  addFile,
  getDataFiles,
  getDataFileNodes,
  getOntologyFiles,
  getOntologyFileClasses
}

const req = require('request')
const fs = require('fs')

const api = 'http://localhost:8080/chaos/wsapi'
const dataFile = `${api}/fileManager`
const ontologyFile = `${api}/ontologyManager`
const nodeManager = `${api}/nodeManager`

/**
 * @param {string} path
 * @param {function} cb
 */
function addFile (path, cb) {
  let url = `${dataFile}/addFile`
  let options = {
    url: url,
    formData: {
      file: fs.createReadStream(path)
    }
  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    cb()
  })
}

/**
 * @param {function} cb
 */
function getDataFiles (cb) {
  let url = `${dataFile}/listDataFiles`
  req(url, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.body.toString())
    cb(null, obj)
  })
}

function getDataFileNodes (id, cb) {
  // let url = `${nodeManager}/${id}/getAllNodesFromDataFile`
  let url = `${nodeManager}/getAllNodesFromDataFile`
  let options = {
    url: url,
    form: {
      id: id
    }
  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.body.toString())
    cb(null, obj)
  })
}

function getOntologyFiles (cb) {
  let url = `${ontologyFile}/listOntologyFiles`
  req(url, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.body.toString())
    cb(null, obj)
  })
}

function getOntologyFileClasses (id, cb) {
  let url = `${ontologyFile}/getOWLClasses`
  let options = {
    url: url,
    form: {
      ontologyId: id
    }
  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.body.toString())
    cb(null, obj)
  })
}
