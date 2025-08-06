/** @import { Giant } from '../pieces.js' */
/** @import { Board } from '../board.js' */
/** @import { Action } from '../actions.js' */

import { MoveAction } from '../actions.js';

/** @type { (board: Board, piece: Giant) => Action[] }  */
export function getAvailableActions(board, piece) {
  const { x, y } = piece
  const { rows, cols } = board
  /** @type { Action[] } */
  const actions = []

  // moves

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue

      const square = [x + dx, y + dy]

      if (!isValidSquare(board, piece, square)) {
        continue
      }

      const [ gx, gy ] = square
      actions.push(new MoveAction({ piece, x: gx, y: gy }))

    }
  }

  // shoots
  return actions
}

/** @type (board: Board, piece: Giant, square: number[]) => boolean */
function isValidSquare(board, piece, square) {
  const { rows, cols } = board
  const squares = [square]
  squares.push([square[0] + 1, square[1]])
  squares.push([square[0],     square[1] + 1])
  squares.push([square[0] + 1, square[1] + 1])

  for (const sq of squares) {
    const [ax, ay] = sq

    if (ax < 0 || ax >= cols) return false
    if (ay < 0 || ay >= rows) return false

    const hit = board.squares[ay][ax]
    if (hit && hit !== piece) return false
  }

  return true
}