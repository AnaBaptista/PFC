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
      individualName: name
    },
    populateId: populateId
  }
  genericCreateIndividual('nondata', data, populateId)
}

function deleteIndividual (id, populateId) {
  let options = {
    method: 'DELETE'
  }

  fetch(`/individual/${id}?populateId=${populateId}`, options)
    .then(handleError)
    .then(_ => {
      let toDelete = document.getElementById(`individual-${id}`)
      let parent = toDelete.parentElement
      parent.removeChild(toDelete)
      alertify.message('Individual deleted')
    }).catch(err => console.log(err.message))
}

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

function createIndividualDataProperty (id) {
  let property = getSelectedItems('data-properties-menu', '.selected')
  let type = getSelectedItems('data-property-type-menu', '.selected')
  let value = document.getElementById('individual-data-property').value

  if (property.length === 0 || type.length === 0 || value.length === 0) {
    alertify.error('Missing data property, type or value')
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

function createIndividualObjectProperty (id) {
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
      }]
  }
  createIndividualProperty(data, id, 'object')
}

function createIndividualProperty (data, id, type) {
  let options = getFetchOptions('PUT', data)

  fetch(`/individual/${id}/properties/${type}`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      location.reload()
      alertify.success(`${type} property created`)
    })
    .catch(err => console.log(err.message))
}

function changeIndividualContent (id, type, popId) {
  let url = (type === 'object' && `/individual/${id}/properties/${type}/view?populateId=${popId}`) ||
    `/individual/${id}/properties/${type}/view`
  fetch(url)
    .then(handleError)
    .then(res => res.text())
    .then(text => {
      let elem = document.getElementById('individual-properties-content')
      elem.innerHTML = text
      $('.dropdown').dropdown({fullTextSearch: true})
    }).catch(err => console.log(err.message))
}
