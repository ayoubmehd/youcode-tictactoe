import { useEffect, useContext } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/main";
import { getPlayerId } from "../utils/player";

function Room() {
  const param = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("join", {
      room: param.id,
      playerId: getPlayerId(),
    });
  });

  return (
    <div className="room">
      <h1>X-0</h1>
      <Outlet />
    </div>
  );
}

export default Room;
