'use strict'

exports.findAction = findAction

// based on https://github.com/dbravender/mcts

// The passed in `state` object is the game state to evaluate.
// The evaluation will consist of `rounds` # of evaluations.
// The `player` object is the current player.
//
// The `state` object must implement the following methods:
//
// * clone() - returns a new `state` object which is a copy of
//   of the existing `state` object
//
// * possibleActions() - returns an array of `action` objects
//   which are legal at this point.
//
// * performAction(action) - performs the action by updating
//   the internal game state of the `state` object
//
// * currentPlayer() - returns the current `player` object
//
// * winner() - returns a `player` object or null if no winner yet

// Models the Monte Carlo Tree Search engine.

// Given the state, rounds and player, find the best action.
function findAction (state, rounds, player) {
  const rootNode = new Node(null, player, state, null, 0)

  for (let round = 0; round < rounds; round++) {
    rootNode.visits++

    let currentNode = rootNode
    while (currentNode.getChildren().length !== 0) {
      currentNode = currentNode.nextMove()
      currentNode.visits++
    }

    if (player === currentNode.winner()) {
      while (currentNode.parent) {
        currentNode.wins++
        currentNode = currentNode.parent
      }
    }
  }

  const sortedNodes = rootNode.getChildren().sort((a, b) =>
    b.visits - a.visits
  )

  return sortedNodes[0].action
}

// Models a node in the search tree.
class Node {

  constructor (parent, player, state, action, depth) {
    this.parent = parent
    this.player = player
    this.state = state
    this.action = action
    this.depth = depth || 0
    this.wins = 0
    this.visits = 0
    this.children = null
  }

  // Upper Confidence Bound 1
  // see https://en.wikipedia.org/wiki/Monte_Carlo_tree_search#Exploration_and_exploitation
  ucb1 () {
    if (this.visits === 0) return 0

    return (this.wins / this.visits) +
      Math.sqrt(2 * Math.log(this.parent.visits) / this.visits)
  }

  // Calculate and return the children of this node.
  getChildren () {
    if (this.children != null) return this.children

    if (this.action != null) {
      this.state.performAction(this.action)
    }

    this.children = this.state.possibleActions().map((action) =>
      new Node(this, this.player, this.state.clone(), action, this.depth + 1)
    )

    return this.children
  }

  // Return the winner of the game, or null if no winner yet.
  winner () {
    this.getChildren()  // force a move

    return this.state.winner()
  }

  // Return the next action
  nextMove () {
    const sortable = this.getChildren().map((child) =>
      ({ sortValue: child.sortValue(), child: child })
    )

    // sort by ucb1 or visits
    const sorted = sortable.sort((a, b) =>
      b.sortValue - a.sortValue
    )

    // get the max value
    const max = sorted[0].sortValue

    // collect all with the max value
    const maxes = sorted.filter((sortChild) =>
      sortChild.sortValue === max
    )

    // pick one of these at random
    const index = Math.floor(Math.random() * maxes.length)
    return maxes[index].child
  }

  // Return sorting value for selection.
  sortValue () {
    if (this.parent.state.currentPlayer() === this.player) {
      return this.ucb1()
    } else {
      return -this.visits
    }
  }
}
