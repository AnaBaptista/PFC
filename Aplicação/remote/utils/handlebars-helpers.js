const hbs = require('hbs')

hbs.registerHelper('concat', function () {
  let outStr = ''
  for (let arg in arguments) {
    if (typeof arguments[arg] !== 'object') {
      outStr += arguments[arg]
    }
  }
  return outStr
})

hbs.registerHelper('ifequals', function (str1, str2) {
  return str1 === str2
})

module.exports = hbs
