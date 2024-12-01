import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebase";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import "../styles/Chat.css";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
  MDBTypography,
  MDBTextArea,
  MDBCardHeader,
} from "mdb-react-ui-kit";
import { MessageInput } from '@chatscope/chat-ui-kit-react';
import Cookies from "universal-cookie";
const cookies = new Cookies();
export const Message = ({ room, onRoomChange }) => {
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const currentUser = auth.currentUser?.displayName || "Anonymous";
  const [username, setUsername] = useState(cookies.get("username"));

  useEffect(() => {
    const queryRooms = query(messagesRef, orderBy("room"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(queryRooms, (snapshot) => {
      const roomsSet = new Map();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.room) {
          roomsSet.set(data.room, { ...data, id: doc.id });
        }
      });
      setRooms(Array.from(roomsSet.values()));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!room) return;

    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [room]);

  console.log(messages)

  const handleSubmit = async (message) => {
    if (message.trim() === "") return;
  
    await addDoc(messagesRef, {
      text: message,
      createdAt: serverTimestamp(),
      user: currentUser,
      room,
      isRead: false,
    });
    setNewMessage(""); // Dòng này có thể không cần nếu không dùng `newMessage` nữa
  };
  

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "rgb(3, 201, 215)", width: "100%",height:"100%"  }}>
      <MDBRow  >
        <MDBCol >
          <MDBTypography listUnStyled >
            <div className="message-container">
              {messages.map((message) => (
                <li
                  className={`mb-4 `}
                  key={message.id}
                >
                  {message.user === username ? 
                  <>
                <div className="message-right-container" >
                  <MDBCard className={message.user === username ? "message-right" : "message-left"}>
                    <MDBCardHeader className="d-flex justify-content-between p-3">
                      <p className="fw-bold mb-0">{message.user}</p>
                      <p className="text-muted small mb-0">
                        <MDBIcon far icon="clock" />{" "}
                        {message.createdAt?.toDate().toLocaleString()}
                      </p>
                    </MDBCardHeader>
                    <MDBCardBody>
                      <p className="mb-0">{message.text}</p>
                    </MDBCardBody>
                  </MDBCard>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                    alt="avatar"
                    className={`rounded-circle d-flex align-self-start shadow-1-strong ${message.user === username ? "me-3" : "ms-3"}`}
                    width="60"
                  />
                </div>
                </>
                :
                <>
                 <div className="message-left-container">
                  <MDBCard className={message.user === username ? "message-right" : "message-left"}>
                    <MDBCardHeader className="d-flex justify-content-between p-3">
                      <p className="fw-bold mb-0">{message.user}</p>
                      <p className="text-muted small mb-0">
                        <MDBIcon far icon="clock" />{" "}
                        {message.createdAt?.toDate().toLocaleString()}
                      </p>
                    </MDBCardHeader>
                    <MDBCardBody>
                      <p className="mb-0">{message.text}</p>
                    </MDBCardBody>
                  </MDBCard>
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                    alt="avatar"
                    className={`rounded-circle d-flex align-self-start shadow-1-strong ${message.user === username ? "me-3" : "ms-3"}`}
                    width="60"
                  />
                </div>
                </>
                }
                </li>
              ))}
            </div>
            <MessageInput placeholder="Type message here" onSend={(message) => handleSubmit(message)} />
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};
