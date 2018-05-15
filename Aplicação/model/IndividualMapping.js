'use strict'
module.exports = IndividualMapping

function IndividualMapping(id,tag, IRI,fileIds, individualName,oProps, dProps, aProps) {

  this._id = id
  this.dataFileIds = fileIds
  this.tag = tag
  this.individualName = individualName
  this.owlClassIRI = IRI
  this.specification = false
  this.objectProperties = oProps
  this.dataProperties = dProps
  this.annotationProperties = aProps
}
