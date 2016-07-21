'use strict'

exports.MOVE = 'move'
exports.KILL_TANK = 'killTank'
exports.PIVOT = 'pivot'
exports.SHOOT_PAWN = 'shootPawn'

exports.createMove = createMove
exports.createKillTank = createKillTank
exports.createPivot = createPivot
exports.createShootPawn = createShootPawn

function createMove (piece, x, y) {
  return new Action(piece, exports.MOVE, x, y)
}

function createKillTank (piece, x, y) {
  return new Action(piece, exports.KILL_TANK, x, y)
}

function createPivot (piece, x, y) {
  return new Action(piece, exports.PIVOT, x, y)
}

function createShootPawn (piece, x, y) {
  return new Action(piece, exports.SHOOT_PAWN, x, y)
}

// Models an action that a piece can make.
class Action {
  constructor (piece, type, x, y) {
    this.piece = piece
    this.type = type
    this.x = x
    this.y = y
  }

  // Return a new action that's the same as this, except that
  // it now points to the piece in specied state, that's in the
  // same location as the state of the current piece.
  swizzle (state) {
    const newPiece = state.pieceAt(this.piece.x, this.piece.y)
    return new Action(newPiece, this.type, this.x, this.y)
  }

  // Perform the action on a state, mutating it.
  perform (state) {
    if (this.type === exports.MOVE) {
      this.piece.x = this.x
      this.piece.y = this.y
      return
    }

    if (this.type === exports.KILL_TANK) {
      const tank = state.pieceAt(this.x, this.y)
      state.pieces.delete(tank)
      return
    }

    if (this.type === exports.SHOOT_PAWN) {
      const pawn = state.pieceAt(this.x, this.y)
      state.pieces.delete(pawn)
      return
    }

    if (this.type === exports.PIVOT) {
      this.piece.x = this.x
      this.piece.y = this.y
      this.piece.vert = !this.piece.vert
      return
    }
  }

  toString () {
    return `${this.piece.toString()} ${this.type} [${this.x + 1}, ${this.y + 1}]`
  }
}
