'use strict'

const Piece = require('../piece')
const Action = require('../action')

class Gint extends Piece.baseClass {
  constructor (color, x, y) {
    super(color, x, y)

    this.type = Piece.GINT
  }

  // Return string representation.
  toString () {
    return `g[${this.x + 1},${this.y + 1}]`
  }

  // Create a clone of this piece.
  clone () {
    return new Gint(this.color, this.x, this.y)
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

    let tank
    const color = Piece.oppositeColor(this.color)

    tank = getTank(state, color, -1, 0)
    if (tank) actions.push(Action.createKillTank(this, tank.x, tank.y))
    tank = getTank(state, color, -1, 1)
    if (tank) actions.push(Action.createKillTank(this, tank.x, tank.y))

    tank = getTank(state, color, 0, -1)
    if (tank) actions.push(Action.createKillTank(this, tank.x, tank.y))
    tank = getTank(state, color, 1, -1)
    if (tank) actions.push(Action.createKillTank(this, tank.x, tank.y))

    tank = getTank(state, color, 2, 0)
    if (tank) actions.push(Action.createKillTank(this, tank.x, tank.y))
    tank = getTank(state, color, 2, 1)
    if (tank) actions.push(Action.createKillTank(this, tank.x, tank.y))

    tank = getTank(state, color, 0, 2)
    if (tank) actions.push(Action.createKillTank(this, tank.x, tank.y))
    tank = getTank(state, color, 1, 2)
    if (tank) actions.push(Action.createKillTank(this, tank.x, tank.y))

    return actions.filter((action) =>
      this.isLegalAction(state, action)
    )
  }

  // Return whether the specified action is legal.
  isLegalAction (state, action) {
    if (action.type === Action.KILL_TANK) return true

    if (!state.isValidPosition(action.x + 0, action.y + 0)) return false
    if (!state.isValidPosition(action.x + 0, action.y + 1)) return false
    if (!state.isValidPosition(action.x + 1, action.y + 0)) return false
    if (!state.isValidPosition(action.x + 1, action.y + 1)) return false

    const otherPiece1 = state.pieceAt(action.x + 0, action.y + 0)
    const otherPiece2 = state.pieceAt(action.x + 0, action.y + 1)
    const otherPiece3 = state.pieceAt(action.x + 1, action.y + 0)
    const otherPiece4 = state.pieceAt(action.x + 1, action.y + 1)
    if (otherPiece1 != null && otherPiece1 !== this) return false
    if (otherPiece2 != null && otherPiece2 !== this) return false
    if (otherPiece3 != null && otherPiece3 !== this) return false
    if (otherPiece4 != null && otherPiece4 !== this) return false

    return true
  }
}

// Return position of enemy tank if found part at x, y
function getTank (state, color, x, y) {
  const tank = state.pieceAt(x, y)
  if (tank == null) return null
  if (tank.color !== color) return null
  if (tank.type !== Piece.TANK) return null

  return { x: x, y: y }
}

module.exports = Gint
