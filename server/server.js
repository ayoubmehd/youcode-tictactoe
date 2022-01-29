const { Server } = require("socket.io");
const {
  playTurn,
  checkGameOver,
  createGameState,
  newPlayer,
} = require("./game");

const states = {};

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("server started");

  socket.on("newGame", (room) => {
    states[room] = createGameState();
    newPlayer(states[room], { id: socket.client.id });
  });

  socket.on("join", (room) => {
    socket.join(room);
    const gameState = states[room];

    newPlayer(gameState, { id: socket.client.id });

    io.emit("init", JSON.stringify(gameState.data));

    // Init the game
  });

  // Listening on player events
  socket.on("play", (data) => {
    const { room, i, j } = JSON.parse(data);
    let gameState = states[room];
    const pos = { i, j };
    playTurn(gameState, pos);

    console.log("Player moved");

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
      io.in(room).emit("init", JSON.stringify(gameState.data));

      return;
    }

    io.in(room).emit("newState", JSON.stringify(gameState.data));
  });
});
