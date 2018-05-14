/**
 * Returns the file identified by id
 * @param id
 * @returns {*}
 */
function getFile (id) {
  return document.getElementById(`${id}-input`).files[0]
}

/**
 *
 * @param id
 * @param path
 * @returns {*}
 */
function uploadSingleFile (file, path) {
  let formData = new FormData()
  formData.append('file', file)
  let options = {
    method: 'POST',
    body: formData
  }
  return jsonRequest(path, options)
}

function submitFile (id, path) {
  let file = document.getElementById(`${id}-input`).files[0]

  if (!file) {
    alertify.error('No file selected')
    return
  }

  uploadSingleFile(file, path)
    .then(dFile => {
      let item = document.createElement('div')
      item.id = dFile.dataFileId
      item.className = 'item'
      item.innerText = file.name
      document.getElementById(`${id}-menu`).appendChild(item)
      clearFileInput(id)
      alertify.success('File add with success')
    })
}

function setRadioOnChangeListener() {

}