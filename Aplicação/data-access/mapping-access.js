module.exports = {
  createEmptyIndividualMapping,
  getAllIndividualMappings,
  getIndividualMapping,
  updateIndividualMapping
}

const req = require('request')

const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
// const api = 'http://localhost:8080/chaos/wsapi'
const individualMappingManager = `${api}/individualMappingManager`
const mappingManager = `${api}/mappingManager`

/**
 * @param {string} id
 * @param {function} cb(err, result)
 */
function createEmptyIndividualMapping (id, cb) {
  let url = `${individualMappingManager}/createIndividualMapping`
  let options = {
    url: url,
    individualMappingTO : {
      dataFileIds :[ ] ,
      tag : id ,
      individualName : '' ,
      individualLabel : '',
      owlClassIRI : '',
      specification : false ,
      objectProperties : [ ],
      dataProperties : [ ]
    }
  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    return cb(null,res)
  })
}

/**
 * @param {function} cb(err, result)
 */
function getAllIndividualMappings (cb) {
  let url = `${individualMappingManager}/getAllIndividualMappings`
  req(url, (err, res) => {
    if (err) return cb(err)
    let obj = JSON.parse(res.body.toString())
    cb(null, obj)
  })
}

/**
 * @todo, Nao exite um get IndividualMapping no chaos pop
 */
function getIndividualMapping (id, cb) {
  let url = `${individualMappingManager}/getAllIndividualMappings`
}

/**
 *
 * @param id
 * @param newIndividual
 * @param cb
 */
function updateIndividualMapping(id, newIndividual, cb) {
  let url = `${individualMappingManager}/replaceIndividualMappings`
  let options = {
    url: url,
    individualMappingTO : newIndividual
  }
  req.post(options, (err, res) => {
    if (err) return cb(err)
    return cb(null,res)
  })
}
