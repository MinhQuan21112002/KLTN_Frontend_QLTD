import React, { useEffect, useState } from 'react'
import { eventService } from '../../Service/event.service'
import { ToastContainer, toast } from 'react-toastify'
import { Box, Center, Heading, Image, SimpleGrid, SlideFade, Spinner, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase' // Đảm bảo bạn đã import đúng đối tượng db từ firebase config
import { collection, getDocs } from 'firebase/firestore' // Import hàm lấy dữ liệu từ Firestore
import { SwiperSlide } from 'swiper/react'

export const NewContainer = () => {
  const [news, setNews] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "PostNew")) // Lấy toàn bộ tin tức từ Firestore
        const fetchedEvents = []
        querySnapshot.forEach((doc) => {
          fetchedEvents.push({ ...doc.data(), id: doc.id }) // Lấy dữ liệu và id của mỗi document
        })
        setNews(fetchedEvents) // Lưu vào state
      } catch (error) {
        console.error("Error fetching events: ", error.message)
      }
    }

    fetchData() // Gọi hàm để tải dữ liệu
  }, [])

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

  return (
    <VStack width={'100vw'} align={'flex-start'} m={2} p={2}>
      {!news ? (
        <Center direction='row' spacing={4} w={'80vw'} h={'20vw'}>
          <Spinner color='blue.500' size='xl' />
        </Center>
      ) : (
        <SimpleGrid columns={3} spacing={5}>
           {news.map((new2) => (
              <SwiperSlide key={new2.id}>
                <Box
                  _hover={{
                    boxShadow: 'xl',
                    transition: 'all 0.2s ease-in-out',
                    transform: 'translate(2px, -5px)',
                  }}
                  fontFamily={'Montserrat'}
                  onClick={() => navigate(`/news/${new2.id}`)}
                  maxW='sm'
                  borderRadius='lg'
                  mt={3}
                  overflow='hidden'>
                  <Image src={new2.imgLink} alt={new2.header} />
                  <Box p='6'>
                    <Box display='flex' alignItems='baseline'>
                      <Box color='black' fontWeight='bold' letterSpacing='wide' fontSize='xl' textTransform='uppercase'>
                        {new2.header}
                      </Box>
                    </Box>
                    <Box>
                      <Box as='span' color='gray.600' fontSize='sm'>
                        by : {new2.Author}
                      </Box>
                    </Box>
                    <Box display='flex' mt='2' alignItems='center'>
                      <Box as='span' color='gray.600' fontSize='sm'>
                        {formatDate(new2.startTime)}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
        </SimpleGrid>
      )}

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
    </VStack>
  )
}
