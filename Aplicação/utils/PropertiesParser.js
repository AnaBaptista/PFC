module.exports = {
  parseDataProperties,
  parseObjectProperties,
  parseAnnotationProperties,
  parseName
}
const service = require('../services/file-service')
const nodeAccess = require('../data-access/node-access')

function parseName (input, cb) {
  let name = '.inspecificchild'
  let i
  for (i = 0; i < input.individualName.length; i++) {
    name = parserAux(name, input.individualName[i], input.nodeId, cb)
    name = `${name};`
  }
  cb(null, name)
}

function parserAux (name, toMapId, parentId, cb) {
  getNodeById(toMapId, (err, result) => {
    if (err) return cb(err)
    name = `${name}-${result.tag}`
    if (result.parent === parentId) return name
    parserAux(name, result.parent, parentId, cb)
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
