import React, { useEffect, useState } from 'react';
import './App.css';
import {
  EventType,
  StatFeedEventType,
  useOctaneEvents,
  useOctaneMeta,
  useOctaneState,
} from '@octane-rl/react';
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
} from '@phosphor-icons/react';
import type { Player, StatFeedEvent } from '@octane-rl/core';

const DEFAULT_BEST_OF = 5;

const TOAST_DURATION_MS = 3000;
const TOAST_MAX = 4;

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
};

function statName(stat: StatFeedEventType): string {
  return StatFeedEventType[stat].replace(/([A-Z])/g, ' $1').toLowerCase();
}

function formatStat(event: StatFeedEvent): string {
  const main = event.mainTarget.name;
  if (event.stat === StatFeedEventType.demolish && event.secondaryTarget) {
    return `${main} demolished ${event.secondaryTarget.name}`;
  }
  return `${main} ${statName(event.stat)}`;
}

function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function teamColor(team: number | undefined): string {
  return team === 1 ? '#ff8c2a' : '#3aa0ff';
}

type StatToast = {
  id: number;
  text: string;
  Icon: PhosphorIcon;
  team: number | undefined;
};

let toastIdCounter = 0;

function SeriesPips({
  wins,
  total,
  color,
}: {
  wins: number;
  total: number;
  color: string;
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
  );
}

function RosterCard({ player }: { player: Player }) {
  const boost = Math.max(0, Math.min(100, player.boost ?? 0));
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
  );
}

function App() {
  const state = useOctaneState();
  const meta = useOctaneMeta();
  const stat = useOctaneEvents(EventType.statfeedEvent);
  const [toasts, setToasts] = useState<StatToast[]>([]);

  const game = state?.game;
  const blueTeam = game?.teams.find((t) => t.id === 0);
  const orangeTeam = game?.teams.find((t) => t.id === 1);
  const bestOf = meta?.bestOf ?? DEFAULT_BEST_OF;
  const seriesPipCount = Math.ceil(bestOf / 2);
  const blueMeta = meta?.blue;
  const orangeMeta = meta?.orange;
  const blueName =
    blueMeta?.name.trim() || blueTeam?.name?.toUpperCase() || 'BLUE';
  const orangeName =
    orangeMeta?.name.trim() || orangeTeam?.name?.toUpperCase() || 'ORANGE';
  const targetId = game?.hasTarget ? game.target?.spectatorId : undefined;
  const spectated =
    targetId !== undefined
      ? state?.players.find((p) => p.spectatorId === targetId)
      : undefined;
  const blueRoster = state?.players.filter((p) => p.team === 0) ?? [];
  const orangeRoster = state?.players.filter((p) => p.team === 1) ?? [];

  useEffect(() => {
    if (!stat) return;

    const id = ++toastIdCounter;
    const toast: StatToast = {
      id,
      text: formatStat(stat),
      Icon: STAT_ICONS[stat.stat],
      team: stat.mainTarget.team,
    };

    setToasts((prev) => [toast, ...prev].slice(0, TOAST_MAX));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  }, [stat]);

  return (
    <div className="App">
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

      <div className="team-roster team-roster-left">
        {blueRoster.map((p) => (
          <RosterCard key={p.spectatorId} player={p} />
        ))}
      </div>

      <div className="team-roster team-roster-right">
        {orangeRoster.map((p) => (
          <RosterCard key={p.spectatorId} player={p} />
        ))}
      </div>

      {spectated && (
        <div
          className="spectated"
          style={{ borderLeft: `4px solid ${teamColor(spectated.team)}` }}
        >
          <div className="spectated-label">SPECTATING</div>
          <div className="spectated-name">{spectated.name}</div>
          <div className="spectated-stats">
            <div className="spectated-stat">
              <div className="spectated-stat-label">SCORE</div>
              <div className="spectated-stat-value">{spectated.score}</div>
            </div>
            <div className="spectated-stat">
              <div className="spectated-stat-label">G</div>
              <div className="spectated-stat-value">{spectated.goals}</div>
            </div>
            <div className="spectated-stat">
              <div className="spectated-stat-label">A</div>
              <div className="spectated-stat-value">{spectated.assists}</div>
            </div>
            <div className="spectated-stat">
              <div className="spectated-stat-label">S</div>
              <div className="spectated-stat-value">—</div>
            </div>
          </div>
          <div className="spectated-boost">
            <div
              className="spectated-boost-fill"
              style={{
                width: `${Math.max(0, Math.min(100, spectated.boost ?? 0))}%`,
                background: teamColor(spectated.team),
              }}
            />
            <div className="spectated-boost-value">
              {Math.round(spectated.boost ?? 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
