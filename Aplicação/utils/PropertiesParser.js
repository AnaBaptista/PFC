module.exports = {
  parseDataProperties,
  parseObjectProperties,
  parseAnnotationProperties
}
const service = require('../services/file-service')

const dataType = ['Integer', 'Boolean', 'Float', 'Double', 'String']
function parseDataProperties (listOfProps) {}

function parseObjectProperties (dataFileId, listOfProps, cb) {
  getNodeTree(dataFileId, (err, tree) => {
    if (err) return cb(err)

  })
}

const labelType = ['label', 'comment', 'seeAlso', 'isDefinedBy', 'versionInfo ', 'backwardCompatibleWith', 'incompatibleWith']
function parseAnnotationProperties (listOfProps) { }

function getNodeTree (datafileId, cb) {
  service.getDataFileNodes(datafileId, (err,tree) => {
    if (err) return cb(err)
    return cb(null,JSON.parse(tree))
  })
}

function searchNode (nodeId, tree) {
  // for(NodesTO node : tree){
  //   if(node)
  // }
}

parseObjectProperties(['5af093d445193e040736e20f'], null, () => {})
