# Smart Visitor IoT Dashboard

## Prerequisites
- Node.js 18+

## Frontend (Vite + React)
```bash
cd "C:\clg works\iot individual pro\cloud"
npm install
npm run dev -- --host
```
- Optional `.env` values:
  - `VITE_THINGSPEAK_CHANNEL_ID`
  - `VITE_THINGSPEAK_READ_API_KEY`

## Live Data Flow
- Hardware publishes RFID UIDs to ThingSpeak field1.
- Frontend polls ThingSpeak every 15s via Fetch API, updates counts without manual input.
- UID mapping:
  - `13AA8E22` → Lobby
  - `5DADE742` → Restaurant
  - `79A06B05` → Gym
  - `1D098A04` → Exit
- Duplicate scans within 5s are ignored; exit scans decrement the most recent active zone.
- Total occupancy alert switches to red when above 25.

## UI
- Summary cards: total occupancy + alert status
- Zone cards: Lobby, Restaurant, Gym (color-coded thresholds)
- Recent scans table (last 10 events)
- Responsive, light professional styling

## ThingSpeak Defaults
- Channel ID: `3125767`
- Read Key: `RSPT4MWEXTUAJ3ZJ`


