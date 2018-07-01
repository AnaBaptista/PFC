function handleResponse (response, cb) {
  let status = response.statusCode
  if (status !== 200) {
    let message = response.statusMessage
    message = message.length > 0 ? message : response.body
    return cb(new Error(`Chaos Pop throw error: ${status}. ${message}`))
  }
  cb(null, response.body)
}

module.exports = handleResponse
