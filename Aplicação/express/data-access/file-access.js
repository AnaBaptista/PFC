module.exports = {
  addFile,
  getDataFiles,
  getDataFileNodes,
  getOntologyFiles,
  getOntologyFileClasses,
  getOntologyFileObjectProperties,
  getOntologyFileDataProperties,
  deleteDataFile,
  deleteOntologyFile,
  uploadFile
}
/**
 * Basic HTTP request
 */
const req = require('request')
const fs = require('fs')
const handleResponse = require('../utils/handle-response')

/**
 * Chaos Pop server uri's
 */
const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
const dataFile = `${api}/fileManager`
const ontologyFile = `${api}/ontologyManager`
const nodeManager = `${api}/nodeManager`

/**
 * All functions of this script make a request to Chaos Pop server
 */

/** This functions adds a new file to Chaos Pop
 * @param {String} path to file
 * @param {Function} callback function
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
    handleResponse(res, cb)
  })
}

/**
 * This function gets all data files
 * @param {Function} callback function
 */
function getDataFiles (cb) {
  let url = `${dataFile}/listDataFiles`
  req(url, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * This function gets all nodes from specified DataFile
 * @param id {String} data file id
 * @param cb {Function} callback function
 */
function getDataFileNodes (id, cb) {
  let url = `${nodeManager}/getAllNodesFromDataFile`
  let options = {
    url: url,
    form: {
      id: id
    }
  }
  req.post(options, (err, nodes) => {
    if (err) return cb(err)
    handleResponse(nodes, cb)
  })
}

/**
 * Returns all ontology files
 * @param cb {Function} callback function
 */
function getOntologyFiles (cb) {
  let url = `${ontologyFile}/listOntologyFiles`
  req(url, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * This function gets all ontology classes from OntologyFile identified by id
 * @param id {String} ontology file id
 * @param cb {Function} callback function
 */
function getOntologyFileClasses (id, cb) {
  let url = `${ontologyFile}/getOWLClasses`

  let options = {
    url: url,
    form: {
      ontologyId: id
    }
  }
  req.post(options, (err, classes) => {
    if (err) return cb(err)
    handleResponse(classes, cb)
  })
}

/**
 * This function gets all object properties from OntologyFile identified by id
 * @param id {String} ontology file id
 * @param cb {Function} callback function
 */
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
    handleResponse(res, cb)
  })
}

/**
 * This function gets all data properties from OntologyFile identified by id
 * @param id {String} ontology file id
 * @param cb {Function} callback function
 */
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
    handleResponse(res, cb)
  })
}

/**
 * This function deletes the DataFile identified by id
 * @param id {String} data file id
 * @param cb {Function} callback function
 */
function deleteDataFile (id, cb) {
  let url = `${dataFile}/removeFile`

  let options = {
    url: url,
    body: JSON.stringify([id])
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * This function deletes the OntologyFile identified by id
 * @param id {String} ontology file id
 * @param cb {Function} callback function
 */
function deleteOntologyFile (id, cb) {
  let url = `${ontologyFile}/removeOntologyFiles`

  let options = {
    url: url,
    body: JSON.stringify([id])
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}

/**
 * This function uploads the OntologyFile identified by id to Chaos Pop server
 * @param id {String} ontology file id
 * @param cb {Function} callback function
 */
function uploadFile (id, cb) {
  let url = `${dataFile}/uploadFileSFTP`

  let options = {
    url: url,
    form: {
      ontologyFileId: id
    }
  }

  req.post(options, (err, res) => {
    if (err) return cb(err)
    handleResponse(res, cb)
  })
}
