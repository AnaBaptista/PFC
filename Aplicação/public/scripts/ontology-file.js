function getOntologyFileData (id, data) {
  let path = `/ontologyFile/${id}/${data}`
  request(path).then(res => {
    let elem = document.getElementById('ontology-file-data')
    elem.innerHTML = res
  })
}