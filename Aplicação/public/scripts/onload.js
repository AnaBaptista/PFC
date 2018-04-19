window.onload = function () {
  /**
   * files input on change listener
   */
  document.getElementById('data-file-input').addEventListener('change', () => {
    let f = uploadSingleFile('data-file', '/dataFile')
    f.then((json) => {
      console.log(json.nodes)
    })
  })

  document.getElementById('ontology-file-input').addEventListener('change', () => {
    let f = uploadSingleFile('ontology-file', '/ontologyFile')
    f.then((json) => {
      console.log(json.classes)
    })
  })
}
