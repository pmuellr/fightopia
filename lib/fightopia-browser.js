'use strict'

const jQuery = require('jquery')

const svg = require('./svg')
const mcts = require('./mcts')
const Piece = require('./piece')
const fightopia = require('../fightopia')

const ROUNDS = 2

let gameEL
let gameState = fightopia.createNewState()
// let gameInterval

jQuery(() => setTimeout(onLoad, 1000))

// Code to run when document is loaded.
function onLoad () {
  console.log('onLoad()!')
  gameEL = svg.createBoardElement(gameState)

  jQuery('body').append(gameEL)

  while (performAnAction()) {}

  svg.updateBoardElement(gameEL, gameState)
}

// Perform an action.
function performAnAction () {
  if (gameState.winner()) return false

  let action
  const player = gameState.currentPlayer()

  if (player === Piece.BLACK) {
    action = getMCTSAction(gameState, player)
  } else {
    action = getRandomAction(gameState, player)
  }

  gameState = gameState.clone()
  gameState = gameState.performAction(action)

  return !gameState.winner()
}

function getMCTSAction (gameState, player) {
  return mcts.findAction(gameState, ROUNDS, player)
}

function getRandomAction (gameState, player) {
  const actions = gameState.getPossibleActions()
  if (actions.length === 0) return null

  const rindex = Math.floor(actions.length * Math.random())
  return actions[rindex]
}
