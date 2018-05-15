module.exports = {
  addFile,
  getDataFiles,
  getDataFileNodes,
  getOntologyFiles,
  getOntologyFileClasses,
  getOntologyFileObjectProperties,
  getOntologyFileDataProperties
}

const req = require('request')
const fs = require('fs')
const async = require('async')

const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
// const api = 'http://localhost:8080/chaos/wsapi'
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

function getOntologyFileClasses (ids, cb) {
  let url = `${ontologyFile}/getOWLClasses`

  async.map(ids, (ont, cbReq) => {
    let options = {
      url: url,
      form: {
        ontologyId: ont.id
      }
    }
    req.post(options, (err, res) => {
      if (err) return cb(err)
      let obj = JSON.parse(res.body.toString())
      cbReq(null, obj)
    })
  }, (err, res) => {
    if (err) return cb(err)
    let classes = []
    res.forEach(arr => { classes = classes.concat(arr) })
    cb(null, classes)
  })
}

function getOntologyFileObjectProperties (id, cb) {
  let url = `${ontologyFile}/getObjectProperties`
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

function getOntologyFileDataProperties (id, cb) {
  let url = `${ontologyFile}/getDataProperties`
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
