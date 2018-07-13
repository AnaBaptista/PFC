/**
 * Handle all response and verifies if exist an error
 * @param response {Response}
 * @param cb
 * @returns {*}
 */
function handleResponse (response, cb) {
  let status = response.statusCode
  if (status < 200 || status > 299) {
    let message = response.statusMessage
    return cb(new Error(`Chaos Pop throw error: ${status}. ${message}`))
  }
  cb(null, response.body)
}

module.exports = handleResponse
