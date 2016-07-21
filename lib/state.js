'use strict'

// const util = require('./util')

const Piece = require('./piece')

exports.createInitial = createInitial

// Create a new game state.
function createInitial () {
  const state = new State()
  setInitialPieces(state)
  return state
}

// Models a game state.
class State {
  constructor () {
    this.rows = 8
    this.cols = 8
    this.player = null
    this.pieces = new Set()
  }

  // Make a copy of this state.
  clone () {
    const result = new State()

    result.player = this.player

    this.pieces.forEach((piece) =>
      result.pieces.add(piece.clone())
    )

    return result
  }

  // Return an array of possible actions at this state.
  possibleActions () {
    const pieces = Array.from(this.pieces).filter((piece) =>
      this.player === piece.color
    )

    const actions = []
    pieces.forEach((piece) => {
      piece.getPossibleActions(this).forEach((pieceAction) => {
        actions.push(pieceAction)
      })
    })

    return actions
  }

  // Update the game state with the specified action.
  performAction (action) {
    action = action.swizzle(this)
    action.perform(this)
    this.player = Piece.oppositeColor(this.player)
    this.recalcBoard()
  }

  // Return the current player
  currentPlayer () {
    return this.player
  }

  // Return the winning player, if any.
  winner () {
    let tanksB = 0
    let tanksW = 0

    for (let piece of this.pieces) {
      if (piece.type === Piece.TANK) {
        (piece.color === Piece.BLACK) ? tanksB++ : tanksW++
      }

      if (piece.type === Piece.GINT) {
        if (piece.color === Piece.BLACK) {
          if (piece.y === this.rows - 2) return Piece.BLACK
        } else {
          if (piece.y === 0) return Piece.WHITE
        }
      }
    }

    if (tanksB === 0) return Piece.WHITE
    if (tanksW === 0) return Piece.BLACK

    return null
  }

  // Return whether specified location is valid.
  isValidPosition (x, y) {
    if (x < 0) return false
    if (y < 0) return false
    if (x >= this.cols) return false
    if (y >= this.rows) return false

    return true
  }

  // Return the piece at the specified position.
  pieceAt (x, y) {
    // if (!this.isValidPosition(x, y)) return null

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

  // Recalculate the board.
  recalcBoard () {
  }

  // Print the state to stdout.
  print () {
    const board = []

    for (let y = 0; y < this.rows; y++) {
      const row = []
      for (let x = 0; x < this.cols; x++) {
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

  state.player = Piece.BLACK

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

  state.recalcBoard()
}
