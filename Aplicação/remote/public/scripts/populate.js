/**
 * This function creates an populate and renders it
 * (with or without data)
 * @param path {String} path to populate with or without data
 * @param data {Object} populate to create
 */
function populate (path, data) {
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch('/populate', options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      window.location.href = `${path}/${json.id}`
    }).catch(err => console.log(err.message))
}

/**
 * This function deletes the populate identified by id
 * @param id {String} populate id
 */
function deletePopulate (id) {
  fetch (`/populate/${id}`, {method: 'DELETE'})
    .then(_ => {
      let toDelete = document.getElementById(id)
      let parent = toDelete.parentElement
      parent.removeChild(toDelete)
      alertify.message('Populate deleted')
    }).catch(err => console.log(err.message))
}

/**
 * It creates an individual or individualMapping
 * @param type {String} data or nondata
 * @param data {Object} Individual to create
 * @param populateId {String} populate id to add the individual created
 */
function genericCreateIndividual (type, data, populateId) {
  let path = (type === 'data' && '/map/individual') || '/individual'

  let options = getFetchOptions('POST', data)

  fetch(path, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      window.location.href = `/populate/${type}/${populateId}/individual/${json._id}`
    }).catch(err => console.log(err.message))
}

/**
 * It deletes an individual (individual mapping or individual)
 * @param path {String} endpoint to delete the specified individual
 * @param id {String} individual id
 */
function genericDeleteIndividual (path, id) {
  fetch (path, {method: 'DELETE'})
    .then(_ => {
      let toDelete = document.getElementById(id)
      let parent = toDelete.parentElement
      parent.removeChild(toDelete)
      alertify.message('Individual deleted')
    }).catch(err => console.log(err.message))
}

/**
 * Generic function that creates a property
 * in specified individual mapping and renders it dinamically
 * @param path {String} path
 * @param data {Object} property to create
 * @param type {String} property type (data, annotation or object)
 */
function genericCreateIndividualProperty (path, data, type) {
  let options = getFetchOptions('PUT', data)

  fetch(path, options)
    .then(handleError)
    .then(res => res.text())
    .then(html => {
      alertify.success(`${type} property created`)
      let list = document.getElementById(`${type}-properties-list`)
      list.insertAdjacentHTML('beforeend', html)
    })
    .catch(err => console.log(err.message))
}

/**
 * This function toogle between the individual properties
 * pursuant the path
 * @param path {String} path
 * @param id {String} element id to change
 */
function genericChangeIndividualContent (path, id) {
  fetch(path)
    .then(handleError)
    .then(res => res.text())
    .then(text => {
      let elem = document.getElementById(id)
      elem.innerHTML = text
      $('.dropdown').dropdown({fullTextSearch: true})
    }).catch(err => console.log(err.message))
}

/**
 * This functions executes the promise and after
 * creates a mapping from populate
 * @param populateId {String} populate id
 * @param elemId {String} individual list id
 * @param promise {Function} function that returns a promise
 */
function genericCreateMapping (populateId, elemId, promise) {
  let elem = document.getElementById(elemId)
  let name = document.getElementById('mapping-name').value
  let children = [].slice.call(elem.children)
  let selectedChildren = []

  children.forEach(c => {
    let input = c.children[0]
    if (input.checked) {
      selectedChildren.push(input.name)
    }
  })

  if (selectedChildren.length === 0) {
    alertify.message('Select some individual mappings')
    return
  }

  if (name.length === 0) {
    alertify.message('Choose an output file name')
    return
  }

  let data = {
    data: {
      indMappings: selectedChildren,
      populateId: populateId,
      name: name
    }
  }
  let options = getFetchOptions('POST', data)
  promise(selectedChildren).then(_ => {
    fetch('/map', options)
      .then(handleError)
      .then(_ => {
        alertify.success('Mapping created')
        window.location.href = '/populate'
      })
  })
}

/**
 * It generates on server side the ouput file with
 * populated ontology
 * @param id {String} populateId
 */
// TODO: show the option to download the output file and delete all data
function generateOutputFile (id) {
  fetch(`/populate/${id}/output`, {method: 'PUT'})
    .then(handleError)
    .then(_ => {
      alertify.success('File created')
    })
}