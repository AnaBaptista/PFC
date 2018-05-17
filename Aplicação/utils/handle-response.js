function handleResponse (response, cb) {
  let status = response.statusCode
  let message = response.statusMessage
  if (status !== 200) {
    return cb(new Error(`Error: ${status}. ${message}`))
  }
  cb(null, response.body)
}

module.exports = handleResponse
