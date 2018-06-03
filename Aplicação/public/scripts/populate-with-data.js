/**
 * It draws dinamically the tree generated by all data files
 * @param id {Array} populate id
 */
function getPopulateTree (id) {
  getTree(`/populate/data/${id}/tree`, 'data-file-tree')
}

/**
 * It draws dinamically the tree that belongs to specified
 * individual mapping
 * @param id {String} populate id
 * @param ind {String} individual mapping id
 */
function getPopulateIndividualTree (id, ind) {
  getTree(`/populate/data/${id}/individual/${ind}/tree`, 'individual-tree')
}

/**
 * Generic function that draws a tree into element identified by id
 * @param path {String} path to get the tree
 * @param id {String} html element id
 */
function getTree (path, id) {
  fetch(path)
    .then(handleError)
    .then(res => res.json())
    .then(tree => {
      document.getElementById(id).innerText = ''
      drawIndentedTree(tree, id)
    }).catch(err => console.log(err.message))
}

/**
 * This function creates an individual mapping on server side
 * @param populateId {String} populate with data id
 */
function createIndMapping (populateId) {
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
    }
  }

  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch(`/map/individual`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      window.location.href = `/populate/data/${populateId}/individual/${json._id}`
    }).catch(err => console.log(err.message))
}

/**
 * This function adds a new data property to
 * individual mapping identified by indMapId
 * @param id {String} individual mapping id
 */
function createDataProperty (id) {
  let node = document.getElementById('dproperty-to-term')
  let property = getSelectedItems('data-properties-menu', '.selected')
  let type = getSelectedItems('data-property-type-menu', '.selected')

  if (property.length === 0 || type.length === 0 || node.childElementCount === 0) {
    alertify.error('Missing data property, type or node')
    return
  }

  node.removeChild(node.firstChild)
  let ids = []
  node.childNodes.forEach(div => ids.push(div.id))

  let data = {
    dataProps:
      [{
        owlClassIRI: property[0].textContent,
        type: type[0].textContent,
        toMapNodeIds: ids
      }]
  }

  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch(`/map/individual/${id}/properties/data`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      //TODO: json ...waiting for property id
      document.getElementById('dproperty-to-term').innerText = ''
      alertify.success('Data property created')
    })
    .catch(err => console.log(err.message))
}

/**
 * This function adds a new object property
 * to individual mapping
 * @param id {String} individual mapping id
 */
function createObjectProperty (id) {
  let property = getSelectedItems('object-properties-menu', '.selected')
  let node = document.getElementById('oproperty-to-term')

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

  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch(`/map/individual/${id}/properties/object`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      //TODO: json ..waiting for property id
      document.getElementById('oproperty-to-term').innerText = ''
      alertify.success('Object property created')
    })
    .catch(err => console.log(err.message))
}

/**
 *
 * @param id {String} individual mapping id
 */
function createAnnotationProperty (id) {
  let annotation = getSelectedItems('annotation-properties-menu', '.selected')
  let node = document.getElementById('aproperty-to-term')

  if (annotation.length === 0 || node.childElementCount === 0) {
    alertify.error('Missing object property or node')
    return
  }

  let data = {
    data: {
      annotation: annotation[0].textContent,
      nodeId: node.id
    }
  }

  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  // //TODO: make request
  // fetch(`/map/individual/${id}/properties/annotation`, options)
  //   .then(handleError)
  //   .then(res => res.json())
  //   .then()
  //   .catch(err => console.log(err.message))
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

  indName.removeChild(indName.firstChild)
  let individualName = []
  indName.childNodes.forEach(div => individualName.push(div.id))

  let data = {
    individualName: individualName
  }

  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  document.getElementById('individual-name-btn').style.display = 'none'
  fetch(`/map/individual/${id}/name`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      document.getElementById('individual-name-to-term').innerText = ''
      document.getElementById('individual-name-btn').style.display = 'inline'
      document.getElementById('individual-name-row').style.display = 'none'
      alertify.success('Individual name changed')
    })
    .catch(err => console.log(err.message))
}

/**
 * This functions displays an element that permits add an
 * individual name to individual mapping
 */
function addIndividualName () {
  changeDataFileOptionsToMappingId('individual-name')
  document.getElementById('individual-name-row').style.display = 'block'
  document.getElementById('individual-mapping-content').innerText = ''
}
/**
 *  This function changes the properties content's
 * @param id {String} invidual mapping id
 * @param type {String} property type (data, object or annotation)
 */
function changeIndMappingContent (id, type) {
  changeDataFileOptionsToMappingId(type)
  document.getElementById('individual-name-row').style.display = 'none'

  let path = (type === 'oproperty' && 'objectprops') ||
    (type === 'dproperty' && 'dataprops') ||
    (type === 'aproperty' && 'annotationprops')
  let url = `/map/individual/${id}/${path}/view`
  fetch(url)
    .then(handleError)
    .then(res => res.text())
    .then(text => {
      let elem = document.getElementById('individual-mapping-content')
      elem.innerHTML = text
      $('.dropdown').dropdown({fullTextSearch: true})
    }).catch(err => console.log(err.message))
}

/**
 *
 * @param type {String} property type (data, object, annotation or individualname)
 */
function changeDataFileOptionsToMappingId (type) {
  let term = document.getElementById('data-file-term')
  term.innerText = `${type}-to-term`
}

/**
 * This functions dynamically changes the selected option
 * @param node {Object} the selected node
 */
function changeDataFileOptionToMapping (node) {
  let id = document.getElementById('data-file-term').innerText
  let elem = document.getElementById(id)
  if (!elem) {
    alertify.warning('Nothing to mapper with this node, choose properties or name')
    return
  }
  let div = document.createElement('div')
  div.id = node.id
  div.innerText = node.tag
  let childDiv = document.createElement('label')
  childDiv.id = node.dataFileId
  childDiv.className = 'dataFileId'
  div.appendChild(childDiv)

  if (id === 'individual-name-to-term' || id === 'dproperty-to-term') {
    elem.appendChild(div)
  } else {
    elem.replaceChild(div, elem.childNodes[0])
  }
}

/**
 * This function deletes an individual mapping in database
 * and dynamically
 * @param id {String} individual mapping id
 */
function deleteIndividualMapping (id) {
  let options = {
    method: 'DELETE'
  }

  fetch(`/map/individual/${id}`, options)
    .then(handleError)
    .then(_ => {
      let toDelete = document.getElementById(`individual-mapping-${id}`)
      let parent = toDelete.parentElement
      parent.removeChild(toDelete)
    }).catch(err => console.log(err.message))
}