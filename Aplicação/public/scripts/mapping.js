/**
 *
 */
function mapperFile () {
  let ontologyFile = getFile('ontology-file')
  let dataFile = getFile('data-file')

  if (!ontologyFile || !dataFile) {
    alertify.error('File required')
    return
  }

  let ontologyFilePromise = uploadSingleFile(ontologyFile, '/ontologyFile')
  let dataFilePromise = uploadSingleFile(dataFile, '/dataFile')

  Promise.all([ontologyFilePromise, dataFilePromise])
    .then(([ontology, data]) => {
      let ontologyId = ontology.ontologyFileId
      let dataId = data.dataFileId
      fetch(`/mapping/${dataId}/to/${ontologyId}`)
        .then(res => {
          window.location = res.url
        })
    }).catch(err => alert(err))
}

function getDataFileTree (id) {
  jsonRequest(`/dataFile/${id}/nodes`)
    .then(tree => {
      let elemId = `data-file-tree-${id}`
      document.getElementById(elemId).innerText = ''
      drawIndentedTree(tree, elemId)
    }).catch(err => alert(err))
}

function changeOntologyMapping (name) {
  let id = `${name}-selection`
  let value = document.getElementById(id).value
  let div = document.createElement('div')
  div.className = name
  div.innerText = value
  let elem = document.getElementById(`${name}-to-concept`)
  elem.replaceChild(div, elem.childNodes[0])
}

function changeDataFileTerm (node) {
  let div = document.createElement('div')
  div.id = node.id
  div.innerText = node.tag
  let elem = document.getElementById('classes-to-term')
  elem.replaceChild(div, elem.childNodes[0])
}

function createIndividualMapping (id, ontId) {
  let dNode = document.getElementById('classes-to-term').childNodes[0]
  let onto = document.getElementById('classes-to-concept').childNodes[0]
  let data = {
    map: {
      tag: dNode.textContent,
      nodeId: dNode.id,
      OWLClassURI: onto.textContent
    },
    ontologyId: ontId
  }

  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  textRequest(`/mapping/${id}/individualMapping`, options)
    .then(res => {
      let elem = document.getElementById('individual-mapping-segment')
      elem.innerHTML = res
    })
}

function createDataProperty (id) {
  let x = 'a'
}

function createObjectProperty (id) {
  let x = 'a'
}
