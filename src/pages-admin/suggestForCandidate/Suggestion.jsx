import {
    IconButton,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
  } from "@chakra-ui/react";
  import {
    collection,
    addDoc,
    where,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    doc,
    deleteDoc,
  } from "firebase/firestore";
  import { db, auth } from "../../firebase";
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { ToastContainer, toast } from "react-toastify";
  import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
  import { Header } from "../../Components-admin";
  
  export const Suggestion = () => {
    const messagesRef = collection(db, "popularJob");
    const [suggest, setSuggest] = useState([]);
    const navigate = useNavigate();
  
    // Lấy dữ liệu từ Firestore
    useEffect(() => {
      const queryRooms = query(messagesRef);
      const unsubscribe = onSnapshot(queryRooms, (snapshot) => {
        const roomsSet = new Map();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data) {
            roomsSet.set(data, { ...data, id: doc.id });
          }
        });
        setSuggest(Array.from(roomsSet.values()));
      });
  
      return () => unsubscribe();
    }, []);
  
    // Hàm xử lý khi nhấn "Edit"
    const handleEdit = (id) => {
      navigate(`/edit-suggestion/${id}`); // Điều hướng đến trang edit với id
    };
  
    // Hàm xóa dữ liệu khi nhấn nút xóa
    const handleDelete = async (id) => {
      const docRef = doc(db, "popularJob", id); // Tham chiếu đến document cần xóa
      try {
        await deleteDoc(docRef); // Xóa document khỏi Firestore
        toast.success("Dữ liệu đã được xóa thành công!");
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa dữ liệu!");
        console.error("Error deleting document: ", error);
      }
    };
  
    return (
      <>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
          <Header category="App" title="Gợi ý" />
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Gợi ý</TableCaption>
              <Thead>
                <Tr>
                  <Th>Tên</Th>
                  <Th>Địa điểm</Th>
                  <Th>Kinh Nghiệm</Th>
                  <Th>Mức Lương</Th>
                  <Th>Ảnh</Th>
                  <Th>
                    <IconButton
                      color="#03C9D7"
                      backgroundColor="#f7f7f7"
                      aria-label="Search database"
                      icon={<AddIcon />}
                      onClick={() => navigate("/addSuggest")}
                    />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {suggest.map((sug) => (
                  <Tr key={sug.id}>
                    <Td>{sug.name}</Td>
                    <Td>{sug.location}</Td>
                    <Td>{sug.exp}</Td>
                    <Td>{sug.salary}</Td>
                    <Td>
                      <img
                        src={
                          sug.imgLink && sug.imgLink.trim() !== ""
                            ? sug.imgLink
                            : "https://static.naukimg.com/s/0/0/i/trending-naukri/mnc.svg"
                        }
                        alt={sug.name || "Default Image"}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    </Td>
                    <Td>
                      <IconButton
                        color="#03C9D7"
                        backgroundColor="#f7f7f7"
                        aria-label="Edit suggestion"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(sug.id)} // Khi nhấn sẽ gọi handleEdit
                      />
                      <IconButton
                        color="#f768b0"
                        backgroundColor="#f7f7f7"
                        aria-label="Delete suggestion"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(sug.id)} // Khi nhấn sẽ gọi handleDelete
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </>
    );
  };
  