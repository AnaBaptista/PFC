/**
 * This function submits a file to homidb
 * @param id {String} input file id
 * @param path {String} endpoint to submit
 */
function submitFile (id, path) {
  let file = document.getElementById(`${id}-input`).files[0]

  if (!file) {
    alertify.error('No selected file')
    return
  }

  let formData = new FormData()
  formData.append('file', file)
  let options = {
    method: 'POST',
    body: formData
  }
  fetch(path, options)
    .then(handleError)
    .then(res => {
      return res.json()
    }).then(json => {
      let item = document.createElement('div')
      item.id = json._id
      item.className = 'item'
      item.innerText = file.name
      document.getElementById(`${id}-menu`).appendChild(item)
      /**
     * Clear the file input
     * @type {string}
     */
      document.getElementById(`${id}-input`).value = ''
      document.getElementById(`${id}-input-text`).value = ''
      alertify.success('File add with success')
    }).catch(err => console.log(err.message))
}

/**
 * This function submits all selected files and renders
 * the populateWithData view
 */
function populateOntologyWithData () {
  let oFiles = getSelectedItems('ontology-file-menu', '.filtered').map(o => o.id)
  let dFiles = getSelectedItems('data-file-menu', '.filtered').map(d => d.id)

  if (oFiles.length === 0 || dFiles.length === 0) {
    alertify.error('Missing data files or ontology files')
    return
  }

  let data = {
    data: {
      dataFiles: dFiles,
      ontologyFiles: oFiles
    }
  }
  populate('/populate/data', data)
}

/**
 * This function submits all selected ontology files and renders
 * the populateWithoutData view
 */
function populateOntologyWithoutData () {
  let oFiles = getSelectedItems('ontology-file-menu', '.filtered').map(o => o.id)

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
 * This function creates a populate and renders the
 * specified populate (with or without data)
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
