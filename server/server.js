import { Server } from "socket.io";
import {
  playTurn,
  checkGameOver,
  createGameState,
  newPlayer,
  isPlayerTurn,
} from "./game.js";

import { v4 as uuidv4 } from "uuid";

import keyv from "./keyv.js";

const states = (await keyv.get("states")) ?? {};

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("newGame", (data) => {
    const { room, playerId } = JSON.parse(data);

    states[room] = createGameState();
  });

  socket.on("join", (data) => {
    const { room, playerId } = JSON.parse(data);

    socket.join(room);

    states[room] = states[room] ? states[room] : createGameState();

    const gameState = states[room];

    const id = playerId || uuidv4();

    newPlayer(gameState, { id });
    keyv.set("states", states).then((res) => {});

    io.in(room).emit(
      "init",
      JSON.stringify({ room, gameState: gameState?.data, id })
    );
  });

  // Listening on player events
  socket.on("play", (data) => {
    const { room, i, j, playerId } = JSON.parse(data);

    let gameState = states[room];

    console.log(isPlayerTurn(gameState, playerId));
    console.log(gameState, playerId);
    if (!isPlayerTurn(gameState, playerId)) return;
    const pos = { i, j };
    playTurn(gameState, pos);
    keyv.set("states", states);

    const isGameOver = checkGameOver(gameState);

    if (isGameOver) {
      io.in(room).emit(
        "gameOver",
        JSON.stringify({
          winner: gameState.currentTurn,
          state: gameState.data,
        })
      );
      gameState = createGameState();
      io.in(room).emit(
        "init",
        JSON.stringify({ room, gameState: gameState?.data })
      );

      return;
    }

    io.in(room).emit("newState", JSON.stringify(gameState.data));
  });
});
