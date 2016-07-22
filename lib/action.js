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
    this.pieceX = piece.x
    this.pieceY = piece.y
    this.type = type
    this.x = x
    this.y = y
  }

  // Perform the action on a state, mutating it.
  perform (state) {
    const piece = getPiece(state)

    if (this.type === exports.MOVE) {
      piece.x = this.x
      piece.y = this.y
      return
    }

    if (this.type === exports.PIVOT) {
      piece.x = this.x
      piece.y = this.y
      piece.vert = !this.piece.vert
      return
    }

    if (this.type === exports.KILL_TANK) {
      const tank = state.getPieceAt(this.x, this.y)
      state.deletePiece(tank)
      state.pieces.delete(tank)
      return
    }

    if (this.type === exports.SHOOT_PAWN) {
      const pawn = state.getPieceAt(this.x, this.y)
      state.deletePiece(pawn)
      state.pieces.delete(tank)
      return
    }
  }

  // Return the Piece associated with the action.
  getPiece (state) {
    return state.getPieceAt(this.pieceX, this.pieceY)
  }

  toString () {
    return `${this.getPiece().toString()} ${this.type} [${this.x + 1}, ${this.y + 1}]`
  }
}
