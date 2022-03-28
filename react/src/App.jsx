import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import Context, { SocketContext, socket } from "./contexts/main";
import "./App.css";

// views
import Game from "./views/Room/Game";
import Room from "./views/Room";
import NewGame from "./views/NewGame";
import JustCreated from "./views/Room/JustCreated";

function App() {
  const [game, setGame] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <SocketContext.Provider value={socket}>
          <Routes>
            <Route exact path="/" element={<NewGame />} />
            <Route path="/:id" element={<Room />}>
              <Route path="/:id" element={<JustCreated />} />
              <Route
                path="/:id/game"
                element={
                  <Context.Provider value={[game, setGame]}>
                    <Game />
                  </Context.Provider>
                }
              />
            </Route>
          </Routes>
        </SocketContext.Provider>
      </header>
    </div>
  );
}

export default App;
