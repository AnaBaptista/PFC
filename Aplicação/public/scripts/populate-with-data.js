/**
 * This function creates an individual mapping on server side
 * @param populateId {String} populate with data id
 */
function createIndividualMapping (populateId) {
  let node = document.getElementById('classes-to-term')
  let onto = getSelectedItems('classes-menu', '.selected')

  if (node.childElementCount === 0 || onto.length === 0) {
    alertify.error('Missing data file node or ontology class')
    return
  }

  node = node.childNodes[0]
  onto = onto[0]

  let data = {
    data: {
      tag: node.textContent,
      nodeId: node.id,
      owlClassIRI: onto.textContent,
      ontologyFileId: onto.id,
      dataFileId: node.childNodes[1].id,
      specification: false
    },
    populateId: populateId
  }

  let options = getFetchOptions('POST', data)

  fetch(`/map/individual`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      window.location.href = `/populate/data/${populateId}/individual/${json._id}`
    }).catch(err => console.log(err.message))
}

/**
 * This function deletes an individual mapping in database
 * and dynamically
 * @param id {String} individual mapping id
 */
function deleteIndividualMapping (id, populateId) {
  fetch(`/map/individual/${id}?populateId=${populateId}`, {method: 'DELETE'})
    .then(handleError)
    .then(_ => {
      let toDelete = document.getElementById(`individual-mapping-${id}`)
      let parent = toDelete.parentElement
      parent.removeChild(toDelete)
      alertify.message('Individual mapping deleted')
    }).catch(err => console.log(err.message))
}

/**
 * This function adds a new object property
 * to individual mapping
 * @param id {String} individual mapping id
 */
function createObjectProperty (id) {
  let property = getSelectedItems('object-properties-menu', '.selected')
  let node = document.getElementById('object-property-to-term')

  if (property.length === 0 || node.childElementCount === 0) {
    alertify.error('Missing object property or node')
    return
  }

  node = node.childNodes[0]
  let data = {
    objProps:
      [{
        owlClassIRI: property[0].textContent,
        toMapNodeId: [node.id]
      }]
  }

  createProperty(data, id, 'object')
}

/**
 * This function adds a new data property to
 * individual mapping identified by indMapId
 * @param id {String} individual mapping id
 */
function createDataProperty (id) {
  let node = document.getElementById('data-property-to-term')
  let property = getSelectedItems('data-properties-menu', '.selected')
  let type = getSelectedItems('data-property-type-menu', '.selected')

  if (property.length === 0 || type.length === 0 || node.childElementCount === 0) {
    alertify.error('Missing data property, type or node')
    return
  }

  let ids = []
  node.childNodes.forEach(div => {
    if (div.nodeName !== '#text') {
      ids.push(div.id)
    }
  })

  let data = {
    dataProps:
      [{
        owlClassIRI: property[0].textContent,
        type: type[0].textContent,
        toMapNodeId: ids
      }]
  }

  createProperty(data, id, 'data')
}

/**
 *
 * @param id {String} individual mapping id
 */
// Label, Comment and SeeAlso (nodes)
function createAnnotationProperty (id) {
  let annotation = getSelectedItems('annotation-properties-menu', '.selected')
  let node = document.getElementById('annotation-property-to-term')

  if (annotation.length === 0 || node.childElementCount === 0) {
    alertify.error('Missing object property or node')
    return
  }

  let ids = []
  node.childNodes.forEach(div => {
    if (div.nodeName !== '#text') {
      ids.push(div.id)
    }
  })

  let data = {
    annotationProps: [{
      annotation: annotation[0].textContent,
      toMapNodeId: ids
    }]
  }

  createProperty(data, id, 'annotation')
}

/**
 * Generic function that creates a property
 * in specified individual mapping
 * @param data {Object} property to create
 * @param id {String} individual mapping id
 * @param type {String} property type (data, annotation or object)
 */
function createProperty (data, id, type) {
  let options = getFetchOptions('PUT', data)

  fetch(`/map/individual/${id}/properties/${type}`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      location.reload()
      alertify.success(`${type} property created`)
    })
    .catch(err => console.log(err.message))
}

/**
 * This functions sets the individual mapping name's
 * @param id {String} individual mapping id
 */
function createIndividualName (id) {
  let indName = document.getElementById('individual-name-to-term')
  if (indName.childElementCount === 0) {
    alertify.error('Missing nodes to mapper individual name')
    return
  }

  let individualName = []
  indName.childNodes.forEach(div => {
    if (div.nodeName !== '#text') {
      individualName.push(div.id)
    }
  })

  let data = {
    individualName: individualName
  }

  let options = getFetchOptions('PUT', data)

  document.getElementById('individual-name-btn').style.display = 'none'
  fetch(`/map/individual/${id}/name`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      document.getElementById('individual-name-to-term').innerText = ''
      document.getElementById('individual-name-btn').style.display = 'inline'
      document.getElementById('individual-name-row').style.display = 'none'
      document.getElementById('individual-name').innerText = json
      alertify.success('Individual name changed')
    })
    .catch(err => console.log(err.message))
}

/**
 * This functions displays an element that permits add an
 * individual name to individual mapping
 */
function showIndividualNameContent () {
  let currDisplay =  document.getElementById('individual-name-row').style.display
  let nextDisplay = (currDisplay === 'block' && 'none') || 'block'
  document.getElementById('data-file-term').innerText = (nextDisplay === 'block' && `individual-name-to-term`) || ''
  document.getElementById('individual-name-row').style.display = nextDisplay
  document.getElementById('individual-mapping-content').innerText = ''
  if (nextDisplay === 'none') {
    document.getElementById('individual-name-to-term').innerText = ''
  }
}

/**
 *  This function changes the properties content's
 * @param id {String} invidual mapping id
 * @param type {String} property type (data, object or annotation)
 */
function changeIndividualMappingContent (id, type) {
  document.getElementById('individual-name-row').style.display = 'none'
  document.getElementById('individual-name-to-term').innerText = ''
  document.getElementById('data-file-term').innerText = `${type}-property-to-term`

  let url = `/map/individual/${id}/properties/${type}/view`

  fetch(url)
    .then(handleError)
    .then(res => res.text())
    .then(text => {
      let elem = document.getElementById('individual-mapping-content')
      elem.innerHTML = text
      $('.dropdown').dropdown({fullTextSearch: true})
    }).catch(err => console.log(err.message))
}