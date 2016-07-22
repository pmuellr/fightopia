'use strict'

const lodash = require('lodash')

exports.clone = clone
exports.cloneSet = cloneSet
exports.pickRandomElement = pickRandomElement
exports.removeElement = removeElement

// Clone a JSONable object or object that supports a clone .
function clone (obj) {
  if (obj == null) return null                         // clone null as null
  if (lodash.isFunction(obj.clone)) return obj.clone() // call clone() method
  return lodash.cloneDeep(obj)                         // clone as JSON
}

// Clone a Set of JSONable objects or objects that support a clone method.
function cloneSet (set) {
  const result = new Set()

  for (let element of set) {
    result.add(clone(element))
  }

  return result
}

// Pick random element from an iterable.
function pickRandomElement (iterable) {
  const length = iterable.size || iterable.length
  let index = Math.floor(Math.random() * length)
  if (index === length) index--

  for (let item of iterable) {
    if (index === 0) return item
    index--
  }
}

// Remove an element from an iterable.
function removeElement (iterable, element) {
  if (isArray(iterable)) {
    const index = iterable.indexOf(element)
    if (index === -1) return null

    iterable.splice(index, 1) // remove element
    return element
  }

  if (!iterable.has(element)) return null

  iterable.delete(element)
  return element
}
