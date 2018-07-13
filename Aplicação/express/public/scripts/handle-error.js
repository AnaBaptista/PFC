function handleError (response) {
  if (!response.ok) {
    response.text()
      .then(error => {
        document.body.innerHTML = error
      })
    throw new Error(`Error: ${response.message}`)
  }
  return response
}
