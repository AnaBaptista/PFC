const hbs = require('hbs')

/**
 * It registers a function that concats an undefined number of strings
 */
hbs.registerHelper('concat', function () {
  let outStr = ''
  for (let arg in arguments) {
    if (typeof arguments[arg] !== 'object') {
      outStr += arguments[arg]
    }
  }
  return outStr
})

/**
 * It registers a function that verifies if two values are equals
 */
hbs.registerHelper('ifequals', function (v1, v2) {
  return v1 === v2
})

module.exports = hbs
