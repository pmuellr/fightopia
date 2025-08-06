/** @import { Tank } from '../pieces.js' */
/** @import { Board } from '../board.js' */
/** @import { Action } from '../actions.js' */

import { MoveAction, PivotAction } from '../actions.js';

/** @type { (board: Board, piece: Tank) => Action[] }  */
export function getAvailableActions(board, piece) {
  const { x, y } = piece
  const isHorizontal = piece.isHorizontal()
  const { rows, cols } = board
  /** @type { Action[] } */
  const actions = []

  // moves

  for (let d = -2; d <= 2; d++) {
    if (d === 0) continue

    const square = (isHorizontal) ? [x+d, y] : [x, y+d]

    if (!isValidSquare(board, piece, isHorizontal, square)) {
      continue
    }
      
    const [ nx, ny ] = square
    actions.push(new MoveAction({ piece, x: nx, y: ny }))
  }

  // pivots

  /** @type { number[][] } */
  const squares = []

  if (isHorizontal) {
    squares.push([x, y-1], [x+1, y-1], [x, y], [x+1, y])
  } else {
    squares.push([x-1, y], [x, y], [x-1, y+1], [x, y+1])
  }

  for (const square of squares) {
    if (!isValidSquare(board, piece, !isHorizontal, square)) {
      continue
    }

    const [ px, py ] = square
    actions.push(new PivotAction({ piece, x: px, y: py }))
  }

  // shoots
  return actions
}

/** @type (board: Board, piece: Tank, isHorizontal: boolean, square: number[]) => boolean */
function isValidSquare(board, piece, isHorizontal, square) {
  const { rows, cols } = board
  const squares = [square]
  if (isHorizontal) {
    squares.push([square[0] + 1, square[1]])
  } else {
    squares.push([square[0], square[1] + 1])
  }

  for (const sq of squares) {
    const [ax, ay] = sq

    if (ax < 0 || ax >= cols) return false
    if (ay < 0 || ay >= rows) return false

    const hit = board.squares[ay][ax]
    if (hit && hit !== piece) return false
  }

  return true
}