/**
 * It executes when the index page is loaded
 */
function indexOnLoad () {
  /**
   * data file listeners
   */

  document.getElementById('data-file-input-text').addEventListener('click', () => {
    document.getElementById('data-file-input').click()
  })

  document.getElementById('data-file-input').addEventListener('change', () => {
    changeFileInputLabel('data-file')
  })

  /**
   * ontology file listeners
   */
  document.getElementById('ontology-file-input-text').addEventListener('click', () => {
    document.getElementById('ontology-file-input').click()
  })

  document.getElementById('ontology-file-input').addEventListener('change', () => {
    changeFileInputLabel('ontology-file')
  })
}

/**
 * It changes the selected file input label
 * @param id {String} input id
 */
function changeFileInputLabel (id) {
  let file = document.getElementById(`${id}-input`).files[0]
  document.getElementById(`${id}-input-text`).value = file.name
}
