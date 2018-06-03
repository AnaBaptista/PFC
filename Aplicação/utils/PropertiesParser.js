module.exports = {
  parseDataProperties,
  parseObjectProperties,
  parseAnnotationProperties,
  parseName
}
// const service = require('../services/file-service')
const async = require('async')
const nodeAccess = require('../data-access/node-access')
const idGen = require('shortid')

function parseName (listOfNodes, indMapNode, cb) {
  parser(listOfNodes, indMapNode, cb)
}

function parseObjectProperties (listOfProps, indMapNode, objProps, cb) {
  if (objProps === undefined) objProps = []
  async.each(listOfProps,
    (listEntry, callback) => {
      parser(listEntry.toMapNodeId, indMapNode,
        (err, parsedProp) => {
          let obj = { id: idGen.generate()}
          if (err) return callback(err)
          obj[listEntry.owlIRI] = parsedProp
          objProps.push(obj)
          callback()
        })
    },
    (err) => {
      if (err) return cb(err)
      return cb(null, objProps)
    })
}

const dataType = ['Integer', 'Boolean', 'Float', 'Double', 'String']
function parseDataProperties (listOfProps, indMapNode, dataProps, cb) {
  if (dataProps === undefined) dataProps = []
  async.each(listOfProps,
    (listEntry, callback) => {
      if (!(dataType.includes(listEntry.type))) { return cb(new Error(`Type from entry ${listEntry.type} does not match one of the allowed types: 'Integer', 'Boolean', 'Float', 'Double', 'String'`)) }
      parser(listEntry.toMapNodeId, indMapNode,
        (err, parsedProp) => {
          let obj = { id: idGen.generate()}
          if (err) return callback(err)
          obj[listEntry.owlIRI] = [parsedProp, listEntry.type]
          dataProps.push(obj)
          callback()
        })
    },
    (err) => {
      if (err) return cb(err)
      return cb(null, dataProps)
    })
}

const labelType = ['label', 'comment', 'seeAlso', 'isDefinedBy', 'versionInfo ', 'backwardCompatibleWith', 'incompatibleWith']
function parseAnnotationProperties (listOfProps, indMapNode, annProps, cb) {
  if (annProps === undefined) annProps = []
  async.each(listOfProps,
    (listEntry, callback) => {
      if (!(labelType.includes(listEntry.annotation))) {
        return cb(new Error(`Type from entry ${listEntry.annotation} does not match one of the allowed types: 'Integer', 'Boolean', 'Float', 'Double', 'String'`))
      }
      parser(listEntry.toMapNodeId, indMapNode,
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
}

function parser (listOfNodes, indMapNode, parseCb) {
  // creates an empty strings array to store the search results of individual names
  let results = Array(listOfNodes.length).fill('')

  async.eachOf(listOfNodes,
    (toMapNodeID, index, callback) => {
      parserAux(toMapNodeID, indMapNode, results, index, callback)
    },
    (err) => {
      if (err) return parseCb(err)
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
      return callback(
        new Error('Failed to parse property or name, please choose another node to parse, make sure it is a child node from the node selected for individual mapping'))
    }
    if (node.parent !== indMapId) parserAux(node.parent, indMapId, results, index, callback)
    else callback()
  })
}

function getNodeById (nodeId, cb) {
  nodeAccess.getNodeById(nodeId, (err, result) => {
    if (err) return cb(err)
    return cb(null, JSON.parse(result))
  })
}
