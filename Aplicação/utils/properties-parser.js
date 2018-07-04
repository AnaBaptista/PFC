module.exports = {
  parseDataProperties,
  parseObjectProperties,
  parseAnnotationProperties,
  parseName
}

const async = require('async')
const db = require('../data-access/mongodb-access')
const idGen = require('shortid')

function parseName (listOfNodes, indMapNode, dataFileId, cb) {
  getNodesFromFile(dataFileId, (err, nodes) => {
    if (err) return cb(err)
    parser(listOfNodes, indMapNode, nodes, cb)
  })
}

function parseObjectProperties (listOfProps, indMapNode, dataFileId, cb) {
  let objProps = []
  getNodesFromFile(dataFileId, (err, nodes) => {
    if (err) return cb(err)
    async.each(listOfProps,
      (listEntry, callback) => {
        parser(listEntry.toMapNodeId, indMapNode, nodes,
          (err, parsedProp) => {
            let obj = { id: idGen.generate()}
            if (err) return callback(err)
            obj[listEntry.owlClassIRI] = parsedProp
            objProps.push(obj)
            callback()
          })
      },
      (err) => {
        if (err) return cb(err)
        return cb(null, objProps)
      })
  })
}

const dataType = ['Integer', 'Boolean', 'Float', 'Double', 'String']
function parseDataProperties (listOfProps, indMapNode, dataFileId, cb) {
  let dataProps = []
  getNodesFromFile(dataFileId, (err, nodes) => {
    if (err) return cb(err)
    async.each(listOfProps,
      (listEntry, callback) => {
        if (!dataType.includes(listEntry.type)) {
          return cb(new Error(`Type from entry ${listEntry.type} does not match one of the allowed types: 'Integer', 'Boolean', 'Float', 'Double', 'String'`))
        }
        parser(listEntry.toMapNodeId, indMapNode, nodes,
          (err, parsedProp) => {
            let obj = { id: idGen.generate()}
            if (err) return callback(err)
            obj[listEntry.owlClassIRI] = [parsedProp, listEntry.type]
            dataProps.push(obj)
            callback()
          })
      },
      (err) => {
        if (err) return cb(err)
        return cb(null, dataProps)
      })
  })
}

const labelType = ['label', 'comment', 'seeAlso', 'isDefinedBy', 'versionInfo ', 'backwardCompatibleWith', 'incompatibleWith']
function parseAnnotationProperties (listOfProps, indMapNode, dataFileId, cb) {
  let annProps = []
  getNodesFromFile(dataFileId, (err, nodes) => {
    async.each(listOfProps,
      (listEntry, callback) => {
        if (!(labelType.includes(listEntry.annotation))) {
          return cb(new Error(`Type from entry ${listEntry.annotation} does not match one of the allowed types: 'Integer', 'Boolean', 'Float', 'Double', 'String'`))
        }
        parser(listEntry.toMapNodeId, indMapNode, nodes,
          (err, parsedProp) => {
            let obj = { id: idGen.generate()}
            if (err) return callback(err)
            obj[listEntry.annotation] = parsedProp
            annProps.push(obj)
            callback()
          })
      },
      (err) => {
        if (err) return cb(err)
        return cb(null, annProps)
      })
  })
}

function parser (listOfNodes, indMapNode, nodes, parseCb) {
  // creates an empty strings array to store the search results of individual names
  let results = Array(listOfNodes.length).fill('')
  async.eachOf(listOfNodes,
    (toMapNodeID, index, callback) => {
      parserAux(toMapNodeID, indMapNode, results, index, nodes, callback)
    },
    (err) => {
      if (err) return parseCb(err)
      let toRet = ''
      results.forEach(string => { toRet = `${toRet}.inspecificchild${string};` })
      toRet = toRet.slice(0, -1)
      parseCb(null, toRet)
    })
}

function parserAux (toMapId, indMapId, results, index, nodes, callback) {
  getNodeById(toMapId, nodes, (err, node) => {
    if (err) { return callback(err) }
    results[index] = `-${node.tag}${results[index]}`
    if (node.parent === undefined) {
      return callback(
        new Error('Failed to parse property or name, please choose another node to parse, make sure it is a child node from the node selected for individual mapping'))
    }
    if (node.parent !== indMapId) parserAux(node.parent, indMapId, results, index, nodes, callback)
    else callback()
  })
}

function getNodeById (nodeId, nodes, cb) {
  let res = nodes.find(node => node._id === nodeId)
  if (!res) {
    return cb(new Error('Node not found'))
  }
  cb(null, res)
}

function getNodesFromFile (id, cb) {
  db.findByQuery('DataFiles', {'chaosid': id}, (err, files) => {
    if (err) return cb(err)
    cb(null, files[0].nodes)
  })
}
