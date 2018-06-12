module.exports = makeFakeFile

const XMLWriter = require('xml-writer')
const idGen = require('shortid')
const fs = require('fs')

function makeFakeFile (listOfIndMaps, cb) {
  // fs.createReadStream(path)

  let xml = new XMLWriter(true)
  xml.startDocument()
  xml.startElement('XML')
  let i
  for (i = 0; i < listOfIndMaps.length; i++) { processIndMap(i, listOfIndMaps[i], xml) }
  xml.endDocument()
  let filename = idGen.generate()
  let path = `../utils/${filename}.xml`
  fs.writeFile(path, xml.toString(), (err) => {
    if (err) return cb(err)
    return cb(null, path)
  })
}

function processIndMap (i, indMap, xml) {
  xml.writeElement(`individualName${i}`, indMap.individualName)
  if (indMap.dataProperties !== undefined) { indMap.dataProperties.forEach(prop => xml.writeElement(prop.id, prop.value)) }
  if (indMap.objectProperties !== undefined) { indMap.objectProperties.forEach(prop => xml.writeElement(prop.id, prop.value)) }
  if (indMap.annotationProperties !== undefined) { indMap.annotationProperties.forEach(prop => xml.writeElement(prop.id, prop.value)) }
}
