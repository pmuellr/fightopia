'use strict'

const mcts = require('./lib/mcts')
const State = require('./lib/state')
const Piece = require('./lib/piece')

exports.createNewState = createNewState
exports.test = test

const fightopia = exports

// Create a new state object.
function createNewState () {
  return State.createInitial()
}

const ROUNDS = 100

// Run a simple test.
function test () {
  let gameState = fightopia.createNewState()
  gameState.print()

  while (!gameState.winner()) {
    gameState = performAnAction(gameState)
    gameState.print()
  }

  console.log('')
  console.log(`winner: ${gameState.winner()}`)
}

// Perform an action.
function performAnAction (gameState) {
  let action
  const player = gameState.currentPlayer()

  if (player === Piece.BLACK) {
    action = getMCTSAction(gameState, player)
  } else {
    action = getRandomAction(gameState, player)
  }

  console.log(`${player} action: ${action}`)

  gameState = gameState.clone()
  gameState.performAction(action)

  return gameState
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

// Run a simple test.
function test2 () {
  let state = createNewState()
  state.print()

  for (let i = 0; i < 10000; i++) {
    const actions = state.getPossibleActions()
    const rindex = Math.floor(actions.length * Math.random())
    const action = actions[rindex]

    console.log(`action: ${action}`)
    state = state.performAction(action)
    state.print()
  }
}

// If this is the main module, run a simple test.
if (require.main === module) {
  test()
  process.exit()
  test2()
}
