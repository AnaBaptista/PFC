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

  hasFile(id, file.name)
    .then(f => {
      if (f.length !== 0) {
        throw new Error('Choose another filename')
      }
    }).then(_ => {
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
          /**
         * Clear the file input
         * @type {string}
         */
          document.getElementById(`${id}-input`).value = ''
          document.getElementById(`${id}-input-text`).value = ''
          alertify.success('File add with success')
        })
    }).catch(err => {
      alert(err.message)
    })
}

/**
 * This function verifies if exists a file with name
 * @param id {String} file id
 * @param name {String} name to verify
 * @returns {Promise<any>}
 */
function hasFile (id, name) {
  let path = ((id === 'data-file') && '/dataFile') || ((id === 'ontology-file') && '/ontologyFile')
  return fetch(path)
    .then(res => {
      return res.json()
    }).then(obj => {
      let file = obj.files.filter(f => {
        let cmpName = ((id === 'data-file') && f.name) || f.path.split('\\').pop()
        return cmpName === name
      })
      return file
    })
}

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
    }).catch(err => alert(err.message))
}

/**
 *
 * @param id {String} dropdown id
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
 * This function submits all selected ontology files and renders
 * the populateWithoutData view
 */
function populateOntologyWithoutData () {

}