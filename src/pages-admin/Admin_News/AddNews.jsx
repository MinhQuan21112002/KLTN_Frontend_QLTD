import React, { useEffect, useState } from "react";
import { Box, Button, Img, Input, Stack } from "@chakra-ui/react";
import { eventService } from "../../Service/event.service";
import { ToastContainer, toast } from "react-toastify";
import { Textarea } from "@chakra-ui/react";
import { Header } from "../../Components-admin";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";
import alt_img from "../../data/product9.jpg";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
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
import ReactQuill from "react-quill";
export const AddNews = () => {
    const navigate = useNavigate();
    const newRef = collection(db, "PostNew");
    const accessToken = JSON.parse(localStorage.getItem("data")).access_token;
    const [file, setFile] = useState();
    const [form, setForm] = useState({
        Author: "",
        content: "",
        header: "",
        imgLink: alt_img,
        startTime: "",
        endTime: "",
    });
    const [errors, setErrors] = useState({});
    const handleOnChangeForm = (e) => {
        if (typeof e === 'string') {  // Nếu đây là giá trị từ ReactQuill
            setForm((prevForm) => ({
                ...prevForm,
                content: e,  // Cập nhật trực tiếp nội dung
            }));
        } else {
            const { name, value } = e.target;
            setForm((prevForm) => ({
                ...prevForm,
                [name]: value,  // Cập nhật các trường input thông thường
            }));
        }
    };
    
    
    const handleChangeFile = (event) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile({
                name: selectedFile.name,
                file: selectedFile,
            });
        } else {
            setFile(undefined);
            console.log("BUG");
        }
    };
    const handleUpload = async () => {
        if (!file) {
            toast.error("Please chose file first");
            return;
        }
        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file.file);
        await uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                // setLoading(true);
            },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    // setLoading(false);
                    setForm((prevForm) => ({ ...prevForm, imgLink: url }));
                    toast.success("image to fire base");
                });
              
            }
        );
    };
    const convertToHTML = (text) => {
        return text.split("\n").join("<br/>"); // Thay thế mỗi dấu xuống dòng bằng <br/>
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const { Author, content, header, imgLink, startTime, endTime } = form;
      
        try {
          // Thêm tài liệu mới vào Firestore trong bộ sưu tập "PostNew"
          await addDoc(newRef, {
            Author,
            content:convertToHTML(content),
            header,
            imgLink,
            startTime,
            endTime,
            // Thêm timestamp để theo dõi thời gian tạo
          });
      
          toast.success("Dữ liệu đã được lưu thành công!");
          navigate("/news"); // Điều hướng đến trang khác nếu cần
        } catch (error) {
          toast.error("Có lỗi xảy ra khi lưu dữ liệu!");
          console.error("Error adding document: ", error);
        }
      };
      

      const formats = [
        "header", 
        "bold", 
        "italic", 
        "underline", 
        "size",  // Thêm 'size' vào formats
        "list", 
        "bullet", 
        "link", 
        "image"
      ];
    
      const modules = {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          [{ "size": ["small", "medium", "large", "huge"] }] // Thêm dropdown chọn kích thước chữ
        ],
      };
      const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (form.header.trim() === "") {
            errors.title = "Title is required";
            isValid = false;
        }
        if (typeof form.content === 'string' && form.content.trim() === "") {  // Ensure it's a string before calling trim
            errors.article = "Article is required";
            isValid = false;
        }
        if (form.Author.trim() === "") {
            errors.content = "Content is required";
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };
    
    useEffect(() => {
        validateForm();
    }, [form]);

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
            <Box fontFamily={'Montserrat'} fontWeight={400} className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
                <Header category="Add New" title="Editor" />

                <Stack spacing={5}>
                    <Input
                        name="header"
                        variant="outline"
                        placeholder="Header"
                        value={form.header}
                        onChange={handleOnChangeForm}
                    />

                    <Input
                        name="Author"
                        variant="outline"
                        placeholder="Author"
                        value={form.Author}
                        onChange={handleOnChangeForm}
                    />

                    <Input
                        variant="filled"
                        placeholder="image url"
                        name="image"
                        value={form.imgLink}
                        onChange={handleOnChangeForm}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleChangeFile}
                        id="fileInput"
                        className="hidden"
                    />
                    <Img
                        src={form.imgLink}
                        onClick={() => {
                            const fileInput =
                                document.getElementById("fileInput");
                            if (fileInput) {
                                fileInput.click();
                            }
                        }}
                    />

                    <Button
                        height="50px"
                        color="white"
                        bgColor="#03C9D7"
                        text="Xem chi tiết"
                        borderRadius="10px"
                        onClick={handleUpload}
                    >
                        Save
                    </Button>


                    <Input
                        id="datepicker"
                        placeholder="Start Time"
                        name="startTime"
                        value={form.startTime}
                        size="md"
                        type="datetime-local"
                        onChange={handleOnChangeForm}
                    />
                    <br />
                    <Input
                        id="datepicker"
                        placeholder="End Time"
                        name="endTime"
                        value={form.endTime}
                        size="md"
                        type="datetime-local"
                        onChange={handleOnChangeForm}
                    />
                    <br />
                    <ReactQuill
                        value={form.content}
                     name="content"
                     onChange={handleOnChangeForm}
                        placeholder="Type something..."
                        style={{
                            height: "100%", // Chiều cao toàn bộ trình soạn thảo
                            maxHeight: "100%", // Giới hạn chiều cao nếu nội dung dài
                           // Thêm thanh cuộn dọc
                            width: "100%", // Chiều rộng tự động theo container
                            border: "1px solid #ccc", // Đường viền tùy chỉnh
                            borderRadius: "8px", // Bo góc
                        }}
                        modules={modules}
                        formats={formats}
                    />
                </Stack>
                <br />

                {/* <RichTextEditorComponent
                    value={form.content}
                    onChange={handleOnChangeForm}
                >
                    <EditorData />
                    <Inject
                        services={[
                            HtmlEditor,
                            Toolbar,
                            Image,
                            Link,
                            QuickToolbar,
                        ]}
                    />
                </RichTextEditorComponent> */}

                <br />

                <div className="mt-24">
                    <div className="flex flex-wrap lg:flex-nowrap justify-center ">
                        <div className="mt-6">
                            <Button
                                height="50px"
                                color="white"
                                bgColor="#97a4a6"
                                text="Xem chi tiết"
                                borderRadius="10px"
                                onClick={() => navigate("/news")}
                            >
                                Cancel
                            </Button>
                            <Button
                                height="50px"
                                color="white"
                                bgColor="#03C9D7"
                                text="Xem chi tiết"
                                borderRadius="10px"
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </Box>
        </>
    );
};
