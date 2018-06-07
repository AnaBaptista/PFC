function createIndividual (populateId) {
  let elem = document.getElementById('classes-to-individual')
  let name = document.getElementById('individual-name').value

  if (name.length === 0 || elem.childElementCount === 0) {
    alertify.error('Missing an OWL class and name')
    return
  }

  let ind = elem.childNodes[0]
  let IRI = ind.textContent
  let ontoId = ind.id

  let data = {
    data: {
      owlClassIRI: IRI,
      ontologyFileId: ontoId,
      individualName: name
    },
    populateId: populateId
  }

  let options = getFetchOptions('POST', data)

  fetch(`/map/individual`, options)
    .then(handleError)
    .then(res => res.json())
    .then(json => {
      window.location.href = `/populate/nondata/${populateId}/individual/${json._id}`
    }).catch(err => console.log(err.message))
}

function changeIndividual (ontoId, IRI) {
  let elem = document.getElementById('classes-to-individual')
  let div = document.createElement('div')
  div.id = ontoId
  div.innerText = IRI
  elem.replaceChild(div, elem.childNodes[0])
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

function changeIndividualContent (id, property) {

}
