module.exports = {
  makeFakeFile,
  parseIndividualToIndMap
}

const XMLWriter = require('xml-writer')
const idGen = require('shortid')
const fs = require('fs')
const path = require('path')

function makeFakeFile (listOfIndividuals, cb) {

  let xml = new XMLWriter(true)
  xml.startDocument()
  xml.startElement('XML')
  xml.startElement('root')
  listOfIndividuals.forEach(individual => processIndividual(individual, xml))
  xml.endElement()
  xml.endDocument()
  let filename = idGen.generate()
  let dir = path.join(__dirname, `../tempFiles/${filename}.xml`)
  fs.writeFile(dir, xml.toString(), (err) => {
    if (err) return cb(err)
    return cb(null, filename, dir)
  })
}

function processIndividual (individual, xml) {
  xml.startElement(`_${individual._id.toString()}`)
  xml.writeElement('individualName', individual.originalIndividualName)
  if (individual.dataPropsOriginal !== undefined) {
    individual.dataPropsOriginal.forEach(
      prop =>
        xml.writeElement(`${prop.id}`, prop.value))
  }
  if (individual.objectPropsOriginal !== undefined) { individual.objectPropsOriginal.forEach(
    prop =>
      xml.writeElement(`${prop.id}`, prop.value.name)) }
  if (individual.annotationPropsOriginal !== undefined) { individual.annotationPropsOriginal.forEach(
    prop =>
      xml.writeElement(`${prop.id}`, prop.value)) }
  xml.endElement()
}
/* /PRODUCES:
<XML>
  <5b1fef788b45ea1c34a34db2>                     // individual mapping id created my mongo db in our db
    <individualName>teste1206</individualName>   // individual name + relative position in populate array and its value
    <BJs5JO6gX>testeFamilyName</BJs5JO6gX>       // A data property. Id generated by short id + its value
    <rJXXeualX>testeLabel</rJXXeualX>            // A annotation property. Id generated by short id + it's value
  </5b1fef788b45ea1c34a34db2>
</XML> */

function parseIndividualToIndMap (individual, dataFileId, node) {
  individual.tag = `_${individual._id.toString()}`
  let base = `.inspecificchild-`
  individual.individualName = `${base}individualName`
  individual.dataFileId = dataFileId
  individual.nodeId = node[0]._id.toString()
  individual.specification = false
  if (individual.dataPropsOriginal !== undefined) {
    individual.dataProperties = []
    individual.dataPropsOriginal.forEach(prop => {
      let newProp = {
        id: prop.id,
        [prop.owlClassIRI]: [`${base}${prop.id}`, prop.type]
      }
      individual.dataProperties.push(newProp)
    })
  }
  if (individual.objectPropsOriginal !== undefined) {
    individual.objectProperties = []
    individual.objectPropsOriginal.forEach(prop => {
      let newProp = {
        id: prop.id,
        [prop.owlClassIRI]: `${base}${prop.id}`
      }
      individual.objectProperties.push(newProp)
    })
  }
  if (individual.annotationPropsOriginal !== undefined) {
    individual.annotationProperties = []
    individual.annotationPropsOriginal.forEach(prop => {
      let newProp = {
        id: prop.id,
        [prop.annotation]: `${base}${prop.id}`
      }
      individual.annotationProperties.push(newProp)
    })
  }
}
