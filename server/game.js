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
    data: Array(n ** 2).fill(""),
    currentTurn: 0,
    isGameOver: false,
    players: [],
  };
}

export function playTurn(state, pos) {
  state.data[pos] = state.currentTurn === 0 ? "O" : "X";
  state.currentTurn = (state.currentTurn + 1) % 2;
}

export function isPlayerTurn(state, playerId) {
  return (
    state.currentTurn ===
    state.players.findIndex((item) => item.id === playerId)
  );
}

export function checkGameOver(state) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      state?.data[a] &&
      state?.data[a] === state?.data[b] &&
      state?.data[a] === state?.data[c]
    ) {
      return true;
    }
  }

  return false;
}

export function isGameFull(state) {
  return state?.players?.length >= 2;
}

export function isCellFull({ state, pos }) {
  return state?.data[pos];
}

export function newPlayer(state, player) {
  if (!state) return;
  if (state?.players?.find((item) => item.id === player.id)) return;
  state?.players?.push(player);
}
