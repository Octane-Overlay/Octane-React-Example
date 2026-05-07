# 🎬🚗 Octane-React-Example

> 📺 A reference overlay built on the [Octane](https://github.com/octane-rl) Rocket League toolkit.

`Octane-React-Example` is a working broadcast overlay that consumes [`@octane-rl/react`](https://www.npmjs.com/package/@octane-rl/react) to render live Rocket League match data: scoreboard, clock, team rosters, spectated player card, replay screen with goal info, statfeed toasts, and a stinger sweep. Drop it into OBS as a browser source, or fork it as a starting point for your own HUD. 🎮✨

## 📦 What's in the box

* 🏆 **Scoreboard** with team names, logos, scores, series pips, and game clock.
* 👥 **Team rosters** with live boost meters per player.
* 🎯 **Spectated player card** showing the currently spectated player's stats and boost.
* 🎬 **Replay screen** with a REPLAY badge plus a goal info card (speed, scorer, optional assister).
* 📢 **Statfeed toasts** (goals, saves, demos, hat tricks, and friends), team-coloured and auto-expiring.
* ✨ **Stinger overlay** that fires on entry to replay and replay-end.
* 🧱 **Modular components**, each consuming Octane hooks directly so they can be lifted into other apps.

## 🚀 Getting started

```bash
npm install
npm start
```

The dev server listens on **port 3000** and opens at 👉 [http://localhost:3000](http://localhost:3000).

```bash
npm run build      # 📦 production build into ./build
npm test           # 🧪 react-scripts test runner
```

## 🛠️ Setup

To see live data, make sure:

1. 🎯 Rocket League is running.
2. 🛜 [Octane-Bridge](https://github.com/Octane-Overlay/Octane-Bridge) is running on the same machine.
3. 🔢 The bridge's WS port is reachable at `ws://127.0.0.1:49124` (the default).
4. 🪪 (Optional) [Octane-Admin](https://github.com/Octane-Overlay/Octane-Admin) is running so you can edit team names, logos, and series wins live.

> 🪧 If you've changed the bridge's `WS_PORT`, call `configureOctane({ port: <yours> })` once at startup in `src/index.tsx`.

## 🖥️ Use as an OBS browser source

1. 📦 Run `npm run build`. The static bundle ends up in `./build`.
2. 🌐 Serve the build directory with any static server, or point OBS at the dev URL while iterating.
3. ➕ In OBS, add a **Browser** source and set the URL to the served overlay.
4. 📐 Use 1920x1080 to match the design. The background is transparent so it composites cleanly over the gameplay capture.

## 🧱 Components

Each component lives in `src/components` and subscribes to the Octane hooks itself. No prop drilling, no context provider, no shared parent state: the underlying connection is provided by the [`@octane-rl/react`](https://www.npmjs.com/package/@octane-rl/react) singleton, so any component can be lifted into another app as-is.

| Component 🎟️ | Hooks used | Purpose |
| --- | --- | --- |
| 🏆 `Scoreboard` | `useOctaneState`, `useOctaneMeta` | Top scoreboard with names, scores, series pips, clock |
| 👥 `TeamRoster` | `useOctaneState` | Side roster cards with live boost meters |
| 🎯 `SpectatedPlayer` | `useOctaneState` | Card for the currently spectated player |
| 🎬 `Replay` | `useOctaneState`, `useOctaneGameState`, `useOctaneEvents` | REPLAY badge plus goal info card |
| ✨ `Stinger` | `useOctaneState`, `useOctaneGameState` | Full-screen sweep on replay enter and replay end |
| 📢 `StatToasts` | `useOctaneState`, `useOctaneEvents` | Auto-expiring statfeed pop-ups |

## Known Issues

Currently, the GoalReplayStart, GoalReplayWillEnd, and GoalReplayEnd events are not correctly implemented in the Rocket League Stats API. Therefor the example, and the react package, are unable to provide these. I left a message on X, hopefully they will fix it soon.

## 🤝 Contributing

PRs welcome! 💚 Please run `npm run build` before opening one to make sure the overlay still compiles.

## 📜 License

[MIT](./LICENSE) 🆓
