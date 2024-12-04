import React, { useEffect, useState } from 'react'
import { IoIosMore } from 'react-icons/io'
import { Box, Button, IconButton, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react'
import product9 from '../../data/product9.jpg'
import { eventService } from '../../Service/event.service'
import { ToastContainer, toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Header } from '../../Components-admin'
import { deleteDoc, doc } from 'firebase/firestore';

import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
export const AllNews = () => {
  const accessToken = JSON.parse(localStorage.getItem('data')).access_token
  const newRef = collection(db, "PostNew");
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState()
  const naigate = useNavigate()
  const convertToText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    
    // Thay thế <br/> và <p> thành dấu xuống dòng
    let text = doc.body.innerHTML;
    text = text.replace(/<br\s*\/?>/g, "\n");  // Thay <br/> bằng \n
    text = text.replace(/<\/p>/g, "\n");  // Thay </p> bằng \n
    text = text.replace(/<p.*?>/g, ""); // Loại bỏ thẻ <p> 

    return text;
};



  // Lấy dữ liệu từ Firestore
  useEffect(() => {
    const queryRooms = query(newRef);
    const unsubscribe = onSnapshot(queryRooms, (snapshot) => {
      const roomsSet = new Map();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          roomsSet.set(data, { ...data, id: doc.id });
        }
      });
      setNews(Array.from(roomsSet.values()));
    });

    return () => unsubscribe();
  }, []);


  console.log(news)

  const handleDelete = async (id) => {
    try {
      // Tạo tham chiếu đến tài liệu cần xóa
      const docRef = doc(db, "PostNew", id);

      // Thực hiện xóa tài liệu
      await deleteDoc(docRef);

      // Hiển thị thông báo thành công
      toast.success("Post deleted successfully!");

      // Cập nhật lại danh sách bài viết sau khi xóa
      setNews((prevNews) => prevNews.filter((item) => item.id !== id));
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có vấn đề xảy ra
      toast.error("Error deleting post: " + error.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await eventService.getMyEvent(accessToken)
        setEvents(response)
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchData()
  }, [events])


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
  

  if (news === undefined) {
    return (
      <div className='m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Header category='App' title='News' />
        <Stack>
          <Skeleton height='50px' />
          <Skeleton height='50px' />
          <Skeleton height='50px' />
        </Stack>
      </div>
    )
  } else if (news.length === 0) {
    return (
      <Box
        fontFamily={'Montserrat'}
        fontWeight={400}
        className='m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Header category='App' title='News' />
        <Button
          mb={10}
          height='50px'
          color='white'
          bgColor='#03C9D7'
          text='Xem chi tiết'
          borderRadius='10px'>
          <Link to='/event/add'>Add</Link>
        </Button>
        <Text>You don't have any new</Text>
      </Box>
    )
  } else
    return (
      <>
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />

        <Box
          fontFamily={'Montserrat'}
          fontWeight={400}
          className='m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
          <Header title='Event' />

          <Button color='white' bgColor='#03C9D7' text='Xem chi tiết' borderRadius='10px'>
            <Link to='/addNews'>+ Add New</Link>
          </Button>

          <div className='mt-5'>
            <div className='flex flex-wrap'>
              {news.map((new2) => (
                  <Box
                    borderWidth={1}
                    key={new2.id}
                    className='w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3'>
                    <div className='flex justify-between'>
                    <p className="font-semibold text-2xl uppercase">{new2.header}</p>
                    <p></p>
                      <button type='button' className='text-xl font-semibold text-gray-500'>
                        <IoIosMore />
                      </button>
                    </div>
                    <div className='mt-10'>
                      <img className='md:w-96 h-50 ' src={new2.imgLink} alt={product9} />
                      <div className='mt-8'>
                    
                        <p className='font-semibold text-lg'>{new2.Author}</p>
                        <p className='text-gray-400 '>Start Time : {formatDate(new2.startTime)}</p>
                        <p className='text-gray-400 '>End Time   : {formatDate(new2.endTime)}</p>
                        <pre>{convertToText(new2.content).slice(0, 200)}...</pre>

                        <div className='mt-3'>
                          <IconButton
                            color='#03C9D7'
                            backgroundColor='#f7f7f7'
                            aria-label='Search database'
                            icon={<EditIcon />}
                           onClick={() => naigate(`/editNews/${new2.id}`)}
                          />
                       <IconButton
                        color='#e85f76'
                        backgroundColor='#f7f7f7'
                        aria-label='Delete post'
                        icon={<DeleteIcon />}
                        value={new2.id}
                        onClick={() => handleDelete(new2.id)}  // Gọi hàm xóa với ID của bài viết
                      />
                        </div>
                      </div>
                    </div>
                  </Box>
                ))}
            </div>
          </div>
        </Box>
      </>
    )
}
