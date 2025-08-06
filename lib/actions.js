/** @import { Piece, Tank } from './pieces.js' */
/** @import { Board } from './board.js' */
/** @import { Color } from './types.ts' */

/** @typedef { MoveAction | PivotAction | ShootAction } Action */

/** @type { (board: Board, color: Color ) => Action[] }  */
export function getAvailableBoardActions(board, color) {
  /** @type { Action [][] } */
  const result = []

  for (const piece of board.pieces) {
    if (piece.color !== color) continue
    result.push(getAvailablePieceActions(board, piece))
  }

  // @ts-ignore
  return result.flat()
}

/** @type { (board: Board, piece: Piece) => Action[] }  */
export function getAvailablePieceActions(board, piece) {
  return piece.getAvailableActions(board)
}

export class MoveAction {
  /** @param { { piece: Piece, x: number, y: number } } args */  
  constructor(args) {
    this.piece = args.piece /** @type { Piece } */
    this.x = args.x     /** @type { number } */
    this.y = args.y     /** @type { number } */
  }
  
  /** @type { (board: Board) => void }  */
  perform(board) {
    const { piece, x, y } = this
    board.move(piece, x, y)
  }

  /** @type { () => string }  */
  toString() {
    const { piece, x, y } = this
    return `move ${piece.name()}[${piece.x},${piece.y}] to [${x},${y}]`
  }
}

export class PivotAction {
  /** @param { { piece: Tank, x: number, y: number } } args */  
  constructor(args) {
    this.piece = args.piece  /** @type { Tank } */
    this.x = args.x          /** @type { number } */
    this.y = args.y          /** @type { number } */
    this.piece.pivot()
  }

  /** @type { (board: Board) => void }  */
  perform(board) {
    const { piece, x, y } = this
    if (!piece.isTank()) throw new Error('only tanks can pivot')
    
    piece.pivot()
    board.move(piece, x, y)
  }

  /** @type { () => string }  */
  toString() {
    const { piece, x, y } = this
    return `pivot ${piece.name()}[${piece.x},${piece.y},${piece.orient}] to [${x},${y}]`
  }
}

export class ShootAction {
  /** @param { { piece: Piece, target: Piece } } args */  
  constructor(args) {
    this.piece = args.piece    /** @type { Piece } */
    this.target = args.target  /** @type { Piece } */
  }

  /** @type { (board: Board) => void }  */
  perform(board) {
    const { piece, target } = this
    if (piece.isTank() && !target.isPawn()) throw new Error('tanks can only shoot pawns')
    if (piece.isGiant() && !target.isTank()) throw new Error('giants can only shoot tanks')
    if (piece.isPawn()) throw new Error('pawns cannot shoot')

    board.shoot(target)
  }
  /** @type { () => string }  */
  toString() {
    const { piece, target } = this
    const { x: px, y: py } = piece
    const { x: tx, y: ty } = target
    return `shoot ${piece.name()}[${px},${py}] at ${target.name()}[${tx},${ty}]`
  }
}
