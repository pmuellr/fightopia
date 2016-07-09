'use strict'

exports.create = create

exports.PAWN = 'pawn'
exports.TANK = 'tank'
exports.GINT = 'gint'

exports.BLACK = 'black'
exports.WHITE = 'white'

function create (type, color, x, y, vert) {
  if (type === exports.PAWN) return new Pawn(color, x, y)
  if (type === exports.TANK) return new Tank(color, x, y, vert)
  if (type === exports.GINT) return new Gint(color, x, y)
}

// models a generic piece
class Piece {
  constructor (color, x, y) {
    this.color = color
    this.x = x
    this.y = y
  }
}

class Pawn extends Piece {
  constructor (color, x, y) {
    super(color, x, y)

    this.type = exports.PAWN
  }
}

class Tank extends Piece {
  constructor (color, x, y, vert) {
    super(color, x, y)
    if (vert == null) vert = true

    this.type = exports.TANK
    this.vert = vert
  }
}

class Gint extends Piece {
  constructor (color, x, y) {
    super(color, x, y)

    this.type = exports.GINT
  }
}
