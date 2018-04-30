/**
 * upload files
 */

function uploadSingleFile (id, path) {
  let file = document.getElementById(`${id}-input`).files[0]
  let formData = new FormData()
  formData.append('file', file)
  let options = {
    method: 'POST',
    body: formData
  }

  return fetch(path, options)
    .then((res) => {
      return res.json()
    })
    .catch(err => alert(err))
}
