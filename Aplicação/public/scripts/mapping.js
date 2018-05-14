/**
 *
 */
function mapperFile () {
  let oFiles = getSelectionFiles('ontology-file-menu')
  let dFiles = getSelectionFiles('data-file-menu')

  if (!oFiles.length === 0 || !dFiles.length === 0) {
    alertify.error('File required')
    return
  }
  let classes = getOntologyClasses(oFiles)

  let data = {
    dataFiles: dFiles,
    classes: classes
  }

  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  fetch('/map/to', options)
    .then(res => {
      window.location = res.url
    }).catch(err => alert(err))
}

function getOntologyClasses (ids) {

}

function getSelectionFiles (id) {
  let menu = document.getElementById(id)
  let filtersElems = []
  menu.querySelectorAll('.filtered')
    .forEach(elem => filtersElems.push({id: elem.id}))
  return filtersElems
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
  let id = document.getElementById('data-file-term').innerText
  let elem = document.getElementById(id)
  elem.replaceChild(div, elem.childNodes[0])
}

function createIndMapping (dataId, ontId) {
  let dNode = document.getElementById('classes-to-term').childNodes[0]
  let onto = document.getElementById('classes-to-concept').childNodes[0]
  let data = {
    tag: dNode.textContent,
    nodeId: dNode.id,
    IRI: onto.textContent
  }

  let options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  textRequest(`/map/individual?ontologyFileId=${ontId}&dataFileId=${dataId}`, options)
    .then(res => {
      let elem = document.getElementById('mapper-segment')
      elem.innerHTML = res
    })
}

function createDataProperty (id) {
  let x = 'a'
}

function createObjectProperty (id) {
  let x = 'a'
}

function changeIndMappingContent(id, nodeId, name, path, ontId, dataId) {
  let term = document.getElementById('data-file-term')
  term.innerText = `${name}-to-term`
  let url = `/map/individual/${id}/${path}?nodeId=${nodeId}&ontologyFileId=${ontId}&dataFileId=${dataId}`
  textRequest(url)
    .then(res => {
      let elem = document.getElementById('individual-mapping-content')
      elem.innerHTML = res
    })
}
