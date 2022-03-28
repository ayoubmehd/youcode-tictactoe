import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import {
  playTurn,
  checkGameOver,
  createGameState,
  newPlayer,
  isPlayerTurn,
  isGameFull,
  isCellFull,
} from "./game.js";

import { v4 as uuidv4 } from "uuid";

import keyv from "./keyv.js";

import debugPkg from "debug";

const debug = debugPkg("dev");

const states = (await keyv.get("states")) ?? {};

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  debug("New Connextion");

  socket.on("newGame", (data) => {
    const { playerId } = data;

    debug("%O", data);

    const room = uuidv4();

    states[room] = createGameState();

    socket.emit("gameCreated", room);

    debug("%O", states[room]);
  });

  socket.on("join", (data) => {
    const { room, playerId } = data;

    const gameState = states[room];

    debug("%O", data);

    socket.join(room);

    if (isGameFull(gameState)) {
      debug("Player can't join");
      return io.in(room).emit("error", { message: "Room is full" });
    }

    states[room] = states[room] ? states[room] : createGameState();

    const id = playerId || uuidv4();

    newPlayer(gameState, { id });
    keyv.set("states", states).then((res) => {});

    debug("------- Player id ---------");
    debug(id);
    debug("------- Player id ---------");

    if (!playerId) {
      socket.emit("setPlayerId", id);
    }
    if (isGameFull(gameState)) {
      debug("Player Joined %s", id);
      io.in(room).emit("init", { room, gameState: gameState?.data });
    }
  });

  socket.on("startGame", (room) => {
    const gameState = states[room];
    debug("Start Game");
    debug(gameState);
    // debug("Game started %s with state %O", room, gameState);
    io.in(room).emit("newState", gameState.data);
  });

  // Listening on player events
  socket.on("play", (data) => {
    const { room, pos, playerId } = data;

    let gameState = states[room];

    if (
      isCellFull({
        state: gameState,
        pos,
      })
    ) {
      debug("Cell Is Full");
      return socket.emit("error", { message: "You can't play this cell" });
    }

    debug("current player id %s", playerId);
    debug("is this player turn %d", isPlayerTurn(gameState, playerId));
    if (!isPlayerTurn(gameState, playerId)) {
      debug("this is not %s turn", playerId);
      return;
    }
    playTurn(gameState, pos);
    keyv.set("states", states);

    const isGameOver = checkGameOver(gameState);

    debug("is game over", isGameOver);

    if (isGameOver) {
      io.in(room).emit("gameOver", {
        winner: playerId,
        state: gameState.data,
      });
      states[room] = createGameState();
      io.in(room).emit("newState", states[room].data);

      return;
    }

    io.in(room).emit("newState", gameState.data);
  });
});
