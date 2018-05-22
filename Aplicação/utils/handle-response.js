function handleResponse (response, cb) {
  let status = response.statusCode
  let message = response.statusMessage
  if (status !== 200) {
    return cb(new Error(`Chaos Pop throw error: ${status}. ${message}`))
  }
  cb(null, response.body)
}

module.exports = handleResponse
