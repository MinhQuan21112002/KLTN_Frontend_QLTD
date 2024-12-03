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
  updateDoc ,
  doc
} from "firebase/firestore";
import './chatgpt.css';
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

  const handleRoomChange = (roomName) => {
    // Cập nhật trạng thái isRead thành true khi người dùng chọn phòng
    updateRoomReadStatus(roomName);
    // Thực hiện thay đổi phòng
    onRoomChange(roomName.room);
  };
  const updateRoomReadStatus = async (roomName) => {
    try {
      // Lấy phòng cần cập nhật
      const roomDoc = doc(db, "messages", roomName.id);
      // Cập nhật trường 'isRead' thành true
      await updateDoc(roomDoc, { isRead: true });
    } catch (error) {
      console.error("Error updating room read status:", error);
    }
  };
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
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "rgb(3, 201, 215)", width: "100%",  marginRight: "10%" }}>
      <MDBRow>
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
        <h5 className="font-weight-bold mb-3 text-center text-lg-start" style={{ fontSize: '2rem' }}>
          Member
        </h5>

          <MDBCard  style={{marginTop:"2rem",backgroundColor: "rgb(240, 255, 255)" }}>
            <MDBCardBody  style={{marginTop:"1rem"}}>
              <div className="room-container">
                <MDBTypography listUnStyled className="mb-0"   style={{
                 
                  height: "500px",
                  maxHeight: "500px",
                  border: "2px solid  rgb(2, 145, 155)", // Khung viền màu xám nhạt
                  borderRadius: "8px",          // Thêm khoảng cách bên trong
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" // Đổ bóng nhẹ
                  , // Đổ bóng nhẹ,
      backgroundColor: "rgb(240, 255, 255)" 
                }}>
                  {rooms.map((roomName, index) => (
                    <li
                      key={index}
                      className="p-2 border-bottom"
                      style={{ backgroundColor: room === roomName.room ? "#ddd" : "#eee", cursor: "pointer" }}
                      onClick={() => handleRoomChange(roomName)} // Thay đổi room khi click
                    >
                      <div className="d-flex flex-row">
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
                          alt="avatar"
                          className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                          width="60"
                        />
                        <div className="pt-1">
                          <p className="fw-bold mb-0">{roomName.room}</p>
                          {roomName.isRead === false && (
                      <span className="badge bg-danger float-end">1</span>
                  )}
                        </div>
                      </div>
                    </li>
                  ))}
                </MDBTypography>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="6" lg="7" xl="8">
        <MDBTypography
    listUnStyled
    style={{
      marginTop: "4.2%",
      height: "700px",
      maxHeight: "725px",
      border: "2px solid  rgb(2, 145, 155)", // Khung viền màu xám nhạt
      borderRadius: "8px",      // Bo góc viền
      padding: "10px",          // Thêm khoảng cách bên trong
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    }}
  >   <div className="message-container">
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

