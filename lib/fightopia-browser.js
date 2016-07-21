'use strict'

const jQuery = require('jquery')

const svg = require('./svg')
const mcts = require('./mcts')
const Piece = require('./piece')
const fightopia = require('../fightopia')

const ROUNDS = 100

let gameEL
let gameState = fightopia.createNewState()
// let gameInterval

jQuery(onLoad)

// Code to run when document is loaded.
function onLoad () {
  gameEL = svg.createBoardElement(gameState)

  jQuery('body').append(gameEL)

  setTimeout(performAnAction, 200)
}

// Perform an action.
function performAnAction () {
  let action
  const player = gameState.currentPlayer()

  if (player === Piece.BLACK) {
    action = getMCTSAction(gameState, player)
  } else {
    action = getRandomAction(gameState, player)
  }

  gameState = gameState.clone()
  gameState.performAction(action)

  svg.updateBoardElement(gameEL, gameState)

  if (gameState.winner()) {
    alert(`winner: ${gameState.winner()}`)
    return
  }

  setTimeout(performAnAction, 10)
}

function getMCTSAction (gameState, player) {
  return mcts.findAction(gameState, ROUNDS, player)
}

function getRandomAction (gameState, player) {
  const actions = gameState.possibleActions()
  if (actions.length === 0) return null

  const rindex = Math.floor(actions.length * Math.random())
  return actions[rindex]
}
