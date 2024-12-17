import { Box, Container, Text, Image, Heading, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper' // Import Autoplay module
import 'swiper/css'
import 'swiper/css/autoplay'
import { useNavigate } from 'react-router-dom'
import { companyService } from '../../Service/company.service'

const Banner = () => {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    companyService
      .getAllCompany()
      .then((res) => setCompanies(res))
      .catch((er) => console.log(er.message))
  }, [])

  return (
    <Box>
     
      <Box className='container py-1 px-4 justify-conten-center ' bg='white' mt={10}>
        <Swiper
          autoplay={{ delay: 3000, disableOnInteraction: false }} // Tự động trượt
          grabCursor={true}
          modules={[Autoplay]} // Thêm Autoplay vào modules
          className='mySwiper'
          slidesPerView={1} // Hiển thị 1 phần tử
          loop={true} // Trượt liên tục
        >
          {companies.map((company) => (
            <SwiperSlide key={company.id}>
              <Box
                onClick={() => navigate(`/companies/${company.id}`)}
                w='100%' // Chiếm 100% độ rộng
                _hover={{
                  boxShadow: 'xl',
                  transition: 'all 0.2s ease-in-out',
                  transform: 'translate(2px, -5px)',
                }}
                borderWidth='1px'
                borderRadius='20px'
                overflow='hidden'
                fontFamily={'Montserrat'}
              >
                <Image
                  h='400px'
                  w='100%'
                  objectFit='cover' // Đảm bảo ảnh hiển thị full box
                  src={company.avatar}
                  fallbackSrc='https://static.tintuc.com.vn/images/ver3/2020/02/06/1580924892844-screenshot-135.png'
                />
                <Box p='6' textAlign='center'  color='gray.500'>
                  <Text mt={2} fontWeight='semibold' fontSize='2xl'>
                    {company.name}
                  </Text>
  
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
        <Container textAlign='center' mt={10}>
         
        </Container>
      </Box>
    </Box>
  )
}

export default Banner
