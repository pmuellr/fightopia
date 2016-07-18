'use strict'

const State = require('./lib/state')

exports.createNewState = createNewState
exports.test = test

// Create a new state object.
function createNewState () {
  return State.createInitial()
}

// Run a simple test.
function test () {
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
if (require.main === module) test()
