const n = 3;
// const state = {
//   data: Array(n)
//     .fill(0)
//     .map(() => Array(n).fill("")),
//   currentTurn: "X",
//   isGameOver: false,
// };

import keyv from "./keyv.js";

export function createGameState() {
  return {
    data: Array(n)
      .fill(0)
      .map(() => Array(n).fill("")),
    currentTurn: 0,
    isGameOver: false,
    players: [],
  };
}

export function playTurn(state, pos) {
  state.data[pos.i][pos.j] = state.currentTurn === 0 ? "O" : "X";
  state.currentTurn = (state.currentTurn + 1) % 2;
}

export function isPlayerTurn(state, playerId) {
  return (
    state.currentTurn ===
    state.players.findIndex((item) => item.id === playerId)
  );
}

export function checkGameOver(state) {
  // let isGameOver = false;

  const gameData = state.data;

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
        return true;
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
        return true;
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
      return true;
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
      return true;
    }
  }

  return false;
}

export function newPlayer(state, player) {
  if (!state) return;
  if (state.players.find((item) => item.id === player.id)) return;
  state.players.push(player);
}
