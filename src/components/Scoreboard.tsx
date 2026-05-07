import React from 'react'
import { useOctaneMeta, useOctaneState } from '@octane-rl/react'

const DEFAULT_BEST_OF = 5

function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function SeriesPips({
  wins,
  total,
  color,
}: {
  wins: number
  total: number
  color: string
}) {
  return (
    <div className="series-pips">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="series-pip"
          style={i < wins ? { background: color } : undefined}
        />
      ))}
    </div>
  )
}

export function Scoreboard() {
  const state = useOctaneState()
  const meta = useOctaneMeta()

  const game = state?.game
  const blueTeam = game?.teams.find((t) => t.id === 0)
  const orangeTeam = game?.teams.find((t) => t.id === 1)
  const blueMeta = meta?.blue
  const orangeMeta = meta?.orange
  const seriesPipCount = Math.ceil((meta?.bestOf ?? DEFAULT_BEST_OF) / 2)
  const blueName =
    blueMeta?.name.trim() || blueTeam?.name?.toUpperCase() || 'BLUE'
  const orangeName =
    orangeMeta?.name.trim() || orangeTeam?.name?.toUpperCase() || 'ORANGE'

  return (
    <div className="scoreboard">
      <div className="team-name team-name-blue">
        {blueMeta?.logo && (
          <img className="team-logo" src={blueMeta.logo} alt="" />
        )}
        <span className="team-name-text">{blueName}</span>
      </div>
      <div className="scoreboard-angle scoreboard-angle-blue" />
      <div className="score score-blue">
        <div className="score-num">{blueTeam?.score ?? 0}</div>
        <SeriesPips
          wins={blueMeta?.wins ?? 0}
          total={seriesPipCount}
          color="#3aa0ff"
        />
      </div>
      <div className="clock-block">
        <div className="clock">
          {game ? formatClock(game.timeSeconds) : '--:--'}
        </div>
        {game?.isOvertime && <div className="overtime">OVERTIME</div>}
      </div>
      <div className="score score-orange">
        <div className="score-num">{orangeTeam?.score ?? 0}</div>
        <SeriesPips
          wins={orangeMeta?.wins ?? 0}
          total={seriesPipCount}
          color="#ff8c2a"
        />
      </div>
      <div className="scoreboard-angle scoreboard-angle-orange" />
      <div className="team-name team-name-orange">
        <span className="team-name-text">{orangeName}</span>
        {orangeMeta?.logo && (
          <img className="team-logo" src={orangeMeta.logo} alt="" />
        )}
      </div>
    </div>
  )
}
