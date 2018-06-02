module.exports = {
  parseDataProperties,
  parseObjectProperties,
  parseAnnotationProperties,
  parseName
}
// const service = require('../services/file-service')
const async = require('async')
const nodeAccess = require('../data-access/node-access')

function parseName (listOfNodes, indMapNode, cb) {
  parser(listOfNodes, indMapNode, cb)
}

function parser (listOfNodes, indMapNode, parseCb) {
  // creates an empty strings array to store the search results of individual names
  let results = Array(listOfNodes.length).fill('')

  async.eachOf(listOfNodes,
    (toMapNodeID, index, callback) => {
      parserAux(toMapNodeID, indMapNode, results, index, callback)
    },
    (err) => {
      if (err) parseCb(err)
      let toRet = ''
      results.forEach(string => { toRet = `${toRet}.inspecificchild${string};` })
      toRet = toRet.slice(0, -1)
      parseCb(null, toRet)
    })
}

function parserAux (toMapId, indMapId, results, index, callback) {
  getNodeById(toMapId, (err, node) => {
    if (err) { return callback(err) }

    results[index] = `-${node.tag}${results[index]}`
    if (node.parent === undefined) {
      callback(
        new Error('Failed to parse property or name, please choose another node to parse, make sure it is a child node from the node selected for individual mapping'))
    }
    if (node.parent !== indMapId) parserAux(node.parent, indMapId, results, index, callback)
    else callback()
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

// parseObjectProperties(['5af093d445193e040736e20f'], null, () => {})
