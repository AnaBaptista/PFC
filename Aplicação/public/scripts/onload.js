window.onload = function () {
  /**
   * files input on change listener
   */
  document.getElementById('data-file-input').addEventListener('change', () => {
    changeLabel('data-file')
  })

  document.getElementById('ontology-file-input').addEventListener('change', () => {
    changeLabel('ontology-file')
  })

  document.getElementById('data-file-submit').addEventListener('click', () => {
    let f = uploadSingleFile('data-file', '/dataFile')
    f.then((json) => {
      console.log(json.nodes)
    })
  })

  document.getElementById('ontology-file-submit').addEventListener('click', () => {
    let f = uploadSingleFile('ontology-file', '/ontologyFile')
    f.then((json) => {
      console.log(json.classes)
    })
  })
}

function changeLabel (id) {
  let file = document.getElementById(`${id}-input`).files[0]
  document.getElementById(`${id}-label`).innerText = file.name
}
