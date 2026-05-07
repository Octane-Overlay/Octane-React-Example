import React from 'react'
import { useOctaneState } from '@octane-rl/react'
import { teamColor } from '../utils'

export function SpectatedPlayer() {
  const state = useOctaneState()
  const game = state?.game
  const players = state?.matchId ? state.players : []
  const targetId = game?.hasTarget ? game.target?.spectatorId : undefined
  const player =
    targetId !== undefined
      ? players.find((p) => p.spectatorId === targetId)
      : undefined

  if (!player) return null

  const boost = Math.max(0, Math.min(100, player.boost ?? 0))
  const color = teamColor(player.team)
  return (
    <div className="spectated" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="spectated-label">SPECTATING</div>
      <div className="spectated-name">{player.name}</div>
      <div className="spectated-stats">
        <div className="spectated-stat">
          <div className="spectated-stat-label">SCORE</div>
          <div className="spectated-stat-value">{player.score}</div>
        </div>
        <div className="spectated-stat">
          <div className="spectated-stat-label">G</div>
          <div className="spectated-stat-value">{player.goals}</div>
        </div>
        <div className="spectated-stat">
          <div className="spectated-stat-label">A</div>
          <div className="spectated-stat-value">{player.assists}</div>
        </div>
        <div className="spectated-stat">
          <div className="spectated-stat-label">S</div>
          <div className="spectated-stat-value">—</div>
        </div>
      </div>
      <div className="spectated-boost">
        <div
          className="spectated-boost-fill"
          style={{ width: `${boost}%`, background: color }}
        />
        <div className="spectated-boost-value">{Math.round(boost)}</div>
      </div>
    </div>
  )
}
