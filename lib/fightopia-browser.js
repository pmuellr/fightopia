'use strict'

const jQuery = require('jquery')

const svg = require('./svg')
// const Piece = require('./piece')
const fightopia = require('../fightopia')

let gameEL
let gameState = fightopia.createNewState()
// let gameInterval

jQuery(onLoad)

// Code to run when document is loaded.
function onLoad () {
  console.log('onLoad()!')
  gameEL = svg.createBoardElement(gameState)

  jQuery('body').append(gameEL)

  console.profile()
  while (performAnAction()) {}
  console.profileEnd()

  svg.updateBoardElement(gameEL, gameState)
}

// Perform an action.
function performAnAction () {
  const actions = gameState.getPossibleActions()
  const rindex = Math.floor(actions.length * Math.random())
  const action = actions[rindex]

  // console.log(`action: ${action}`)
  gameState = gameState.performAction(action)
  // svg.updateBoardElement(gameEL, gameState)

  if (gameState.winner()) {
    return false
  }

  return true
}
