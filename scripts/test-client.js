import { io } from "socket.io-client";

const url = process.env.GAME_URL ?? "http://localhost:3000";
const playerId = process.env.PLAYER_ID ?? "player1";

const socket = io(url, {
  transports: ["websocket"],
});

let lastRoomId = null;

socket.on("connect", () => {
  console.log("connected", socket.id);

  socket.emit("joinRoom", { playerId });
});

socket.on("joinedRoom", (payload) => {
  console.log("joinedRoom", payload);

  lastRoomId = payload.roomId;
});

socket.on("stateUpdate", (state) => {
  console.log("stateUpdate", state);
});

socket.on("gameEvent", (evt) => {
  console.log("gameEvent", evt);
});

// send player movement
setInterval(() => {

  if (!lastRoomId) return;

  const dx = Math.floor(Math.random() * 3) - 1;
  const dy = Math.floor(Math.random() * 3) - 1;

  socket.emit("playerInput", {
    roomId: lastRoomId,
    playerId,
    dx,
    dy,
  });

}, 200);