import React from 'react'
import type { Player } from '@octane-rl/core'
import { useOctaneState } from '@octane-rl/react'
import { teamColor } from '../utils'

type Props = {
  side: 'left' | 'right'
}

function RosterCard({ player }: { player: Player }) {
  const boost = Math.max(0, Math.min(100, player.boost ?? 0))
  return (
    <div className="roster-card">
      <div className="roster-name">{player.name}</div>
      <div className="roster-boost">
        <div
          className="roster-boost-fill"
          style={{ width: `${boost}%`, background: teamColor(player.team) }}
        />
        <div className="roster-boost-value">{Math.round(boost)}</div>
      </div>
    </div>
  )
}

export function TeamRoster({ side }: Props) {
  const state = useOctaneState()
  // Gate on matchId so a stale state from a prior match (e.g. after a
  // disconnect) can't keep rendering the previous roster.
  const players = state?.matchId ? state.players : []
  const teamId = side === 'left' ? 0 : 1
  const roster = players.filter((p) => p.team === teamId)

  return (
    <div className={`team-roster team-roster-${side}`}>
      {roster.map((p) => (
        <RosterCard key={p.spectatorId} player={p} />
      ))}
    </div>
  )
}
