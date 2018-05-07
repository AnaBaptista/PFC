function getOntologyFileData (id, data, name) {
  let path = `/ontologyFile/${id}/${data}`
  textRequest(path).then(res => {
    let elem = document.getElementById(name)
    elem.innerHTML = res
    // let inputs = document.querySelectorAll(`input[name=${name}]`)
    // inputs.forEach(elem => elem.addEventListener('change', evt => {
    //   let target = evt.target
    //
    // }))
    // let elements = document.querySelectorAll(`div[class=${name}]`)
    // elements.forEach(elem => {
    //   elem.childNodes.
    // })
  })
}