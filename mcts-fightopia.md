MCTS for Fightopia
================================================================================

initial setup
--------------------------------------------------------------------------------

* state will be initial game state
* build tree with a single node, n0


single run
--------------------------------------------------------------------------------

* ucb1 search for node to expand, which has unvisited actions to process
* for that node, pick an unvisited action at random
* expand by creating a new state based on that action, and a new node for that state
* simulate by playing the game out from that state
  (mutating a new single state from there)
* update the visited / wins counters in path to root


multiple runs
--------------------------------------------------------------------------------

* allow multiple runs, based on time, space (maybe?), or simple # of runs
* amenable to running for a while, then pausing to let other events run


saving the tree across game lifetime
--------------------------------------------------------------------------------

* Since one of the actions at the root will be used as the next action to
  actually use, we can make that node the new root to do work playing the
  next action.
* Presumably the MCTS player is playing a random/human player, so that new
  root is actually that player's action, and not the MCTS player's.
* No matter, we can process here, in the background, since one of those actions
  will be the action picked by the random/human player, and we can then use
  that as the root state for the MCTS player, after the random/human player
  actually performs the action.
* This means the tree is persistent, and will shed everything but one child off
  the root after every action.


api
--------------------------------------------------------------------------------

mcts = createMCTS(state, player)

action = mcts.run(deadline) // build up the tree ... (return best action so far)
...                         // build up the tree ... (return best action so far)
action = mcts.run(deadline) // final action to perform is `action`
mcts.perform(action)        // action performed, tree adjusted

action = mcts.run(deadline) // build up the tree ... (return best action so far)
...                         // build up the tree ... (return best action so far)
action = mcts.run(deadline) // final action to perform is `action`
mcts.perform(action)        // action performed, tree adjusted
