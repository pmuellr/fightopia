'use strict'

exports.jsonClone = jsonClone

// Clone an object as JSON.
function jsonClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}
