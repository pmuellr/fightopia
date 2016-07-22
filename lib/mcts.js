'use strict'

// Monte Carlo Tree Search

exports.create = create

// based on https://github.com/dbravender/mcts

// The passed in `state` object is the game state to evaluate.
// The evaluation will consist of `rounds` # of evaluations.
// The `actor` object is the current actor object.
//
// The `state` object must implement the following methods:
//
// * clone() - returns a new `state` object which is a copy of
//   of the existing `state` object
//
// * getCurrentPlayer() - returns the current `actor` object
//
// * getPossibleActions() - returns an array of `action` objects
//   which are legal at this point
//
// * getPreferredActions() - returns an array of `action` objects
//   are the preferred ones from the possible ones (optional, and
//   only used during the simulation phase)
//
// * performAction(action) - performs the action by updating
//   the internal game state of the `state` object
//
// * isFinished() - returns null if game is not done, or indication of
//   finish state

// Models the Monte Carlo Tree Search engine.

function create (state, actor) {
  return new MCTS(state)
}

class MCTS {
  constructor (state, actor) {
    this.rootNode = new Node(state)
    this.actor = actor || state.getCurrentActor()
  }

  // Run the MCTS engine until the deadline is hit; the deadline is an object
  // with either `ms` (time in milliseconds) or `rounds` properties (number
  // of rounds run).
  run (deadline) {
    // calculate the deadline
    deadline = deadline || {}

    let deadlineMS, deadlineRounds
    if (deadline.ms) {
      deadlineMS = Date.now() + deadline.ms
    } else if (deadline.rounds) {
      deadlineRounds = deadline.rounds
    } else {
      deadlineRounds = 10
    }

    let startTime = Date.now()
    let round = 0
    while (true) {
      this._runOneRound()

      round++
      if (deadlineMS && Date.now >= deadlineMS) return
      if (deadlineRounds && round >= deadlineRounds) return
    }
  }

  // Pick the top-level action with the most visits.
  getBestAction () {
    const maxVisits = 0
    const maxVisited = []
    for (let child of this.rootNode.children) {
      if (child.visited > maxVisits) {
        maxVisits = child.visited
        maxVisited = [child]
      } if (child.visited === maxVisits) {
        maxVisited.push(child)
      }
    }

    return util.pickRandomElement(maxVisited)
  }

  // Perform action.
  performAction (action) {
    this.rootNode = this.nodeFromAction(this.rootState, action)
    this.rootNode.parent = null
  }

  _runOneRound () {
    // select the next node to expand from
    const selectedNode = this._select()

    // pick an unexplored action from that node
    const newNode = this._expand(selectedNode)

    // play out, random-ish-ly, from that new node, getting "winner"
    const win = this._playout(newNode) // returns 0 or 1

    this._propogate(newNode, win)
  }

  // Select a new node to analyze.
  _select () {

  }

  // Expand tree at the specified node.
  _expand (node) {

  }

  // Perform actions against state at the node till finished.
  _playout (node) {

  }

  // Propogate results up the tree.
  _propogate (node, win) {
    while (node) {
      node.visited++
      if (node.actor == this.actor) {
        node.wins += win
      }

      node = node.parent
    }
  }

}

// Models a node in the search tree.
class Node {
  constructor (state, actor, action) {
    this.state = state
    this.actor = actor
    this.action = action
    this.parent = null
    this.children = []
    this.visited = 0
    this.wins = 0
  }

  createNode (action) {
    const result = new Node(this.state.clone(), this.actor, action)

    result.parent = this
    this.children.push(result)
  }
}





// Given the state, rounds and actor, find the best action.
function findAction (state, rounds, actor) {
  const rootNode = new Node(null, actor, state, null, 0)

  for (let round = 0; round < rounds; round++) {
    // console.log('----------------------------------------------')
    // console.log(`round ${round}`)
    // console.log('----------------------------------------------')
    rootNode.visits++

    let currentNode = rootNode
    while (!currentNode.finished()) {
      currentNode = currentNode.nextAction()
      if (!currentNode) break

      currentNode.visits++
    }

    if (currentNode && (actor === currentNode.finished())) {
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

  constructor (parent, actor, state, action, depth) {
    // console.log(`Node::constructor(,${actor}),,${action},${depth}`)
    // state.print()

    this.parent = parent
    this.actor = actor
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
      // console.log('before:')
      // this.state.print()
      // console.log(`Node::getChildren: performAction(${this.action})`)
      this.state.performAction(this.action)
      // console.log('after:')
      // this.state.print()
    }

    // console.log('Node::getChildren: -> creating children')
    this.children = this.state.possibleActions().map((action) =>
      new Node(this, this.state.currentPlayer(), this.state.clone(), action, this.depth + 1)
    )
    // console.log('Node::getChildren: <- creating children')

    return this.children
  }

  // Return whether game is finished.
  finished () {
    // this.getChildren()  // force a action

    return this.state.finished()
  }

  // Return the next action
  nextAction () {
    // create a sortable array of the children
    const sortable = this.getChildren().map((child) =>
      ({ sortValue: child.sortValue(), child: child })
    )

    if (sortable.length === 0) return null

    // sort by ucb1 / visits
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
    if (this.parent.state.currentPlayer() === this.actor) {
      return this.ucb1()
    } else {
      return -this.visits
    }
  }
}
