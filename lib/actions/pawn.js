/** @import { Pawn } from '../pieces.js' */
/** @import { Board } from '../board.js' */
/** @import { Action } from '../actions.js' */

import { MoveAction } from '../actions.js';

/** @type { (board: Board, piece: Pawn) => Action[] }  */
export function getAvailableActions(board, piece) {
  const { x, y } = piece
  const { rows, cols } = board
  /** @type { Action[] } */
  const actions = []

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;

      const tx = x + dx
      const ty = y + dy
      if (tx < 0 || tx >= cols) continue;
      if (ty < 0 || ty >= rows) continue;

      const hit = board.squares[ty][tx]
      if (hit) continue

      actions.push(new MoveAction({ piece, x: tx, y: ty }))
    }
  }

  return actions
}