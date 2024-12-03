import React from 'react'
import { Badge, Box, Center, Container, Flex, Grid, Heading, Image, Spinner, Text } from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { loadJob } from '../../redux/Job-posting/Action'
import uuid from 'react-uuid'
import { Link, useNavigate } from 'react-router-dom'
import { StarIcon } from '@chakra-ui/icons'
import { BsCalendar2DayFill, BsCurrencyDollar } from 'react-icons/bs'
import { BiDollar, BiLocationPlus } from 'react-icons/bi'

const JobInterest = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadJob())
  }, [])
  const navigate = useNavigate()

  const jobList = useSelector((store) => store.job.data)
  if (jobList !== null)
    return (
      <>
        <Heading fontFamily={'Montserrat'} mt={5} textAlign={'center'} fontWeight={'700'} fontSize={'27px'} lineHeight={'40px'} mb={'6px'}>
          Việc làm mới nhất
        </Heading>
        <Box className='container py-4 px-4 justify-conten-center '>
          <Swiper display='flex' slidesPerView={4} navigation={true} modules={[Navigation]} className='mySwiper'>
            {jobList !== null ? (
              jobList
                .map((i) => {
                  return i.status === true ? (
                    <SwiperSlide>
                      <Box
                        _hover={{
                          boxShadow: 'xl',
                          transition: 'all 0.2s ease-in-out',
                          transform: 'translate(2px, -5px)',
                        }}
                        m={5}
                        onClick={() => navigate(`/jobDetail/${i.id}`)}
                        key={uuid()}
                        maxW='sm'
                        h={330}
                        borderRadius={20}
                        fontFamily={'Montserrat'}
                        overflow='hidden'>
                        <Image w={277} h={164} src={i.image} alt='image' />

                        <Box p='6'>
                          <Box display='flex' alignItems='baseline'>
                            <Box color='gray.500' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase'>
                              {i.name}
                            </Box>
                          </Box>

                          <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={1}>
                            {i.title}
                          </Box>

                          <Box m={1} display='flex'>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z'
                              />
                            </svg>
                            <Box ml={2} as='span' color='gray.600' fontSize='sm'>
                              {i.salary}
                            </Box>
                          </Box>

                          <Box m={1} display='flex' mt='2' alignItems='center'>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                              <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
                              <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' />
                            </svg>
                            <Box ml={2} as='span' color='gray.600' fontSize='sm'>
                              {i.location}
                            </Box>
                          </Box>

                          <Box m={1} display='flex' mt='2' alignItems='center'>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-6 h-6'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z'
                              />
                            </svg>
                            <Box ml={2} as='span' color='gray.600' fontSize='sm'>
                              {i.workingForm}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </SwiperSlide>
                  ) : (
                    <div></div>
                  )
                })
                .slice(0)
            ) : (
              <Center direction='row' spacing={4} w={'80vw'} h={'20vw'}>
                <Spinner color='blue.500' size='xl' />
              </Center>
            )}
          </Swiper>
        </Box>
      </>
    )
}

export default JobInterest
