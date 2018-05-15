module.exports = {
  createIndividualMapping,
  getAllIndividualMappings,
  getIndividualMapping,
  updateIndividualMapping
}

const req = require('request')

//const api = 'http://chaospop.sysresearch.org/chaos/wsapi'
const api = 'http://localhost:8080/chaos/wsapi'
const individualMappingManager = `${api}/individualMappingManager`
const mappingManager = `${api}/mappingManager`
const IndividualMappingTO = require('../model/IndividualMapping')

/**
 * @param {string} id
 * @param tag
 * @param IRI
 * @param fileIds
 * @param {function} cb(err, result)
 */
function createIndividualMapping (tag, IRI, fileIds,cb) {
  let url = `${individualMappingManager}/createIndividualMapping`
  let indMap = {
    "_id" : "5afadcc560b5dc9bf310255a",
    "tag" : "member",
    "individualName" : ".inspecificchild-name-given;.inspecificchild-name-surname",
    "owlClassIRI" : "http://sysresearch«org/ontologies/family#Person",
    "specification" : false,
    "annotationProperties" : {
      "label" : ".inspecificchild-name-nickname"
    },
    "objectProperties" : {
      "http://sysresearch«org/ontologies/family«owl#hasBrother" : ".inspecificchild-siblings-brother",
      "http://sysresearch«org/ontologies/family«owl#hasSister" : ".inspecificchild-siblings-sister",
      "http://sysresearch«org/ontologies/family«owl#hasChild" : ".inspecificchild-descendants-daughter",
      "http://sysresearch«org/ontologies/family«owl#hasPartner" : ".inspecificchild-marriage-partner_name",
      "http://sysresearch«org/ontologies/family«owl#hasParent" : ".inspecificchild-ancestors-mother"
    },
    "dataProperties" : {
      "http://sysresearch«org/ontologies/family«owl#hasDeathYear" : {
        "dataProperty" : ".inspecificchild-marriage-marriage_year",
        "dpDataType" : "Integer"
      },
      "http://sysresearch«org/ontologies/family«owl#hasFirstGivenName" : {
        "dataProperty" : ".inspecificchild-name-given",
        "dpDataType" : "String"
      },
      "http://sysresearch«org/ontologies/family«owl#alsoKnownAs" : {
        "dataProperty" : ".inspecificchild-name-nickname",
        "dpDataType" : "String"
      },
      "http://sysresearch«org/ontologies/family«owl#hasFamilyName" : {
        "dataProperty" : ".inspecificchild-name-surname",
        "dpDataType" : "String"
      },
      "http://sysresearch«org/ontologies/family«owl#hasBirthYear" : {
        "dataProperty" : ".inspecificchild-death_year",
        "dpDataType" : "Integer"
      }
    }
  }

  let options = {
    url: url,
    headers:{
      'Content-Type' : 'application/json'
    },
    body : indMap

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
