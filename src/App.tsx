import React from 'react'
import './App.css'
import { Scoreboard } from './components/Scoreboard'
import { TeamRoster } from './components/TeamRoster'
import { SpectatedPlayer } from './components/SpectatedPlayer'
import { Stinger } from './components/Stinger'
import { StatToasts } from './components/StatToasts'
import { Replay } from './components/Replay'

function App() {
  return (
    <div className="App">
      <Scoreboard />

      <StatToasts />

      <TeamRoster side="left" />
      <TeamRoster side="right" />

      <SpectatedPlayer />

      <Replay />

      <Stinger />
    </div>
  )
}

export default App
