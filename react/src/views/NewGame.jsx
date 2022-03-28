import { useEffect, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/main";
import { getPlayerId } from "../utils/player";

function NewGame() {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [createdRoomId, setCreatedRoomId] = useState("");

  useEffect(() => {
    // socket.on("init", (res) => {
    //   const { gameState, room, id } = res;
    //   // setGame(gameState);
    //   navigate(`/${room}`);

    //   localStorage.setItem("playerId", id);
    // });
    socket.on("gameCreated", (roomId) => {
      navigate(`/${roomId}`);
    });
  }, []);

  // Event Handels
  const joinRoomForm = useCallback(({ target }) => {
    navigate(`/${target.roomId.value}`);
  }, []);

  const createRoom = useCallback(() => {
    socket.emit("newGame", {
      playerId: getPlayerId(),
    });
  }, []);

  return (
    <div className="new-game">
      <h2>New Game</h2>
      <button onClick={createRoom}>Start</button>
      OR
      <h2>Join an existing room</h2>
      <form onSubmit={joinRoomForm}>
        <input name="roomId" placeholder="Room Id" type="text" />
        <button>Joint</button>
      </form>
    </div>
  );
}

export default NewGame;
