import React from 'react'
import { Box, Center, Grid, GridItem, Heading, Image, Spinner } from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay } from 'swiper'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loadJob } from '../../redux/Job-posting/Action'
import { useNavigate } from 'react-router-dom'

const JobInterest = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadJob())
  }, [])

  const navigate = useNavigate()
  const jobList = useSelector((store) => store.job.data)
  const reversedJobList = [...jobList].reverse()

  if (!reversedJobList) {
    return (
      <Center w="100%" h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  // Chia danh sách công việc thành các nhóm (8 công việc mỗi slide)
  const slides = []
  for (let i = 0; i < reversedJobList.length; i += 8) {
    slides.push(reversedJobList.slice(i, i + 8)) // Mỗi slide chứa 8 công việc
  }

  return (
    <>
      <Heading fontFamily={'Montserrat'} mt={5} textAlign={'center'} fontWeight={'700'} fontSize={'27px'} lineHeight={'40px'} mb={'6px'}>
        Việc làm mới nhất
      </Heading>
      <Box className="container py-4 px-4 justify-content-center">
        <Swiper
          navigation={true} // Thêm mũi tên điều hướng
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 3000, // Tự động chuyển slide mỗi 3 giây
            disableOnInteraction: false,
          }}
          loop={true} // Kích hoạt chế độ vòng lặp
          className="mySwiper"
        >
          {slides.map((jobs, idx) => (
            <SwiperSlide key={idx}>
              <Grid
                templateColumns="repeat(4, 1fr)" // Lưới với 4 cột
                templateRows="repeat(2, auto)" // Lưới với 2 hàng
                gap={6} // Khoảng cách giữa các ô lưới
                px={5} // Padding cho container
              >
                {jobs.map((i) => (
                  i.status === true && (
                    <GridItem
                      key={i.id}
                      _hover={{
                        boxShadow: 'xl',
                        transition: 'all 0.2s ease-in-out',
                        transform: 'translate(2px, -5px)',
                      }}
                      onClick={() => navigate(`/jobDetail/${i.id}`)}
                      borderRadius={10}
                      fontFamily={'Montserrat'}
                      overflow="hidden"
                      p={4}
                    >
                      <Image w="100%" h={164} objectFit="cover" src={i.image} alt="image" borderRadius={10} />
                      <Box p="6">
                        <Box color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase">
                          {i.name}
                        </Box>
                        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1}>
                          {i.title}
                        </Box>
                        <Box m={1} fontSize="sm" color="gray.600">
                          {i.salary}
                        </Box>
                        <Box m={1} fontSize="sm" color="gray.600">
                          {i.location}
                        </Box>
                        <Box m={1} fontSize="sm" color="gray.600">
                          {i.workingForm}
                        </Box>
                      </Box>
                    </GridItem>
                  )
                ))}
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </>
  )
}

export default JobInterest
