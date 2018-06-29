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

