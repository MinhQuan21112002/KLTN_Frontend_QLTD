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
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from '@chakra-ui/react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
export const EventEdit = () => {
    const params = useParams();
    const naigate = useNavigate();
    const accessToken = JSON.parse(localStorage.getItem("data")).access_token;
    const [file, setFile] = useState();
    const [form, setForm] = useState({
        id: 0,
        title: "",
        article: "",
        time: "",
        status: true,
        image: alt_img,
        content: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
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
                setLoading(true);
            },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setLoading(false);
                    setForm((prevForm) => ({ ...prevForm, image: url }));
                    toast.success("image to fire base");
                });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            await eventService
                .putEvent(form, accessToken, form.id)
                .then((response) => toast.success(response.message))
                .catch((error) => toast.error(error.message));
        } else {
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;
        if (form.title.trim() == "") {
            errors.title = "Title is required";
            isValid = false;
        }
        if (form.article.trim() == "") {
            errors.article = "Article is required";
            isValid = false;
        }
        if (form.content.trim() == "") {
            errors.content = "Content is required";
            isValid = false;
        }
        setErrors(errors);
        return isValid;
    };
    useEffect(() => {
        validateForm();
    }, [form]);

    useEffect(() => {
        eventService
            .getEventById(params.id)
            .then((response) => setForm(response))
            .catch((error) => toast.error(error.message));
    }, []);

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
                <Header category="Edit Event" title="Editor" />

                <Stack spacing={5}>
                    <Input
                        name="title"
                        variant="outline"
                        placeholder="title"
                        value={form.title}
                        onChange={handleOnChangeForm}
                    />

                    <Input
                        name="article"
                        variant="outline"
                        placeholder="article"
                        value={form.article}
                        onChange={handleOnChangeForm}
                    />

                    <Input
                        variant="filled"
                        placeholder="image url"
                        name="image"
                        value={form.image}
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
                        src={form.image}
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
                       {loading ? (<Spinner />) :(<>Save Img</>) }
                    </Button>

                    {/* <DatePickerComponent
                        id="datepicker"
                        placeholder="Time"
                        name="time"
                        value={form.time}
                        onChange={handleOnChangeForm}
                    /> */}

                    <Input
                        id="datepicker"
                        placeholder="Select Date and Time"
                        name="time"
                        value={form.time}
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
                                onClick={() => naigate("/event")}
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
