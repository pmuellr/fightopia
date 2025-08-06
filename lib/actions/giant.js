/** @import { Giant } from '../pieces.js' */
/** @import { Board } from '../board.js' */
/** @import { Action } from '../actions.js' */

import { MoveAction, ShootAction } from '../actions.js';

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

      if (!isValidMoveableSquare(board, piece, square)) {
        continue
      }

      const [ gx, gy ] = square
      actions.push(new MoveAction({ piece, x: gx, y: gy }))

    }
  }

  // shoots
  /*
        -1  0   +1  +2
   -1 | . | s | s | . |
    0 | s | G | G | s |
   +1 | s | G | G | s |
   +2 | . | s | s | . |

   == [ 
        [x+0,y-1], [x+1,y-1], 
        [x+0,y+2], [x+1,y+2], 
        [x-1,y+0], [x-1,y+1], 
        [x+2,y+0], [x+2,y+1], 
      ]
  */

  /** @type { number[][] } */
  const shotsAt = [
    [x+0,y-1], [x+1,y-1], 
    [x+0,y+2], [x+1,y+2], 
    [x-1,y+0], [x-1,y+1], 
    [x+2,y+0], [x+2,y+1], 
  ].filter(([sx, sy]) => {
    if (sx < 0 || sx >= cols) return false
    if (sy < 0 || sy >= rows) return false
    const target = board.squares[sy][sx]
    if (!target) return false
    if (target.isSameColor(piece)) return false
    if (!target.isTank()) return false
    return true
  })

  for (const shotAt of shotsAt) {
    const [sx, sy] = shotAt
    const target = board.squares[sy][sx]
    actions.push(new ShootAction({ piece, target}))
  }

  return actions
}

/** @type (board: Board, piece: Giant, square: number[]) => boolean */
function isValidMoveableSquare(board, piece, square) {
  const { rows, cols } = board
  const [ x, y ] = square
  const squares = [square]
  squares.push([x + 1, y])
  squares.push([x,     y + 1])
  squares.push([x + 1, y + 1])

  for (const sq of squares) {
    const [ax, ay] = sq

    if (ax < 0 || ax >= cols) return false
    if (ay < 0 || ay >= rows) return false

    const hit = board.squares[ay][ax]
    if (hit && hit !== piece) return false
  }

  return true
}