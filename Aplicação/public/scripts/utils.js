/**
 *
 * @param id {String} dropdown id
 * @returns {Array} all selected files present in the dropdown
 */
function getSelectedItems (id, selector) {
  let menu = document.getElementById(id)
  let filtersElems = []
  menu.querySelectorAll(selector)
    .forEach(elem => filtersElems.push(elem))
  return filtersElems
}

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
