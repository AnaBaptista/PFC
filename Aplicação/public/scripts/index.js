/**
 * This function submit a file to homidb
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
    alertify.error('File required')
    return
  }

  let data = {
    data: {
      dataFiles: dFiles,
      ontologyFiles: oFiles
    }
  }

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch('/populate/data', options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      window.location.href = `/populate/data/${json.id}`
    }).catch(err => console.log(err.message))
}

/**
 * This function submits all selected ontology files and renders
 * the populateWithoutData view
 */
function populateOntologyWithoutData () {

}