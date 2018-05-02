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

  document.getElementById('data-file-submit').addEventListener('click', () => {
    let f = uploadSingleFile('data-file', '/dataFile')
    f.then((res) => {
      drawIndentedTree(JSON.parse(res), 'data-file-content')
      // let elem = document.getElementById('data-file-content')
      // elem.innerHTML = res
    })
  })

  /**
   * ontology file listeners
   */
  document.getElementById('ontology-file-input').addEventListener('change', () => {
    changeFileInputLabel('ontology-file')
  })

  document.getElementById('ontology-file-submit').addEventListener('click', () => {
    let f = uploadSingleFile('ontology-file', '/ontologyFile')
    f.then((res) => {
      let elem = document.getElementById('ontology-file-content')
      elem.innerHTML = res
    })
  })

  document.getElementById('ontology-file-clear').addEventListener('click', () => {
    clearFileInput('ontology-file', 'Ontology file')
  })
}
