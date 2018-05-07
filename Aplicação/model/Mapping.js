'use strict'
module.exports = Mapping

const idGen = require('shortid')


function Mapping() {
  this._id = idGen.generate()

}