# Game Backend (NestJS + Socket.IO + Redis + MongoDB)

Scalable multiplayer game backend inspired by Brotato. Players connect via WebSockets, join rooms, send inputs, and receive real-time state updates. The game server runs a 20Hz simulation loop, publishes state through Redis Pub/Sub, and persists match results to MongoDB.

## Features
- WebSocket gateway with Socket.IO.
- Room assignment and in-memory room state.
- 20Hz game loop with enemy spawning, movement, and collision detection.
- Redis Pub/Sub for decoupled input and state fan-out.
- MongoDB persistence for match results.
- Swagger docs at `/docs`.

## Requirements
- Node.js 18+
- Redis
- MongoDB

## Install
```bash
npm install
```

## Environment Variables
- `PORT` (default `3000`)
- `MONGODB_URI` (default `mongodb://localhost:27017/game`)
- `GAME_URL` (for test client, default `http://localhost:3000`)
- `PLAYER_ID` (for test client, default `player1`)

## Run
```bash
npm run start:dev
```

Swagger:
- `http://localhost:3000/docs`

Health check:
- `GET http://localhost:3000/health`

WebSocket metadata:
- `GET http://localhost:3000/meta/websocket`

## WebSocket Events
Incoming:
- `joinRoom` `{ playerId }`
- `playerInput` `{ roomId, playerId, dx, dy, action }`

Outgoing:
- `joinedRoom` `{ playerId, roomId }`
- `stateUpdate` `{ roomId, players, enemies, state }`
- `gameEvent` `{ roomId, type: "matchEnded" }`

## Test Client
```bash
node scripts/test-client.js
```

## Scripts
```bash
npm run build
npm run start
npm run start:dev
npm run lint
npm run test
```

## Notes
- Game state is server authoritative.
- State updates are throttled and emitted only when room state changes.
- Match results persist when all players are dead.
