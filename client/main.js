import "./style.css";

const socket = io("http://localhost:5000/");

socket.on("connect", () => {
  console.log(socket.id);
});

const app = document.querySelector("#app");
const n = 3;
let gameData = Array(n)
  .fill(0)
  .map(() => Array(n).fill(""));

let currentTurn = "X";
let isGameOver = false;

console.log(gameData);

// Render Game board
renderGameBoard();

// Event Listeners
function boxClick() {
  gameData[this.dataset.i][this.dataset.j] = currentTurn;
  currentTurn = currentTurn === "X" ? "O" : "X";
  renderGameBoard();
  checkGameOver();
  if (isGameOver) {
    alert("Game Over");
    return;
  }
}

// Functions

function checkGameOver() {
  // const isArrayFull =
  //   gameData.filter((item) => item !== "").length === gameData.length;
  // isGameOver = isArrayFull;

  // Rows
  {
    for (let i = 0; i < n; i++) {
      const row = gameData[i];
      let j = 0;
      let cell = row[0];
      let areEquel = true;
      for (j = 1; j < n; j++) {
        if (cell === "" || cell !== row[j]) {
          areEquel = false;
          break;
        }
      }
      if (areEquel) {
        isGameOver = true;
      }
    }
  }

  // Columns
  {
    for (let j = 0; j < n; j++) {
      let i = 0;
      const cell = gameData[0][j];
      let areEquel = true;
      for (i = 1; i < n; i++) {
        if (cell === "" || cell !== gameData[i][j]) {
          areEquel = false;
          break;
        }
      }
      if (areEquel) {
        isGameOver = true;
      }
    }
  }

  {
    // Frst Diagonal
    let areEquel = true;
    const cell = gameData[0][0];
    for (let i = 1; i < n; i++) {
      if (cell === "" || cell !== gameData[i][i]) {
        areEquel = false;
        break;
      }
    }
    if (areEquel) {
      isGameOver = true;
    }
  }

  // Second Diagonal
  {
    let areEquel = true;
    const cell = gameData[0][n - 1];
    let j = n - 2;
    for (let i = 1; i < n; i++) {
      if (cell === "" || cell !== gameData[i][j]) {
        areEquel = false;
        break;
      }
      j--;
    }
    if (areEquel) {
      isGameOver = true;
    }
  }
}

function renderGameBoard() {
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
