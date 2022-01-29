import "./style.css";

const socket = io("http://localhost:5000/");
const app = document.querySelector("#app");
const room = document.querySelector("#room");
let roomId = new URL(window.location.href).searchParams.get("roomId");

if (roomId) {
  socket.emit("join", roomId);
} else {
  socket.on("connect", () => {
    console.log(socket.id);
    room.textContent = socket.id;
    roomId = socket.id;
    socket.emit("newGame", socket.id);
  });
}

// Event Listeners
function boxClick() {
  console.log("clicked");
  socket.emit(
    "play",
    JSON.stringify({
      room: roomId,
      i: this.dataset.i,
      j: this.dataset.j,
    })
  );
}

socket.on("gameOver", (data) => {
  alert("Game Over");
  console.log(JSON.parse(data).state);
  renderGameBoard(JSON.parse(data).state);
});

socket.on("newState", (state) => {
  renderGameBoard(JSON.parse(state));
});
socket.on("init", (state) => {
  console.log(state);
  renderGameBoard(JSON.parse(state));
});

// Functions

function renderGameBoard(gameData) {
  app.innerHTML = "";
  for (const [i, row] of gameData.entries()) {
    for (const [j, col] of row.entries()) {
      const cellDOM = document.createElement("div");

      // cellDOM.textContent = `${i}, ${j}`;
      cellDOM.textContent = col;
      cellDOM.className = "box";
      cellDOM.addEventListener("click", boxClick);
      cellDOM.dataset.i = i;
      cellDOM.dataset.j = j;
      app.append(cellDOM);
    }
  }
}
