'use strict'

// const util = require('./util')

const Piece = require('./piece')

exports.createInitial = createInitial
exports.ROWS = 8
exports.COLS = 8

// Create a new game state.
function createInitial () {
  const state = new State()
  setInitialPieces(state)
  return state
}

// Models a game state.
class State {
  constructor () {
    this.actor = null
    this.pieces = new Set()
  }

  // Make a copy of this state.
  clone () {
    const result = new State()

    result.actor = this.actor

    this.pieces = util.cloneSet(this.pieces)

    return result
  }

  // Return the current player
  getCurrentActor () {
    return this.actor
  }

  // Return an array of possible actions at this state.
  getPossibleActions () {
    const actorPieces = Array.from(this.pieces).filter((piece) =>
      this.actor === piece.color
    )

    const actions = []

    actorPieces.forEach((piece) => {
      piece.getPossibleActions(this).forEach((pieceAction) => {
        actions.push(pieceAction)
      })
    })

    return actions
  }

  // Return an array of preferred actions at this state.
  // This method is optional, and only used for the simulation phase.
  getPreferredActions () {
    return this.possibleActions.filter((action) => {
      const piece = action.getPiece(this)

      // a bunch of obvious preferences
      if (action.type === Piece.KILL_TANK) return true
      if (action.type === Piece.SHOOT_PAWN) return true
      if (action.type === Piece.PIVOT) return false

      // check for GINT moving to other side (winning condition)
      if (action.type !== Piece.MOVE) return false
      if (piece.type !== Piece.GINT) return false

      if (this.actor === Piece.BLACK) {
        if (action.y === exports.ROWS - 2) return true
      } else {
        if (action.y === 0) return true
      }

      return false
    })
  }

  // Update the game state with the specified action.
  performAction (action) {
    action.perform(this)
    this.actor = Piece.oppositeColor(this.actor)
  }

  // Return null if game not finished, or the finished state.
  isFinished () {
    let tanksB = 0
    let tanksW = 0

    for (let i = 0; i < this.pieces.length; i++) {
      let piece = this.pieces[i]

      if (piece.type === Piece.TANK) {
        (piece.color === Piece.BLACK) ? tanksB++ : tanksW++
      }

      if (piece.type === Piece.GINT) {
        if (piece.color === Piece.BLACK) {
          if (piece.y === exports.ROWS - 2) return Piece.BLACK
        } else {
          if (piece.y === 0) return Piece.WHITE
        }
      }
    }

    if (tanksB === 0) return Piece.WHITE
    if (tanksW === 0) return Piece.BLACK

    return null
  }

  // Delete the piece form the set of pieces.
  deletePiece (piece) {
    this.pieces.delete(piece)
  }

  // Return whether specified location is valid.
  isValidPosition (x, y) {
    if (x < 0) return false
    if (y < 0) return false
    if (x >= exports.COLS) return false
    if (y >= exports.ROWS) return false

    return true
  }

  // Return the piece at the specified position.
  getPieceAt (x, y) {
    if (!this.isValidPosition(x, y)) return null

    for (let piece of this.pieces) {
      let px1 = piece.x
      let py1 = piece.y

      if (piece.type === Piece.PAWN) {
        if (x === px1 && y === py1) return piece
      }

      if (piece.type === Piece.TANK) {
        let px2 = px1
        let py2 = py1

        piece.vert ? py2++ : px2++

        if (x === px1 && y === py1) return piece
        if (x === px2 && y === py2) return piece
      }

      if (piece.type === Piece.GINT) {
        let px2 = px1 + 1
        let py2 = py1
        let px3 = px1
        let py3 = py1 + 1
        let px4 = px1 + 1
        let py4 = py1 + 1

        if (x === px1 && y === py1) return piece
        if (x === px2 && y === py2) return piece
        if (x === px3 && y === py3) return piece
        if (x === px4 && y === py4) return piece
      }
    }

    return null
  }

  // Print the state to stdout.
  print () {
    const board = []

    for (let y = 0; y < exports.ROWS; y++) {
      const row = []
      for (let x = 0; x < exports.COLS; x++) {
        const piece = this.pieceAt(x, y)

        if (piece == null) {
          row.push(' ')
        } else if (piece.color === Piece.BLACK) {
          if (piece.type === Piece.PAWN) row.push('◼︎')
          if (piece.type === Piece.TANK) row.push('▶︎')
          if (piece.type === Piece.GINT) row.push('➍')
        } else {
          if (piece.type === Piece.PAWN) row.push('◻︎')
          if (piece.type === Piece.TANK) row.push('▷')
          if (piece.type === Piece.GINT) row.push('➃')
        }
      }

      board.push(row.join(' '))
    }

    console.log(board.join('\n'))
    console.log('┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈')
  }
}

// Initialize a new state with pieces in the initial places.
function setInitialPieces (state) {
  const init = [
    'tppg ppt',
    '  p  p  ',
    '  pppp  ',
    '        ',
    '        ',
    '  PPPP  ',
    'T PG P T',
    ' PP  PP '
  ].map((s) => s.split(''))

  state.actor = Piece.BLACK

  for (let y = 0; y < init.length; y++) {
    const row = init[y]
    for (let x = 0; x < row.length; x++) {
      const item = row[x]

      let piece
      if (item === ' ') continue
      else if (item === 'p') piece = Piece.create(Piece.PAWN, Piece.BLACK, x, y)
      else if (item === 't') piece = Piece.create(Piece.TANK, Piece.BLACK, x, y)
      else if (item === 'g') piece = Piece.create(Piece.GINT, Piece.BLACK, x, y)
      else if (item === 'P') piece = Piece.create(Piece.PAWN, Piece.WHITE, x, y)
      else if (item === 'T') piece = Piece.create(Piece.TANK, Piece.WHITE, x, y)
      else if (item === 'G') piece = Piece.create(Piece.GINT, Piece.WHITE, x, y)

      if (piece != null) state.pieces.add(piece)
    }
  }
}
