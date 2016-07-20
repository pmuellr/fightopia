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
    this.board = null
  }

  // Make a copy of this state.
  clone () {
    const result = new State()

    result.player = this.player

    for (let piece of this.pieces) {
      result.pieces.add(piece.clone())
    }

    result.recalcBoard()
    return result
  }

  // Return an array of possible actions at this state.
  possibleActions () {
    const pieces = Array.from(this.pieces).filter((piece) =>
      this.player === piece.color
    )

    const actions = []
    for (let piece of pieces) {
      for (let pieceAction of piece.getPossibleActions(this)) {
        actions.push(pieceAction)
      }
    }

    return actions
  }

  // Update the game state with the specified action.
  performAction (action) {
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
        continue
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
    if (!this.isValidPosition(x, y)) return null
    return this.board[y][x]
  }

  // Recalculate the board.
  recalcBoard () {
    this.board = []
    for (let y = 0; y < this.rows; y++) {
      this.board.push([])
      for (let x = 0; x < this.cols; x++) {
        this.board[this.board.length - 1].push(null)
      }
    }

    for (let piece of this.pieces) {
      // PAWN
      if (piece.type === Piece.PAWN) {
        this.board[piece.y][piece.x] = piece
      // TANK
      } else if (piece.type === Piece.TANK) {
        if (piece.vert) {
          this.board[piece.y + 0][piece.x] = piece
          this.board[piece.y + 1][piece.x] = piece
        } else {
          this.board[piece.y][piece.x + 0] = piece
          this.board[piece.y][piece.x + 1] = piece
        }
      // GINT
      } else {
        this.board[piece.y + 0][piece.x + 0] = piece
        this.board[piece.y + 0][piece.x + 1] = piece
        this.board[piece.y + 1][piece.x + 0] = piece
        this.board[piece.y + 1][piece.x + 1] = piece
      }
    }
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
