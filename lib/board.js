'use strict'

const Piece = require('./piece')

exports.create = create

// Create a new board.
function create () {
  return new Board()
}

// Models a board.
class Board {
  constructor () {
    this.rows = 8
    this.cols = 8
    this.pieces = new Set()
    this.initPieces()
  }

  // Initialize a new board with pieces in the initial places.
  initPieces () {
    const init = initialBoard()

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

        if (piece != null) this.pieces.add(piece)
      }
    }
  }

  // Print the board to stdout
  print () {
    const board = new Array(this.rows)

    for (let r = 0; r < board.length; r++) {
      board[r] = new Array(this.cols)
      for (let x = 0; x < this.cols; x++) {
        board[r][x] = ' '
      }
    }

    for (let piece of this.pieces) {
      let char
      if (piece.type === Piece.PAWN && piece.color === Piece.BLACK) char = 'p'
      if (piece.type === Piece.TANK && piece.color === Piece.BLACK) char = 't'
      if (piece.type === Piece.GINT && piece.color === Piece.BLACK) char = 'g'
      if (piece.type === Piece.PAWN && piece.color === Piece.WHITE) char = 'P'
      if (piece.type === Piece.TANK && piece.color === Piece.WHITE) char = 'T'
      if (piece.type === Piece.GINT && piece.color === Piece.WHITE) char = 'G'

      if (piece.type === Piece.PAWN) {
        board[piece.y][piece.x] = char
      }

      if (piece.type === Piece.TANK) {
        board[piece.y][piece.x] = char
        if (piece.vert) {
          board[piece.y + 1][piece.x + 0] = char
        } else {
          board[piece.y + 0][piece.x + 1] = char
        }
      }

      if (piece.type === Piece.GINT) {
        board[piece.y + 0][piece.x + 0] = char
        board[piece.y + 1][piece.x + 0] = char
        board[piece.y + 0][piece.x + 1] = char
        board[piece.y + 1][piece.x + 1] = char
      }
    }

    for (let row of board) {
      console.log(row.join(' '))
    }
    console.log()
  }
}

// Describes the board in a text notation.
function initialBoard () {
  return [
    'tppg ppt',
    '  p  p  ',
    '  pppp  ',
    '        ',
    '        ',
    '  PPPP  ',
    'T PG P T',
    ' PP  PP '
  ].map((s) => s.split(''))
}

// Run a simple test.
function test () {
  const board = new Board()
  board.print()
}

// If this is the main module, run a simple test.
if (require.main === module) test()
