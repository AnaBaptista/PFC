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

function setRadioOnChangeListener() {

}