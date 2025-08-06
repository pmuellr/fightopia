// for ANSI see:    https://en.wikipedia.org/wiki/ANSI_escape_code#Select_Graphic_Rendition_parameters
// for browser see: https://developer.mozilla.org/en-US/docs/Web/API/console#styling_console_output

export const ANSI_BOLD  = 1
export const ANSI_ITALIC = 2
export const ANSI_FORE_COLOR = 30
export const ANSI_BACK_COLOR = 40

export const ANSI_BLACK_PIECE = ansiColor([33, 40])
export const ANSI_WHITE_PIECE = ansiColor([30, 43])
export const ANSI_RESET       = ansiColor([0])

/** @type { (vals: number[]) => string } */
export function ansiColor(vals) {
  return `\x1B[${vals.join(';')}m`
}

/** @type { (lines: number) => string } */
export function ansiCursorUp(lines) {
  return `\x1B[${lines}F`
}
