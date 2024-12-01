import React, { useState } from "react";
import { Auth } from "./Auth";
import { AppWrapper } from "./AppWrapper";
import Cookies from "universal-cookie";
import "./App.css";
import {Message} from "./Message";
const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [roomName, setRoomName] = useState(cookies.get("roommail"));
  const [isInChat, setIsInChat] = useState(null);
  const [room, setRoom] = useState(roomName);

  const handleRoomChange = (newRoom) => {
    setRoom(newRoom);
  };

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        setIsInChat={setIsInChat}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      <Message room={room} onRoomChange={handleRoomChange} />
    </AppWrapper>
  );
}

export default ChatApp;
