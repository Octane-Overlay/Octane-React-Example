import React, { useEffect, useRef, useState } from 'react'
import {
  EventType,
  StatFeedEventType,
  useOctaneEvents,
  useOctaneState,
} from '@octane-rl/react'
import type { StatFeedEvent } from '@octane-rl/core'
import {
  Crosshair,
  Crown,
  HandHeart,
  HandsClapping,
  Lightning,
  MagicWand,
  Shield,
  ShieldStar,
  Skull,
  SoccerBall,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react'
import { teamColor } from '../utils'

const TOAST_DURATION_MS = 3000
const TOAST_MAX = 4

const STAT_ICONS: Record<StatFeedEventType, PhosphorIcon> = {
  [StatFeedEventType.demolish]: Skull,
  [StatFeedEventType.shot]: Crosshair,
  [StatFeedEventType.goal]: SoccerBall,
  [StatFeedEventType.longGoal]: Lightning,
  [StatFeedEventType.hatTrick]: Crown,
  [StatFeedEventType.save]: Shield,
  [StatFeedEventType.epicSave]: ShieldStar,
  [StatFeedEventType.savior]: HandHeart,
  [StatFeedEventType.assist]: HandsClapping,
  [StatFeedEventType.playmaker]: MagicWand,
}

function statName(stat: StatFeedEventType): string {
  return StatFeedEventType[stat].replace(/([A-Z])/g, ' $1').toLowerCase()
}

function formatStat(event: StatFeedEvent): string {
  const main = event.mainTarget.name
  if (event.stat === StatFeedEventType.demolish && event.secondaryTarget) {
    return `${main} demolished ${event.secondaryTarget.name}`
  }
  return `${main} ${statName(event.stat)}`
}

type StatToast = {
  id: number
  text: string
  Icon: PhosphorIcon
  team: number | undefined
}

let toastIdCounter = 0

export function StatToasts() {
  const stat = useOctaneEvents(EventType.statfeedEvent)
  const matchId = useOctaneState()?.matchId
  const [toasts, setToasts] = useState<StatToast[]>([])

  useEffect(() => {
    if (!stat) return
    const id = ++toastIdCounter
    const toast: StatToast = {
      id,
      text: formatStat(stat),
      Icon: STAT_ICONS[stat.stat],
      team: stat.mainTarget.team,
    }
    setToasts((prev) => [toast, ...prev].slice(0, TOAST_MAX))
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, TOAST_DURATION_MS)
  }, [stat])

  // Drop in-flight toasts when the match changes so a prior match's transient
  // UI can't bleed into the next one.
  const prevMatchId = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (matchId === prevMatchId.current) return
    prevMatchId.current = matchId
    setToasts([])
  }, [matchId])

  return (
    <div className="stat-toasts">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="stat-toast"
          style={{ borderLeftColor: teamColor(t.team) }}
        >
          <t.Icon size={20} weight="fill" />
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  )
}
