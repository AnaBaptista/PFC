/**
 * It draws dinamically the tree generated by all data files
 * @param id {Array} data file's id
 */
function getDataFileTree (ids) {
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ids: ids.split(',')})
  }
  fetch('dataFile/nodes', options)
    .then(handleError)
    .then(res => res.json())
    .then(tree => {
      document.getElementById('data-file-tree').innerText = ''
      drawIndentedTree(tree, `data-file-tree`)
    }).catch(err => alert(err.message()))
}

/**
 * This function create an individual mapping on server side
 */
function createIndMapping () {
  let node = document.getElementById('classes-to-term').childNodes[0]
  let onto = getSelectedItems('classes-menu', '.selected')
  let indName = document.getElementById('individual-name-to-term')

  if (node.childNodes.length === 0 || onto.length === 0) {
    alertify.error('Missing data file node, ontology class or individual name')
    return
  }

  indName.removeChild(indName.firstChild)

  let individualName = []
  indName.childNodes.forEach(div => individualName.push(div.id))

  let data = {
    data: {
      tag: node.childNodes[0].textContent,
      nodeId: node.id,
      owlClassIRI: onto[0].textContent,
      ontologyFileId: onto[0].id,
      dataFileId: node.childNodes[1].id,
      specification: false,
      individualName: individualName
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
    .then(res => res.text())
    .then(text => {
      let elem = document.getElementById('mapper-segment')
      elem.innerHTML = text
    })
}

/**
 * This functions add an new data property to
 * individual mapping identified by indMapId
 * @param id {String} individual mapping id
 */
function createDataProperty (id) {
  let node = document.getElementById('dproperty-to-term').childNodes[0]
  let property = getSelectedItems('data-properties-menu', '.selected')
  let type = getSelectedItems('data-property-type-menu', '.selected')

  if (property.length === 0 || type.length === 0 || node.childNodes.length === 0) {
    alertify.error('Missing data property, type or node')
    return
  }

  let data = {
    data: {
      owlClassIRI: property[0].textContent,
      type: type[0].textContent,
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

  // TODO: make request
  fetch(`/map/individual/${id}/dataProperty`, options)
    .then(handleError)
    .then(res => res.json())
    .then()
}

/**
 *
 * @param id {String} individual mapping id
 */
function createObjectProperty (id) {
  let property = getSelectedItems('object-properties-menu', '.selected')
  let node = document.getElementById('oproperty-to-term').childNodes[0]

  if (property.length === 0 || node.childNodes.length === 0) {
    alertify.error('Missing object property or node')
    return
  }

  let data = {
    data: {
      owlClassIRI: property[0].textContent,
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

  //TODO: make request
  fetch(`/map/individual/${id}/objectProperty`, options)
    .then(handleError)
    .then(res => res.json())
    .then()
}

/**
 *
 * @param id
 */
function createAnnotationProperty (id) {
  let annotation = getSelectedItems('annotation-properties-menu', '.selected')
  let node = document.getElementById('aproperty-to-term').childNodes[0]

  if (annotation.length === 0 || node.childNodes.length === 0) {
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

  //TODO: make request
  fetch(`/map/individual/${id}/annotationProperty`, options)
    .then(handleError)
    .then(res => res.json())
    .then()
}

/**
 *
 * @param id {String} invidual mapping id
 * @param type {String} property type (data, object or annotation)
 */
function changeIndMappingContent (id, type) {
  changeDataFileOptionsToMappingId(type)
  let path = (type === 'oproperty' && 'objectproperties') ||
    (type === 'dproperty' && 'dataproperties') ||
    (type === 'aproperty' && 'annotationproperties')
  let url = `/map/individual/${id}/${path}`
  fetch(url)
    .then(handleError)
    .then(res => res.text())
    .then(text => {
      let elem = document.getElementById('individual-mapping-content')
      elem.innerHTML = text
      $('.dropdown').dropdown({fullTextSearch: true})
    })
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
  let div = document.createElement('div')
  div.id = node.id
  div.innerText = node.tag
  let childDiv = document.createElement('label')
  childDiv.id = node.dataFileId
  childDiv.className = 'dataFileId'
  div.appendChild(childDiv)
  let id = document.getElementById('data-file-term').innerText
  let elem = document.getElementById(id)
  if (id === 'individual-name-to-term') {
    elem.appendChild(div)
  } else {
    elem.replaceChild(div, elem.childNodes[0])
  }
}

/**
 * Set the individual name
 */
function addIndividualName () {
  let indName = document.getElementById('individual-name-to-term').childNodes

  if(indName.length === 1) {
    alertify.error('First, select nodes')
    return
  }

  changeDataFileOptionsToMappingId('classes')
  document.getElementById('add-name-btn').disabled = true
  alertify.success('Individual name changed')
}
