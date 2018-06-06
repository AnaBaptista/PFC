/**
 *
 * @param id {String} dropdown id
 * @param selector {String} (filtered or selected)
 * @returns {Array} all selected files present in the dropdown
 */
function getSelectedItems (id, selector) {
  let menu = document.getElementById(id)
  let filtersElems = []
  menu.querySelectorAll(selector)
    .forEach(elem => filtersElems.push(elem))
  return filtersElems
}

/**
 * This function constructs the request options and returns it
 * @param method {String}
 * @param data {Object} request body
 * @returns {{method: string, headers: {Accept: string, 'Content-Type': string}, body: string}}
 */
function getFetchOptions (method, data) {
  let options = {
    method: `${method}`,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  return options
}
