'use strict'

// const Action = require('./action')

exports.create = create
exports.oppositeColor = oppositeColor

exports.PAWN = 'pawn'
exports.TANK = 'tank'
exports.GINT = 'gint'

exports.BLACK = 'black'
exports.WHITE = 'white'

// models a generic piece
class Piece {
  constructor (color, x, y) {
    this.color = color
    this.x = x
    this.y = y
  }
}

exports.baseClass = Piece

const Pawn = require('./pieces/pawn')
const Tank = require('./pieces/tank')
const Gint = require('./pieces/gint')

function create (type, color, x, y, vert) {
  if (type === exports.PAWN) return new Pawn(color, x, y)
  if (type === exports.TANK) return new Tank(color, x, y, vert)
  if (type === exports.GINT) return new Gint(color, x, y)
}

// Return the opposite of the color passed in.
function oppositeColor (color) {
  return (color === exports.BLACK) ? exports.WHITE : exports.BLACK
}
