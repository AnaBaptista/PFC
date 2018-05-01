/**
 *
 * @param id
 * @param path
 * @returns {*}
 */
function uploadSingleFile (id, path) {
  let file = document.getElementById(`${id}-input`).files[0]
  if (!file) {
    alertify.error('File required')
    return
  }
  let formData = new FormData()
  formData.append('file', file)
  let options = {
    method: 'POST',
    body: formData
  }
  return request(path, options)
}

/**
 *
 * @param id
 */
function changeFileInputLabel (id) {
  let file = document.getElementById(`${id}-input`).files[0]
  document.getElementById(`${id}-label`).innerText = file.name
}

/**
 *
 * @param id
 * @param label
 */
function clearFileInput (id, label) {
  document.getElementById(`${id}-input`).value = ''
  document.getElementById(`${id}-content`).innerText = ''
  document.getElementById(`${id}-label`).innerText = label
}