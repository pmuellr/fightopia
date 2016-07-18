const Piece = require('../piece')
const Action = require('../action')

class Pawn extends Piece.baseClass {
  constructor (color, x, y) {
    super(color, x, y)

    this.type = Piece.PAWN
  }

  // Return string representation.
  toString () {
    return `p[${this.x + 1},${this.y + 1}]`
  }

  // Create a clone of this piece.
  clone () {
    return new Pawn(this.color, this.x, this.y)
  }

  // Return possible actions.
  getPossibleActions (state) {
    const actions = []

    const x = this.x
    const y = this.y

    actions.push(Action.createMove(this, x + 0, y - 1))
    actions.push(Action.createMove(this, x + 1, y - 1))
    actions.push(Action.createMove(this, x + 1, y + 0))
    actions.push(Action.createMove(this, x + 1, y + 1))
    actions.push(Action.createMove(this, x + 0, y + 1))
    actions.push(Action.createMove(this, x - 1, y + 1))
    actions.push(Action.createMove(this, x - 1, y + 0))
    actions.push(Action.createMove(this, x - 1, y - 1))

    return actions.filter((action) =>
      this.isLegalAction(state, action)
    )
  }

  // Return whether the specified action is legal.
  isLegalAction (state, action) {
    if (!state.isValidPosition(action.x, action.y)) return false

    const otherPiece = state.pieceAt(action.x, action.y)
    if (otherPiece == null) return true

    return false
  }
}

module.exports = Pawn
