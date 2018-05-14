/**
 *
 * @param id
 */
function changeFileInputLabel (id) {
  let file = document.getElementById(`${id}-input`).files[0]
  document.getElementById(`${id}-input-text`).value = file.name
}

/**
 *
 * @param id
 * @param label
 */
function clearFileInput (id) {
  document.getElementById(`${id}-input`).value = ''
  document.getElementById(`${id}-input-text`).value = ''
}
