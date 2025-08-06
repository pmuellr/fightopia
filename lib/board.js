/** @import { Piece, Tank } from './pieces.js' */
/** @import { Color } from './types.ts' */
/** @import { Action } from './actions.js' */

import { createPawn, createTank, createGiant } from './pieces.js'
import { ORIENT_HOR, ORIENT_VER, COLOR_BLACK, COLOR_WHITE } from './pieces.js'
import { ANSI_BLACK_PIECE, ANSI_WHITE_PIECE, ANSI_RESET, ansiCursorUp } from './styles.js'
import { getAvailableBoardActions } from './actions.js'

export function createNewBoard() {
  const board = new Board()
  board.pieces = getInitialBoardPieces()
  board.recalcSquares()
  return board
}

export class Board {
  constructor() {
    /** @type { number } */ this.rows = 8
    /** @type { number } */ this.cols = 8

    // list of the pieces on the board
    /** @type { Piece[] } */
    this.pieces = []

    // game squares to provide piece at y, x index
    /** @type { Piece[][] } */
    this.squares = []
    for (let i = 0; i < this.rows; i++) {
      this.squares[i] = []
    }
  }

  /** @type { (color: Color) => Action[] } */
  getAvailableActions(color) {
    return getAvailableBoardActions(this, color)
  }

  // returns 0 if you lost, 1000 if you won, otherwise relative
  /** @type { (color: Color) => number } */
  score(color) {
    let score = 0

    /** @type { Piece[] } */ const giants = []
    /** @type { Piece[] } */ const tanks = []
    for (const piece of this.pieces) {
      if (piece.color !== color) continue

      if (piece.isGiant()) {
        score += 100
        giants.push(piece)
      }

      if (piece.isTank()) {
        score += 10
        tanks.push(piece)
      }

      if (piece.isPawn()) {
        score += 1
      }
    }

    // winning condition: giant made it to the other side
    if (color === COLOR_BLACK) {
      for (const giant of giants) {
        if (giant.y === 6) return 1000
      }
    } else {
      for (const giant of giants) {
        if (giant.y === 0) return 1000
      }
    }

    // losing condition: lost both tanks
    if (!tanks.length) return 0
  
    return score
  }

  /** @type { (piece: Piece, newX: number, newY: number) => void } */
  move(piece, newX, newY) {
    piece.x = newX
    piece.y = newY
    this.recalcSquares()
  }

  /** @type { (piece: Tank, newX: number, newY: number) => void } */
  moveAndPivot(piece, newX, newY) {
    piece.x = newX
    piece.y = newY
    piece.orient = piece.orient === ORIENT_HOR ? ORIENT_VER : ORIENT_HOR 
    
    this.recalcSquares()
  }

  /** @type { (target: Piece) => void } */
  shoot(target) {
    this.pieces = this.pieces.filter(p => p !== target)
    this.recalcSquares()
  }

  /** @type () => Board */
  clone() {
    const { rows, cols } = this
    const newBoard = new Board()

    newBoard.pieces = this.pieces.map(p => p.clone())
    newBoard.recalcSquares()

    return newBoard
  }

  recalcSquares() {
    this.squares = []
    for (let i = 0; i < this.rows; i++) {
      this.squares[i] = []
    }

    for (const piece of this.pieces) {
      const { x, y } = piece

      this.squares[y][x] = piece

      if (piece.isTank()) {
        if (piece.orient === ORIENT_VER) {
          this.squares[y + 1][x] = piece
        } else {
          this.squares[y][x + 1] = piece
        }
      } 
      
      if (piece.isGiant()) {
        this.squares[y + 1][x]     = piece
        this.squares[y][x + 1]     = piece
        this.squares[y + 1][x + 1] = piece
      }
    }
  }

  print() {
    for (const row of this.squares) {
      const line = []

      for (const x of row) {
        if (!x) {
          line.push('   ')
        } else {
          if (x.color === COLOR_BLACK) {
            line.push(ANSI_BLACK_PIECE)
          } else {
            line.push(ANSI_WHITE_PIECE)
          }

          if (x.isPawn())  line.push(' - ')
          if (x.isTank())  line.push(' T ')
          if (x.isGiant()) line.push(' G ')
          line.push(ANSI_RESET)
        }
      }

      console.log(line.join(''))
//      console.log(ansiCursorUp(3))
    }  
  }
}

function getInitialBoardPieces() {
  return [
    createTank( COLOR_BLACK, 0, 0, ORIENT_VER),
    createPawn( COLOR_BLACK, 1, 0),
    createPawn( COLOR_BLACK, 2, 0),
    createPawn( COLOR_BLACK, 2, 1),
    createPawn( COLOR_BLACK, 2, 2),
    createPawn( COLOR_BLACK, 3, 2),
    createGiant(COLOR_BLACK, 3, 0),
    createPawn( COLOR_BLACK, 4, 2),
    createPawn( COLOR_BLACK, 5, 2),
    createPawn( COLOR_BLACK, 5, 1),
    createPawn( COLOR_BLACK, 5, 0),
    createPawn( COLOR_BLACK, 6, 0),
    createTank( COLOR_BLACK, 7, 0, ORIENT_VER),

    createTank( COLOR_WHITE, 0, 6, ORIENT_VER),
    createPawn( COLOR_WHITE, 1, 7),
    createPawn( COLOR_WHITE, 2, 7),
    createPawn( COLOR_WHITE, 2, 6),
    createPawn( COLOR_WHITE, 2, 5),
    createPawn( COLOR_WHITE, 3, 5),
    createGiant(COLOR_WHITE, 3, 6),
    createPawn( COLOR_WHITE, 4, 5),
    createPawn( COLOR_WHITE, 5, 5),
    createPawn( COLOR_WHITE, 5, 6),
    createPawn( COLOR_WHITE, 5, 7),
    createPawn( COLOR_WHITE, 6, 7),
    createTank( COLOR_WHITE, 7, 6, ORIENT_VER),
  ]
}