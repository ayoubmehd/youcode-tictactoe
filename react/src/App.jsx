import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import logo from "./logo.svg";
import "./App.css";

function getPlayerId() {
  let playerId = null;

  try {
    playerId = localStorage.getItem("playerId");
  } catch (error) {
    console.log(error);
  }
  return playerId;
}

const Context = createContext([]);
const socket = io("http://localhost:5000/");

function newGame() {
  socket.emit(
    "newGame",
    JSON.stringify({
      room: roomName.current.value,
      playerId: getPlayerId(),
    })
  );
}

function NewGame() {
  const [game, setGame] = useContext(Context);
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const roomName = useRef(null);

  socket.on("init", (res) => {
    const { gameState, room, id } = JSON.parse(res);
    setGame(gameState);
    console.log(gameState);
    navigate(`/${room}`);

    localStorage.setItem("playerId", id);
  });

  return (
    <div>
      <input pattern="/^\S*$/" ref={roomName} type="text" />
      <button onClick={newGame}>Create</button>
    </div>
  );
}

function to1DArray(_2DArray) {
  return _2DArray.reduce((pre, row, i) => [...pre, ...row], []);
}

function Room() {
  const [game, setGame] = useContext(Context);
  const { id } = useParams();

  useEffect(() => {
    let playerId = null;

    try {
      playerId = localStorage.getItem("playerId");
    } catch (error) {
      console.log(error);
    }

    socket.emit("join", JSON.stringify({ room: id, playerId }));
  }, []);

  useEffect(() => {
    socket.on("newState", (res) => {
      const state = JSON.parse(res);
      console.log(state);
      setGame(to1DArray(state));
    });
    socket.on("init", (res) => {
      const { gameState, id } = JSON.parse(res);
      setGame(to1DArray(gameState));
      localStorage.setItem("playerId", id);
    });

    socket.on("gameOver", (data) => {
      alert("Game Over");
      console.log(JSON.parse(data).state);
      setGame(JSON.parse(data).state);
    });
  }, []);

  useEffect(() => {}, [game]);

  function boxClick(i, j) {
    console.log("clicked");
    socket.emit(
      "play",
      JSON.stringify({
        room: id,
        i,
        j,
        playerId: getPlayerId(),
      })
    );
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
          <div
            onClick={() => boxClick(Math.floor(i / 3), i % 3)}
            key={i}
            className="box"
          >
            {el}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [game, setGame] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <Context.Provider value={[game, setGame]}>
          <Routes>
            <Route exact path="/" element={<NewGame />} />
            <Route path="/:id" element={<Room />} />
          </Routes>
        </Context.Provider>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
