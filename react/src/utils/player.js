export function getPlayerId() {
  let playerId = null;

  try {
    playerId = localStorage.getItem("playerId");
  } catch (error) {
    console.log(error);
  }
  return playerId;
}
