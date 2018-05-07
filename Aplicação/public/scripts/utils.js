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
  document.getElementById(`${id}-label`).innerText = label
}
