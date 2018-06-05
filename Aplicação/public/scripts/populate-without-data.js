function createIndividual (populateId) {
  let elem = document.getElementById('classes-to-individual')
  let ind = elem.childNodes[0]
  let IRI = ind.textContent
  let ontoId = ind.id

  let data = {
    IRI: IRI,
    ontologyFileId: ontoId
  }

  let options = {
    method: 'POST',
    body: JSON.stringify(data)
  }

  // TODO: create an individual
  fetch(``)
}

function changeIndividual (ontoId, IRI) {
  let elem = document.getElementById('classes-to-individual')
  let div = document.createElement('div')
  div.id = ontoId
  div.innerText = IRI
  elem.innerHTML = elem
}

function deleteIndividual (id) {
  let options = {
    method: 'DELETE'
  }

  fetch(`/map/individual/${id}`, options)
    .then(handleError)
    .then(_ => {
      let toDelete = document.getElementById(`individual-mapping-${id}`)
      let parent = toDelete.parentElement
      parent.removeChild(toDelete)
    }).catch(err => console.log(err.message))
}
