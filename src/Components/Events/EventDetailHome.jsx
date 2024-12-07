import { Badge, Box, Button, Center, HStack, Heading, IconButton, Image, SlideFade, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { eventService } from '../../Service/event.service'
import { ArrowForwardIcon, CopyIcon } from '@chakra-ui/icons'
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css";
export const EventDetailHome = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState({
    id: 0,
    title: '',
    article: '',
    time: '',
    status: true,
    image: '',
    content: '',
  })

  useEffect(() => {
    eventService.getEventById(params.id).then((res) => {
      setEvent(res)
    })
  }, [])
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
    <VStack fontFamily={'Montserrat'} m={2} p={2}>
      <SlideFade in={true} offsetY={20}>
        <Heading size={'lg'} m={'6'} mt={24} ml={2} textAlign={'left'} marginRight='auto'></Heading>
      </SlideFade>
      <HStack align={'flex-start'} w={'70vw'} alignItems={'center'} display={'flex'} justifyContent={'center'}>
        <Box maxW='960px' borderWidth='1px' borderRadius='lg' overflow='hidden' w={'100%'}>
          <Image src={event.image} alt='Image' />

          <Box p='6'>
            <Box display='flex' mt={2} alignItems='baseline'>
              <Badge borderRadius='full' px='2' colorScheme='teal'>
                Author
              </Badge>
              <Box color='gray.500' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase' ml='2'>
                {event.author}
              </Box>
            </Box>
            <Box display='flex' mt={2} alignItems='baseline'>
              <Badge borderRadius='full' px='2' colorScheme='teal'>
                Time
              </Badge>
              <Box color='gray.500' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase' ml='2'>
                {event.time}
              </Box>
            </Box>

            <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={1}>
              {event.title}
            </Box>

            <Box>{event.article}</Box>
          </Box>
        </Box>
      </HStack>
      <HStack align={'flex-start'} w={'70vw'} alignItems={'center'} display={'flex'} justifyContent={'center'}>
        <Box maxW='960px' borderWidth='1px' borderRadius='lg' overflow='hidden' w={'100vw'}>
        <ReactQuill
      value={event.content}
      name="content"
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
