/**
 * This function submits all selected files and renders
 * the populateWithData view
 */
function populateOntologyWithData () {
  let oFiles = getSelectedItems('ontology-file-menu', '.filtered').map(o => { return {id: o.id, name: o.innerText} })
  let dFiles = getSelectedItems('data-file-menu', '.filtered').map(d => { return {id: d.id, name: d.innerText} })

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
  let oFiles = getSelectedItems('ontology-file-menu', '.filtered').map(o => {return {id: o.id, name: o.innerText} })

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
