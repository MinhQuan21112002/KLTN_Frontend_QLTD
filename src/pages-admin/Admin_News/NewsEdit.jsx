import React, { useEffect, useState } from "react";
import { Box, Button, Img, Input, Stack, Textarea } from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import { Header } from "../../Components-admin";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore"; 
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const NewEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();  // Lấy ID từ URL nếu bạn muốn chỉnh sửa một bài viết cụ thể
    const [file, setFile] = useState();
    const docRef = doc(db, "PostNew", id);
    const [form, setForm] = useState({
        Author: "",
        content: "",
        header: "",
        imgLink: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setForm((prev) => ({
                ...prev,
                Author: data.Author || "",
                content: data.content || "",
                header: data.header || "",
                imgLink: data.imgLink || "",
                startTime: data.startTime || "",
                endTime: data.endTime || "",
              }));
            } else {
              toast.error("Tài liệu không tồn tại!");
            }
          } catch (error) {
            toast.error("Có lỗi xảy ra khi lấy dữ liệu!");
            console.error("Error fetching document: ", error);
          }
        };
      
        fetchData();
      }, [id]);

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
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please choose a file first");
            return;
        }
        const storageRef = ref(storage, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file.file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // You can track progress if needed
            },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setForm((prevForm) => ({ ...prevForm, imgLink: url }));
                    toast.success("Image uploaded to Firebase!");
                });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            if (id) {
                // Chỉnh sửa bài viết đã tồn tại
                handleUpdate();
            } else {
                // Thêm bài viết mới
                handleAdd();
            }
        }
    };

    const handleAdd = async () => {
        const { Author, content, header, imgLink, startTime, endTime } = form;

        try {
            const newDocRef = doc(db, "PostNew", "new-id");
            await setDoc(newDocRef, {
                Author,
                content: convertToHTML(content),  // Chuyển đổi nội dung thành HTML
                header,
                imgLink,
                startTime,
                endTime,
            });

            toast.success("Data added successfully!");
            navigate("/news");
        } catch (error) {
            toast.error("Error adding document: " + error.message);
        }
    };

    const handleUpdate = async () => {
        const { Author, content, header, imgLink, startTime, endTime } = form;
        
        try {
            await updateDoc(docRef, {
                Author,
                content: convertToHTML(content),  // Chuyển đổi nội dung thành HTML
                header,
                imgLink,
                startTime,
                endTime,
            });

            toast.success("Data updated successfully!");
            navigate("/news");
        } catch (error) {
            toast.error("Error updating document: " + error.message);
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (form.header.trim() === "") {
            errors.header = "Title is required";
            isValid = false;
        }
        if (form.content.trim() === "") {
            errors.content = "Content is required";
            isValid = false;
        }
        if (form.Author.trim() === "") {
            errors.author = "Author is required";
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };

    const convertToHTML = (text) => {
        return text.split("\n").join("<br/>"); // Thay thế mỗi dấu xuống dòng bằng <br/>
    };
    const convertToText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        
        // Thay thế <br/> và <p> thành dấu xuống dòng
        let text = doc.body.innerHTML;
        text = text.replace(/<br\s*\/?>/g, "\n");  // Thay <br/> bằng \n
        text = text.replace(/<\/p>/g, "\n");  // Thay </p> bằng \n
        text = text.replace(/<p.*?>/g, ""); // Loại bỏ thẻ <p> 
    
        return text;
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
    return (
        <>
            <ToastContainer />
            <Box fontFamily={'Montserrat'} fontWeight={400} className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
                <Header category={id ? "Edit" : "Add"} title={id ? "Edit News" : "Add News"} />
                
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
                        placeholder="Image URL"
                        name="imgLink"
                        value={form.imgLink}
                        onChange={handleOnChangeForm}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleChangeFile}
                        className="hidden"
                    />
                    <Img
                        src={form.imgLink}
                        onClick={() => {
                            const fileInput = document.getElementById("fileInput");
                            if (fileInput) {
                                fileInput.click();
                            }
                        }}
                    />

                    <Button onClick={handleUpload}>Upload Image</Button>

                    <Input
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleOnChangeForm}
                    />
                    <Input
                        type="datetime-local"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleOnChangeForm}
                    />
                    
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

                <div className="mt-24">
                    <Button
                        onClick={() => navigate("/news")}
                        color="white"
                        bgColor="#97a4a6"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        color="white"
                        bgColor="#03C9D7"
                    >
                       Update
                    </Button>
                </div>
            </Box>
        </>
    );
};
