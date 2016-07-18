const Piece = require('../piece')
const Action = require('../action')

class Tank extends Piece.baseClass {
  constructor (color, x, y, vert) {
    super(color, x, y)
    if (vert == null) vert = true

    this.type = Piece.TANK
    this.vert = vert
  }

  // Return string representation.
  toString () {
    return `t[${this.x + 1},${this.y + 1}]`
  }

  // Create a clone of this piece.
  clone () {
    return new Tank(this.color, this.x, this.y, this.vert)
  }

  // Return possible actions.
  getPossibleActions (state) {
    const actions = []

    const x = this.x
    const y = this.y

    // Create possible straight moves.
    if (this.vert) {
      actions.push(Action.createMove(this, x + 0, y - 2))
      actions.push(Action.createMove(this, x + 0, y - 1))
      actions.push(Action.createMove(this, x + 0, y + 1))
      actions.push(Action.createMove(this, x + 0, y + 2))
    } else {
      actions.push(Action.createMove(this, x - 2, y + 0))
      actions.push(Action.createMove(this, x - 1, y + 0))
      actions.push(Action.createMove(this, x + 1, y + 0))
      actions.push(Action.createMove(this, x + 2, y + 0))
    }

    // Create possible pivot moves.

    if (this.vert) {
      // (   | * |   )
      // (   | x |   )

      // ( * | x |   )    (   | * | x )    (   |   |   )    (   |   |   )
      // (   |   |   )    (   |   |   )    ( * | x |   )    (   | * | x )
      actions.push(Action.createPivot(this, x - 1, y + 0))
      actions.push(Action.createPivot(this, x + 0, y + 0))
      actions.push(Action.createPivot(this, x - 1, y + 1))
      actions.push(Action.createPivot(this, x + 0, y + 1))
    } else {
      // (   |   )
      // ( * | x )
      // (   |   )

      // ( * |   )    (   | * )    (   |   )    (   |   )
      // ( x |   )    (   | x )    ( * |   )    (   | * )
      // (   |   )    (   |   )    ( x |   )    (   | x )
      actions.push(Action.createPivot(this, x + 0, y - 1))
      actions.push(Action.createPivot(this, x + 1, y - 1))
      actions.push(Action.createPivot(this, x + 0, y + 0))
      actions.push(Action.createPivot(this, x + 1, y + 0))
    }

    // Create possible shots.
    let enemyPawn

    enemyPawn = this.findEnemyPawn(state, true)
    if (enemyPawn) {
      actions.push(Action.createShootPawn(this, enemyPawn.x, enemyPawn.y))
    }

    enemyPawn = this.findEnemyPawn(state, false)
    if (enemyPawn) {
      actions.push(Action.createShootPawn(this, enemyPawn.x, enemyPawn.y))
    }

    return actions.filter((action) =>
      this.isLegalAction(state, action)
    )
  }

  findEnemyPawn (state, up) {
    let x = this.x
    let y = this.y
    let xInc = 0
    let yInc = 0

    if (this.vert && up) {
      y -= 1
      yInc = -1
    } else if ((this.vert && !up)) {
      y += 2
      yInc = 1
    } else if ((!this.vert && up)) {
      x -= 1
      xInc = -1
    } else {
      x += 2
      xInc = 1
    }

    while (true) {
      if (!state.isValidPosition(x, y)) return null

      const piece = state.pieceAt(x, y)
      if (piece == null) {
        x += xInc
        y += yInc
        continue
      }

      if (piece.type === Piece.PAWN &&
        piece.color === Piece.oppositeColor(this.color)) {
        return {x: x, y: y}
      }

      return null
    }
  }

  // Return whether the specified action is legal.
  isLegalAction (state, action) {
    const p1x = action.x
    const p1y = action.y
    const p2x = action.x + ((this.vert) ? 0 : 1)
    const p2y = action.y + ((this.vert) ? 1 : 0)

    if (!state.isValidPosition(p1x, p1y)) return false
    if (!state.isValidPosition(p2x, p2y)) return false

    if (action.type === Action.MOVE) {
      let piece

      piece = state.pieceAt(p1x, p1y)
      if (piece != null && piece !== this) return false

      piece = state.pieceAt(p2x, p2y)
      if (piece != null || piece !== this) return false

      return true
    }

    if (action.type === Action.PIVOT) {
      if (this.vert) {
        if (!state.isValidPosition(action.x + 0, action.y)) return false
        if (!state.isValidPosition(action.x + 1, action.y)) return false

        const p1 = state.pieceAt(action.x + 0, action.y)
        const p2 = state.pieceAt(action.x + 1, action.y)

        if ((p1 == null || p1 === this) && (p2 == null || p2 === this)) return true
      } else {
        if (!state.isValidPosition(action.x, action.y + 0)) return false
        if (!state.isValidPosition(action.x, action.y + 1)) return false

        const p1 = state.pieceAt(action.x, action.y + 0)
        const p2 = state.pieceAt(action.x, action.y + 1)

        if ((p1 == null || p1 === this) && (p2 == null || p2 === this)) return true
      }

      return false
    }

    if (action.type === Action.SHOOT_PAWN) {
      return true
    }

    return false
  }
}

module.exports = Tank
