function textRequest (path, options) {
  return fetch(path, options)
    .then((res) => {
      return res.text()
    })
    .catch(err => alert(err))
}

function jsonRequest (path, options) {
  return fetch(path, options)
    .then((res) => {
      return res.json()
    })
    .catch(err => alert(err))
}
