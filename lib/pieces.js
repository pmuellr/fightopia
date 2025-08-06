/** @import { Color, Orient } from './types.ts' */
/** @import { Action } from './actions.js' */
/** @typedef { Pawn | Tank | Giant } Piece */
import { Board } from './board.js'
import { getAvailableActions as getAvailableActionsPawn } from './actions/pawn.js'
import { getAvailableActions as getAvailableActionsTank } from './actions/tank.js'
import { getAvailableActions as getAvailableActionsGiant } from './actions/giant.js'

/** @satisfies { Orient } */
export const ORIENT_HOR = 'hor'
/** @satisfies { Orient } */
export const ORIENT_VER = 'ver'

/** @satisfies { Color } */
export const COLOR_BLACK = 'black'
/** @satisfies { Color } */
export const COLOR_WHITE = 'white'

/** @type { (color: Color, x: number, y: number) => Pawn } */
export function createPawn(color, x, y) {
  return new Pawn(color, x, y)
}

/** @type { (color: Color, x: number, y: number, orient: Orient) => Tank } */
export function createTank(color, x, y, orient) {
  return new Tank(color, x, y, orient)
}

/** @type { (color: Color, x: number, col: number) => Giant } */
export function createGiant(color, x, col) {
  return new Giant(color, x, col)
}

export class BasePiece {
  /**
   * @param { Color  } color
   * @param { number } x
   * @param { number } y
   */
  constructor (color, x, y) {
    /** @type { Color } */  this.color = color
    /** @type { number } */ this.x = x
    /** @type { number } */ this.y = y
  }

  /** @type { () => BasePiece } */
  clone() { throw new Error('subclassResponsibility') }

  /** @type { () => string } */
  name() { throw new Error('subclassResponsibility') }

  /** @type { (board: Board) => Action[] } */
  getAvailableActions(board) { throw new Error('subclassResponsibility') }

  /** @type { (piece: BasePiece) => boolean } */
  isSameColor(piece) { return this.color === piece.color }

  /** @type { (piece: BasePiece) => boolean } */
  isDifferentColor(piece) { return !this.isSameColor(piece) }

  /** @type { () => this is Pawn } */
  isPawn() { return this instanceof Pawn }

  /** @type { () => this is Tank } */
  isTank() { return this instanceof Tank }

  /** @type { () => this is Giant } */
  isGiant() { return this instanceof Giant }
}

export class Pawn extends BasePiece {
  /**
   * @param { Color  } color
   * @param { number } x
   * @param { number } y
   */
  constructor(color, x, y) {
    super(color, x, y)
  }

  /** @type { () => string } */
  name() { return 'pawn' }

  /** @type { () => Pawn } */
  clone() {
    const { color, x, y } = this
    return new Pawn(color, x, y)
  }

  /** @type { (board: Board) => Action[] } */
  getAvailableActions(board) {
    return getAvailableActionsPawn(board, this)
  }
}

export class Tank extends BasePiece {
  /**
   * @param { Color  } color
   * @param { number } x
   * @param { number } y
   * @param { Orient } orient
   */
  constructor(color, x, y, orient) {
    super(color, x, y)

    /** @type { Orient } */ this.orient = orient
  }

  /** @type { () => string } */
  name() { return 'tank' }

  /** @type { () => Tank } */
  clone() {
    const { color, orient, x, y } = this
    return new Tank(color, x, y, orient)
  }

  /** @type { (board: Board) => Action[] } */
  getAvailableActions(board) {
    return getAvailableActionsTank(board, this)
  }

  /** @type { () => boolean } */
  isHorizontal() { return this.orient === ORIENT_HOR }

  /** @type { () => boolean } */
  isVertical() { return this.orient === ORIENT_VER }
}

export class Giant extends BasePiece {
  /**
   * @param { Color  } color
   * @param { number } x
   * @param { number } y
   */
  constructor(color, x, y) {
    super(color, x, y)
  }

  /** @type { () => Giant } */
  clone() {
    const { color, x, y } = this
    return new Giant(color, x, y)
  }

  /** @type { () => string } */
  name() { return 'giant' }

  /** @type { (board: Board) => Action[] } */
  getAvailableActions(board) {
     return getAvailableActionsGiant(board, this)
 }
}