# expoTestApp

Expo + React Native control deck that shows a telemetry snapshot, a simple voltage trend, and relay toggles for an Arduino-style board. The UI is contained in `App.js` with static sample data for quick demos.

## Quick start
- Prerequisites: Node 18+ and npm. Install Expo Go on a device or have an iOS/Android emulator available.
- Install dependencies: `npm install`
- Start the dev server: `npm start`
  - Press `i` for iOS simulator, `a` for Android emulator, `w` for web, or scan the QR code with Expo Go.

## Scripts
- `npm start` — launch Expo bundler in interactive mode.
- `npm run ios` — start Expo and open the iOS simulator.
- `npm run android` — start Expo and open the Android emulator.
- `npm run web` — run the project in a web browser.

## Project layout
- `App.js` — main screen with sensor tiles, voltage bar chart, relay toggles, and activity feed.
- `index.js` — registers the root component for Expo.
- `assets/` — icons and splash assets referenced by `app.json`.
- `app.json` — Expo configuration (name, icons, new architecture enabled).

## Customizing the demo data
- Sensor cards: edit `sensorCards` in `App.js` to change labels, values, or accent colors.
- Voltage trend: update `voltageTrend` to modify the bar chart values.
- Relays: adjust the `relays` initial state or add keys to mirror your hardware.
- Activity feed: modify `activityFeed` entries to reflect real events.

## Troubleshooting
- If the bundler behaves oddly, clear Expo caches with `npx expo start --clear`.
- Ensure emulators are running before invoking `npm run ios` or `npm run android`.

## License
0BSD
