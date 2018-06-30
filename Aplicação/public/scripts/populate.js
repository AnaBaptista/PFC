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