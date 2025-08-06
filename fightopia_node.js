#!/usr/bin/env node

import { createNewBoard } from './lib/board.js'
import { COLOR_BLACK, COLOR_WHITE } from './lib/pieces.js'

for (let i=0; i<10; i++) {
  console.log()
}

const board = createNewBoard()
board.print()

for (let i=0; i<10000; i++) {
  const color = i % 2 ? COLOR_WHITE : COLOR_BLACK
  const actions = board.getAvailableActions(color)
  const action = actions[getRandomInt(actions.length)] 
  console.log('')
  console.log(`-------- ${i} --------`)
  console.log(action.toString())
  action.perform(board)
  board.print()
  // @ts-ignore
  await new Promise((resolve => setTimeout(resolve, 100)))
}

/** @type { (max: number): number } */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}