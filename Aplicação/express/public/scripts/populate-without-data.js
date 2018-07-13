/**
 * This function submits all selected ontology files and renders
 * the populateWithoutData view
 */
function populateOntologyWithoutData () {
  let oFiles = getSelectedItems('ontology-file-menu', '.filtered')
    .map(o => { return {id: o.id, name: o.innerText} })

  if (oFiles.length === 0) {
    alertify.error('Missing ontology files')
    return
  }

  let data = {
    data: {
      ontologyFiles: oFiles
    }
  }
  populate('/populate/nondata', data)
}

/**
 * This function creates an individual and renders it
 * @param populateId {String} populate id
 */
function createIndividual (populateId) {
  let elem = getSelectedItems('individual-classes-menu', '.selected')
  let name = document.getElementById('individual-name').value

  if (name.length === 0 || elem.length === 0) {
    alertify.error('Missing an OWL class and name')
    return
  }

  elem = elem[0]

  let data = {
    data: {
      owlClassIRI: elem.textContent,
      ontologyFileId: elem.id,
      originalIndividualName: name
    },
    populateId: populateId
  }
  genericCreateIndividual('nondata', data, populateId)
}

/**
 * This function deletes an individual in database
 * and dynamically
 * @param id {String} individual id
 * @param populateId {String} populate id that individual belongs
 */
function deleteIndividual (id, populateId) {
  genericDeleteIndividual(`/individual/${id}?populateId=${populateId}`, `individual-${id}`)
}

/**
 * This functions create a new annotion property
 * in specified individual
 * @param id {String} individual id
 */
function createIndividualAnnotationProperty (id) {
  let annotation = getSelectedItems('annotation-properties-menu', '.selected')
  let value = document.getElementById('individual-annotation-property').value

  if (annotation.length === 0 || value.length === 0) {
    alertify.error('Missing annotation property or value')
    return
  }

  let data = {
    annotationProps: [{
      annotation: annotation[0].textContent,
      value: value
    }]
  }
  createIndividualProperty(data, id, 'annotation')
}

/**
 * This function adds a new data property to
 * individual identified by id
 * @param id {String} individual id
 */
function createIndividualDataProperty (id) {
  let property = getSelectedItems('data-properties-menu', '.selected')
  let type = getSelectedItems('data-property-type-menu', '.selected')
  let value = document.getElementById('individual-data-property').value

  if (property.length === 0 || type.length === 0 || value.length === 0) {
    alertify.error('Missing data property, type or value')
    return
  }

  if (verifyIndividualPropertyType(type[0].textContent, null, value) === false) {
    alertify.error('Data property type not valid for this value')
    return
  }

  let data = {
    dataProps:
      [{
        owlClassIRI: property[0].textContent,
        type: type[0].textContent,
        value: value
      }]
  }
  createIndividualProperty(data, id, 'data')
}

/**
 * This function adds a new object property
 * to individual identified by id
 * @param id {String} individual mapping id
 * @param populateId {String} populate id
 */
function createIndividualObjectProperty (id, populateId) {
  let property = getSelectedItems('object-properties-menu', '.selected')
  let value = getSelectedItems('individuals-menu', '.selected')

  if (property.length === 0 || value.length === 0) {
    alertify.error('Missing object property or object value')
    return
  }

  let data = {
    objProps:
      [{
        owlClassIRI: property[0].textContent,
        value: {
          id: value[0].id,
          name: value[0].textContent
        }
      }],
    populateId: populateId
  }
  createIndividualProperty(data, id, 'object')
}

/**
 * This function creates a property
 * in specified individual
 * @param data {Object} property to create
 * @param id {String} individual id
 * @param type {String} property type (data, annotation or object)
 */
function createIndividualProperty (data, id, type) {
  genericCreateIndividualProperty(`/individual/${id}/properties/${type}`, data, type)
}

/**
 * This functions removes the specified property
 * from individual
 * @param id {id} individual id
 * @param propertyId {String} property id
 * @param type {String} property type (annotation, data or object)
 */
function deleteIndividualProperty (id, propertyId, type) {
  genericDeleteIndividualProperty(`/individual/${id}/properties/${propertyId}?type=${type}`, propertyId)
}

/**
 * This function change the individual properties content's
 * @param id {String} individual id
 * @param type {String} property type (annotation, data or object)
 * @param popId {String} populate id that the individual belongs to
 */
function changeIndividualContent (id, type, popId) {
  let url = (type === 'object' && `/individual/${id}/properties/${type}/view?populateId=${popId}`) ||
    `/individual/${id}/properties/${type}/view`
  genericChangeIndividualContent(url, 'individual-properties-content')
}

/**
 * This function finalizes all individuals from populate
 * and after creates a mapping
 * @param populateId {String} populate id
 */
function finalizeMapping (populateId) {
  let promise = (elems) => {
    let data = {
      list: elems
    }
    let options = getFetchOptions('PUT', data)
    return fetch(`/populate/nondata/${populateId}/finalize`, options)
      .then(handleError)
      .then(_ => Promise.resolve())
  }
  genericCreateMapping(populateId, 'individuals-nondata-to-mapping-list', promise)
}

/**
 * This functions verifies if value is 'type'
 * @param type {String}
 * @param value {String}
 * @returns {boolean}
 */
function verifyIndividualPropertyType (type, value) {
  let res = true
  if (type === 'Boolean') {
    res = !(value !== false || value !== true)
  } else if (type !== 'String') {
    res = !isNaN(value)
  }
  return res
}
