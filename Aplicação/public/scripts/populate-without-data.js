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

function finalizeMapping (popId) {
  let elem = document.getElementById('individuals-nondata-to-mapping-list')
  let children = [].slice.call(elem.children)
  let selectedChildren = []

  children.forEach(c => {
    let input = c.children[0]
    if (input.checked) {
      selectedChildren.push(input.name)
    }
  })

  let name = document.getElementById('mapping-name').value

  if (name.length === 0) {
    alertify.message('Choose an output file name')
    return
  }

  if (selectedChildren.length === 0) {
    alertify.message('Select some individual mappings')
    return
  }

  let data = {
    list: selectedChildren
  }
  let options = getFetchOptions('PUT', data)

  fetch(`/populate/nondata/${popId}/finalizeIndividual`, options)
    .then(handleError)
    .then(res => res.json())
    .then(ids => {
      let data = {
        data: {
          indMappings: selectedChildren,
          populateId: popId,
          name: name
        }
      }
      let options = getFetchOptions('POST', data)

      fetch('/map', options)
        .then(handleError)
        .then(_ => {
          alertify.success('Mapping created')
          window.location.href = `/populate`
        })
    })
}
