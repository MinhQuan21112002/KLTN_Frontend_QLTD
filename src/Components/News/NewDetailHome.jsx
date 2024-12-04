import { Badge, Box, Button, Center, HStack, Heading, IconButton, Image, SlideFade, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { eventService } from '../../Service/event.service'
import { ArrowForwardIcon, CopyIcon } from '@chakra-ui/icons'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore"; 
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css";
export const NewDetailHome = () => {
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
        // Lấy dữ liệu tài liệu từ Firestore bằng ID
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
  
          // Chỉ gán dữ liệu từ Firestore vào form nếu form còn trống
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
  
    // Gọi hàm fetchData khi ID thay đổi hoặc component mount
    fetchData();
  }, [id]); // Thêm `id` vào dependency để tải lại dữ liệu khi ID thay đổi
  const convertToText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    
    // Thay thế <br/> và <p> thành dấu xuống dòng
    let text = doc.body.innerHTML;
    text = text.replace(/<br\s*\/?>/g, "\n");  // Thay <br/> bằng \n
    text = text.replace(/<\/p>/g, "\n");  // Thay </p> bằng \n
    text = text.replace(/<p.*?>/g, ""); // Loại bỏ thẻ <p> 

    return text;
};
  function formatDate(inputDate) {
    if (!inputDate) {
      return 'Invalid date'; // Giá trị mặc định khi inputDate là null hoặc undefined
    }
  
    // Kiểm tra nếu inputDate là timestamp từ Firebase
    if (typeof inputDate === 'object' && inputDate.seconds) {
      inputDate = new Date(inputDate.seconds * 1000); // Chuyển timestamp sang Date
    } else {
      inputDate = new Date(inputDate); // Nếu là giá trị hợp lệ, dùng trực tiếp
    }
  
    if (isNaN(inputDate.getTime())) {
      return 'Invalid date'; // Giá trị khi inputDate không hợp lệ
    }
  
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  
    const year = inputDate.getFullYear();
    const month = months[inputDate.getMonth()];
    const day = inputDate.getDate();
    return `${month} ${day}, ${year}`;
  }
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
  const [editorHeight, setEditorHeight] = useState(500);  // Giá trị chiều cao mặc định
  const handleEditorChange = (value) => {
    setForm({ ...form, content: value });
    
    // Cập nhật chiều cao dựa trên nội dung
    const contentLength = value.length;
    const minHeight = 100;  // Chiều cao tối thiểu
    const lineHeight = 20;  // Chiều cao mỗi dòng
    setEditorHeight(Math.max(minHeight, contentLength / 20 * lineHeight));
  };
  return (
    <VStack fontFamily={'Montserrat'} m={2} p={2}>
      <SlideFade in={true} offsetY={20}>
        <Heading size={'lg'} m={'6'} mt={24} ml={2} textAlign={'left'} marginRight='auto'></Heading>
      </SlideFade>
      <HStack align={'flex-start'} w={'70vw'} alignItems={'center'} display={'flex'} justifyContent={'center'}>
        <Box maxW='960px' borderWidth='1px' borderRadius='lg' overflow='hidden' w={'100%'}>
          <Image src={form.imgLink} alt='Image' />

          <Box p='6'>
            <Box display='flex' mt={2} alignItems='baseline'>
              <Badge borderRadius='full' px='2' colorScheme='teal'>
                Author
              </Badge>
              <Box color='gray.500' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase' ml='2'>
                {form.Author}
              </Box>
            </Box>
            <Box display='flex' mt={2} alignItems='baseline'>
              <Badge borderRadius='full' px='2' colorScheme='teal'>
                Time
              </Badge>
              <Box color='gray.500' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase' ml='2'>
                {formatDate(form.startTime)}
              </Box>
            </Box>

            <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={1}>
              {form.header}
            </Box>
          </Box>
        </Box>
      </HStack>
      <HStack align={'flex-start'} w={'70vw'} alignItems={'center'} display={'flex'} justifyContent={'center'}>
        <Box maxW='960px' borderWidth='1px' borderRadius='lg' overflow='hidden' w={'100vw'}>
       
        <ReactQuill
      value={form.content}
      name="content"
      onChange={handleEditorChange}
      placeholder="Type something..."
      style={{
        height: '100%',  // Chiều cao tự động thay đổi theo nội dung
        maxHeight: "100%",  // Không giới hạn chiều cao tối đa
        // Thêm thanh cuộn dọc nếu cần
        width: "100%",  // Chiều rộng tự động theo container
        border: "1px solid #ccc",  // Đường viền tùy chỉnh
        borderRadius: "8px",  // Bo góc
      }}
      modules={{}}  
      readOnly={true}  // Chế độ chỉ đọc
    />
       
        </Box>
      </HStack>
    </VStack>
  )
}
