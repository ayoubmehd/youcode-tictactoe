import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Context, { SocketContext } from "../../contexts/main";
import { getPlayerId } from "../../utils/player";

function to1DArray(_2DArray) {
  return _2DArray.reduce((pre, row) => [...pre, ...row], []);
}

function Game() {
  const [game, setGame] = useContext(Context);
  const socket = useContext(SocketContext);
  const { id } = useParams();

  useEffect(() => {
    socket.emit("startGame", id);
    socket.on("newState", (state) => {
      setGame(state);
    });
    socket.on("init", (res) => {
      const { gameState, id } = res;
      setGame(gameState);
      // ? not sure if this line should be removed, could break game
      // localStorage.setItem("playerId", id);
    });

    socket.on("gameOver", (data) => {
      alert("Game Over");
      setGame(data.state);
    });
  }, []);

  useEffect(() => {}, [game]);

  function boxClick(pos) {
    socket.emit("play", {
      room: id,
      pos,
      playerId: getPlayerId(),
    });
  }

  /**
   *  0  1  2
   * [0][1][2] 0
   * [3][4][5] 1
   * [6][7][8] 2
   */
  return (
    <div className="wrapper">
      <div className="app">
        {game.map((el, i) => (
          <div onClick={() => boxClick(i)} key={i} className="box">
            {el}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
