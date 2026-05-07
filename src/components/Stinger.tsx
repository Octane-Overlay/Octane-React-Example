import React, { useEffect, useRef, useState } from 'react'
import {
  GameState,
  useOctaneGameState,
  useOctaneState,
} from '@octane-rl/react'

type ActiveStinger = { id: number }

let stingerIdCounter = 0

export function Stinger() {
  const gameState = useOctaneGameState()
  const matchId = useOctaneState()?.matchId
  const [active, setActive] = useState<ActiveStinger | null>(null)

  // Fire a stinger on entry to both replay and replayEnding so users can
  // react to start and end with the same or different cues.
  const prevGameState = useRef<GameState>(gameState)
  useEffect(() => {
    const prev = prevGameState.current
    prevGameState.current = gameState
    if (prev === gameState) return
    if (
      gameState === GameState.replay ||
      gameState === GameState.replayEnding
    ) {
      setActive({ id: ++stingerIdCounter })
    }
  }, [gameState])

  // Drop any in-flight stinger when the match changes so a prior match's
  // animation can't bleed into the next one.
  const prevMatchId = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (matchId === prevMatchId.current) return
    prevMatchId.current = matchId
    setActive(null)
  }, [matchId])

  if (!active) return null

  return (
    <div
      key={active.id}
      className="stinger"
      onAnimationEnd={(e) => {
        if (e.currentTarget !== e.target) return
        setActive((current) =>
          current && current.id === active.id ? null : current,
        )
      }}
    >
      <div className="stinger-text">OCTANE OVERLAY</div>
    </div>
  )
}
