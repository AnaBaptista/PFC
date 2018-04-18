/**
 * upload all files
 */
function uploadFiles () {
  const idx = 0
  let dataFile = $('#data-file-input')[idx].files[idx]
  let ontologyFile = $('#ontology-file-input')[idx].files[idx]

  if (!dataFile || !ontologyFile) {
    alertify.error('Some file required')
    return
  }

  let dataFilePromise = uploadSingleFile(dataFile, '/dataFile', 'data-file')
  dataFilePromise.then(alertify.success('Data file add '))
  let ontologyFilePromise = uploadSingleFile(ontologyFile, '/ontologyFile', 'ontology-file')
  ontologyFilePromise.then(alertify.success('Data file add '))
  // Promise.all([dataFilePromise, ontologyFilePromise])
  //   .then(alertify.success('Files upload with success'))
  //   .catch(err => {
  //     alert(err)
  //   })
}
/**
 * @param {*} file
 * @param {*} fileId
 */
function uploadSingleFile (file, path, fileId) {
  let formData = new FormData()
  formData.append('file', file)
  let options = {
    method: 'POST',
    body: formData
  }

  return fetch(path, options)
    .then(() => {
      let reader = new FileReader()
      reader.onload = function (e) {
        let contents = e.target.result

        displayContents(contents, `${fileId}-content`, 'textContent')
        let contentHtml = $(`#${fileId}-popover-content`).html()
        let elem = $(`#${fileId}-popover`)
        $(elem).popover({
          content: contentHtml
        })
      }
      reader.readAsText(file)
    })
    .catch(err => alert(err))
}

function displayContents (contents, elem, evt) {
  var element = document.getElementById(elem)
  element[evt] = contents
}
