function request (path, options) {
  return fetch(path, options)
    .then((res) => {
      return res.text()
    })
    .catch(err => alert(err))
}
