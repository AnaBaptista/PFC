window.onload = function () {
  /**
   * data file listeners
   */
  document.getElementById('data-file-input').addEventListener('change', () => {
    changeFileInputLabel('data-file')
  })

  document.getElementById('data-file-clear').addEventListener('click', () => {
    clearFileInput('data-file', 'Data file')
  })

  /**
   * ontology file listeners
   */
  document.getElementById('ontology-file-input').addEventListener('change', () => {
    changeFileInputLabel('ontology-file')
  })

  document.getElementById('ontology-file-clear').addEventListener('click', () => {
    clearFileInput('ontology-file', 'Ontology file')
  })
}
