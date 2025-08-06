/** @import { Tank, Piece } from '../pieces.js' */
/** @import { Board } from '../board.js' */
/** @import { Action } from '../actions.js' */

import { MoveAction, PivotAction, ShootAction } from '../actions.js';

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

    if (!isValidMoveableSquare(board, piece, isHorizontal, square)) {
      continue
    }
      
    const [ nx, ny ] = square
    actions.push(new MoveAction({ piece, x: nx, y: ny }))
  }

  // pivots

  /* 
  horizontal pivot to vertical
       0 +1      0 +1     0 +1     0 +1     0 +1      
   -1 |.|.|     |N|.|    |.|N|    |.|.|    |.|.| -1
    0 |O|o| =>  |n|.| or |.|n| or |N|.| or |.|N|  0
   +1 |.|.|     |.|.|    |.|.|    |n|.|    |.|n| +1

   == [x+0,y-1], [x+1,y-1], [x+0,y+0], [x+1,y+0]

  vertical pivot to horizontal
      -1 0 +1     -1 0 +1    -1 0 +1    -1 0 +1    -1 0 +1
    0 |.|O|.| =>  |N|n|.| or |.|N|n| or |.|.|.| or |.|.|.|  0
   +1 |.|o|.|     |.|.|.|    |.|.|.|    |N|n|.|    |.|N|n| +1

   == [x-1,y+0], [x+0,y+0], [x-1, y+1], [x+0,y+1]
  */

  /** @type { number[][] } */
  const pivotedTo = isHorizontal 
    ? [[x, y-1], [x+1, y-1], [x, y], [x+1, y]]
    : [[x-1, y], [x, y], [x-1, y+1], [x, y+1]]
  
  for (const square of pivotedTo) {
    if (!isValidMoveableSquare(board, piece, !isHorizontal, square)) {
      continue
    }

    const [ px, py ] = square
    actions.push(new PivotAction({ piece, x: px, y: py }))
  }

  // shoots
  if (isHorizontal) {
    // shoot left
    for (let sx = x-1; sx > 0; sx--) {
      const target = board.squares[y][sx]
      if (!target) continue
      if (isValidShot(board, piece, target)) {
        actions.push(new ShootAction({ piece, target}))
        break
      }
    }

    // shoot right
    for (let sx = x+2; sx < cols; sx++) {
      const target = board.squares[y][sx]
      if (!target) continue
      if (isValidShot(board, piece, target)) {
        actions.push(new ShootAction({ piece, target}))
        break
      }
    }

  } else {
    // shoot up
    for (let sy = y-1; sy > 0; sy--) {
      const target = board.squares[sy][x]
      if (!target) continue
      if (isValidShot(board, piece, target)) {
        actions.push(new ShootAction({ piece, target}))
        break
      }
    }

    // shoot down
    for (let sy = y+2; sy > rows; sy++) {
      const target = board.squares[sy][x]
      if (!target) continue
      if (isValidShot(board, piece, target)) {
        actions.push(new ShootAction({ piece, target}))
        break
      }
    }
  }

  return actions
}

/** @type (board: Board, piece: Tank, target: Piece) => boolean */
function isValidShot(board, piece, target) {
  if (target.isSameColor(piece)) return false
  if (!target.isPawn()) return false
  return true
}

/** @type (board: Board, piece: Tank, isHorizontal: boolean, square: number[]) => boolean */
function isValidMoveableSquare(board, piece, isHorizontal, square) {
  const { rows, cols } = board
  const [x, y] = square
  const squares = [square]
  if (isHorizontal) {
    squares.push([x + 1, y])
  } else {
    squares.push([x, y + 1])
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