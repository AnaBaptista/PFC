/**
 *  This function verifies if response is ok and handle it
 * @param response {Response}
 * @returns {*}
 */
function handleError (response) {
  if (!response.ok) {
    response.text()
      .then(error => {
        document.body.innerHTML = error
      })
    throw new Error(`Error: ${response.status}`)
  }
  return response
}
