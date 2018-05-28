module.exports = {
  parseDataProperties,
  parseObjectProperties,
  parseAnnotationProperties,
  parseName
}
// const service = require('../services/file-service')
const async = require('async')
const nodeAccess = require('../data-access/node-access')

function parseName (input, cb) {
  let name = '.inspecificchild'
  async.each(input.individualName,
    (toMapNodeID, cb) => {
      name = parserAux(name, toMapNodeID, input.nodeId, cb)
      name = `${name};`
    },
    (err, name) => {
      if (err) { cb(err) }
      cb(null, name)
    })
}

function parserAux (name, toMapId, indMapId, cb) {
  getNodeById(toMapId, (err, result) => {
    if (err) { return cb(err) }
	  if (result.parent === indMapId) return name
    name = `${name}-${result.tag}`
    parserAux(name, result.parent, indMapId, cb)
  })
}

const dataType = ['Integer', 'Boolean', 'Float', 'Double', 'String']
function parseDataProperties (listOfProps, cb) {}

function parseObjectProperties (dataFileId, listOfProps, cb) {}

const labelType = ['label', 'comment', 'seeAlso', 'isDefinedBy', 'versionInfo ', 'backwardCompatibleWith', 'incompatibleWith']
function parseAnnotationProperties (listOfProps) { }

function getNodeById (nodeId, cb) {
  nodeAccess.getNodeById(nodeId, (err, result) => {
    if (err) return cb(err)
    return cb(null, JSON.parse(result))
  })
}

function searchNode (nodeId, tree) {
  // for(NodesTO node : tree){
  //   if(node)
  // }
}

// parseObjectProperties(['5af093d445193e040736e20f'], null, () => {})
