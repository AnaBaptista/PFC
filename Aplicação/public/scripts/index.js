/**
 * This function submit a file to chaos pop
 * @param id {String} input file id
 * @param path {String} endpoint to submit
 */
function submitFile (id, path) {
  let file = document.getElementById(`${id}-input`).files[0]

  if (!file) {
    alertify.error('No file selected')
    return
  }
  //
  // hasFile(id, file.name)
  //   .then()

  let formData = new FormData()
  formData.append('file', file)
  let options = {
    method: 'POST',
    body: formData
  }

  fetch(path, options)
    .then(res => {
      return res.json()
    }).then(json => {
      let item = document.createElement('div')
      item.id = json.dataFileId
      item.className = 'item'
      item.innerText = file.name
      document.getElementById(`${id}-menu`).appendChild(item)
      clearFileInput(id)
      alertify.success('File add with success')
    })
}

// function hasFile (id, filename) {
//   let path = ((id === 'data-file') && '/dataFile') || ((id === 'ontology-file') && '/ontologyFiles')
//   return fetch(path)
//     .then(res => {
//       return res.json()
//     }).then(files => {
//       let file = files.filter(f => f._id === id)
//
//     })
// }

/**
 * This function submits all selected files and renders
 * the populateWithData view
 */
function populateOntologyWithData () {
  let oFiles = getSelectedFiles('ontology-file-menu')
  let dFiles = getSelectedFiles('data-file-menu')

  if (oFiles.length === 0 || dFiles.length === 0) {
    alertify.error('File required')
    return
  }

  let data = {
    dataFiles: dFiles,
    ontologyFiles: oFiles
  }

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch('/populate/data', options)
    .then(res => {
      return res.text()
    }).then(body => {
      // history.pushState(body, 'Populate with data', '/populate/data')
      document.body.innerHTML = body
    })
}

/**
 *
 * @param id {String} the dropdown's id
 * @returns {Array} all selected files present in the dropdown
 */
function getSelectedFiles (id) {
  let menu = document.getElementById(id)
  let filtersElems = []
  menu.querySelectorAll('.filtered')
    .forEach(elem => filtersElems.push({id: elem.id}))
  return filtersElems
}

/**
 *
 */
function populateOntologyWithoutData () {

}