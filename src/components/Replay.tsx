import React, { useEffect, useState } from 'react'
import {
  EventType,
  GameState,
  useOctaneEvents,
  useOctaneGameState,
  useOctaneState,
} from '@octane-rl/react'
import type { GoalScoredEvent } from '@octane-rl/core'

export function Replay() {
  const gameState = useOctaneGameState()

  useEffect(() => {
    console.log('[Replay] gameState ->', gameState)
  }, [gameState])

  const isReplay = useOctaneState()?.game?.isReplay
  useEffect(() => {
    console.log('[Replay] isReplay ->', isReplay)
  }, [isReplay])

  const goalEvent = useOctaneEvents(EventType.goalScored)
  useEffect(() => {
    console.log('[Replay] goalEvent ->', goalEvent)
  }, [goalEvent])

  const [goal, setGoal] = useState<GoalScoredEvent | null>(null)

  // Latch the most recent real goal event. The plugin emits a sentinel
  // GoalScored with empty scorer/0 speed at end-of-replay — ignore those so
  // the card keeps showing the actual goal info.
  useEffect(() => {
    if (goalEvent && goalEvent.scorer?.name) {
      setGoal(goalEvent)
    }
  }, [goalEvent])

  const inReplay =
    gameState === GameState.replay ||
    gameState === GameState.replayEnding ||
    !!isReplay

  if (!inReplay) {
    return null
  }

  return (
    <>
      <div className="replay-card">
        <div className="replay-dot" />
        <span className="replay-label">REPLAY</span>
      </div>

      {goal && (
        <div className="replay-goal-card">
          <div className="replay-goal-speed">
            {Math.round(goal.goalSpeed)} KM/H
          </div>
          <div className="replay-goal-divider" />
          <div className="replay-goal-scorer">{goal.scorer.name}</div>
          {goal.assister?.name && (
            <div className="replay-goal-assister">
              assist · {goal.assister.name}
            </div>
          )}
        </div>
      )}
    </>
  )
}
