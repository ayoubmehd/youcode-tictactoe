import { useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Copyable from "../../components/Copyable";

import { getPlayerId } from "../../utils/player";

import { SocketContext } from "../../contexts/main";

function JustCreated() {
  const param = useParams();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("join", {
      room: param.id,
      playerId: getPlayerId(),
    });
    socket.on("init", ({ room }) => {
      console.log("init");
      navigate(`/${room}/game`);
    });
    socket.on("setPlayerId", (playerId) => {
      console.log("player id", playerId);

      if (!getPlayerId()) {
        console.log("player id", playerId);
        localStorage.setItem("playerId", playerId);
      }
    });
  }, []);

  return (
    <>
      <h2>Invite with room id</h2>
      <Copyable>{param.id}</Copyable>
      <h2>Invite with a link</h2>
      <Copyable>{location.href}</Copyable>
    </>
  );
}

export default JustCreated;
