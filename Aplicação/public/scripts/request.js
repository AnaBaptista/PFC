function textRequest (path, options) {
  return fetch(path, options)
    .then((res) => {
      return res.text()
    })
    .catch(err => alert(err))
}


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