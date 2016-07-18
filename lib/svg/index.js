'use strict'

const jQuery = require('jquery')

const Piece = require('../piece')

exports.createBoardElement = createBoardElement
exports.updateBoardElement = updateBoardElement

// Create a new DOM element for a board.
function createBoardElement (state, px) {
  px = px || 600
  const el = jQuery(`<div width="${px}" height="${px}"></div>`)[0]

  const html = []

  html.push(`<svg width="${px}" height="${px}">`)
  html.push(`<g width="${px}" height="${px}">`)
  html.push('<rect class="board"></rect>')

  for (let row = 0; row < state.rows; row++) {
    const offset = row % 2
    const y = row * 100 / state.rows
    for (let col = 0; col < state.cols; col += 2) {
      const x = (col + offset) * 100 / state.cols
      html.push(`<rect class="red-square" x="${x}%" y="${y}%"></rect>`)
    }
  }

  html.push('</g>')
  html.push(`<g class="pieces" width="${px}" height="${px}"></g>`)
  html.push('</svg>')

  jQuery(el).append(html.join('\n'))

  updateBoardElement(el, state)

  return el
}

// Update an existing DOM elemnt for a board with a new state.
function updateBoardElement (el, state) {
  jQuery('g.pieces', el).empty()

  const html = []

  // 6.25       18.75       31.25       43.75       56.25       68.75       81.25       93.75
  //      12.50       25.00       37.50       50.00       62.50       75.00       87.50       100.0

  for (let piece of state.pieces) {
    if (piece.type === Piece.PAWN) {
      const offsetX = 50 / state.cols
      const offsetY = 50 / state.rows
      const x = offsetX + piece.x * 100 / state.cols
      const y = offsetY + piece.y * 100 / state.rows
      const r = (50 / state.cols) * 5 / 6.25

      html.push(`<circle class="${piece.color}" cx="${x}%" cy="${y}%" r="${r}%"></circle>`)
    }

    if (piece.type === Piece.TANK) {
      let offsetX, offsetY
      let x, y
      let rx, ry

      if (piece.vert) {
        offsetX = 50 / state.cols
        offsetY = 100 / state.rows
        x = offsetX + piece.x * 100 / state.cols
        y = offsetY + piece.y * 100 / state.rows
        rx = offsetX * 5 * 1 / 6.25
        ry = offsetX * 5 * 2 / 6.25
      } else {
        offsetX = 100 / state.cols
        offsetY = 50 / state.rows
        x = offsetX + piece.x * 100 / state.cols
        y = offsetY + piece.y * 100 / state.rows
        rx = offsetY * 5 * 2 / 6.25
        ry = offsetY * 5 * 1 / 6.25
      }

      html.push(`<ellipse class="${piece.color}" cx="${x}%" cy="${y}%" rx="${rx}%" ry="${ry}%"></ellipse>`)
    }

    if (piece.type === Piece.GINT) {
      const offsetX = 100 / state.cols
      const offsetY = 100 / state.rows
      const x = offsetX + piece.x * 100 / state.cols
      const y = offsetY + piece.y * 100 / state.rows
      const r = (100 / state.cols) * 5 / 6.25

      html.push(`<circle class="${piece.color}" cx="${x}%" cy="${y}%" r="${r}%"></circle>`)
    }
  }

  jQuery('g.pieces', el).append(html.join('\n'))
  jQuery(el).html(jQuery(el).html()) // refresh the HTML sigh
}
