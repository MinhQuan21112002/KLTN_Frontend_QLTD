import { Box, Button, Flex, Grid, GridItem, Image } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

const JobButton = () => {
  const compony = [
    {
      id: 1,
      src: 'https://static.naukimg.com/s/0/0/i/trending-naukri/remote.svg',
    },
  ]
  return (
    <div>
      <Box width='80%' margin='auto' mt={16}>
        <Grid h='170px' templateRows='repeat(auto, 2fr)'>
          <Flex justifyContent='space-evenly'>
          <Link to="/jobpage-search/nhân viên/Hồ Chí Minh/all/all">
      <Button
        textAlign="center"
        h="70px"
        width="150px"
        bg="white"
        boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
        borderTopLeftRadius={20}
        borderBottomRightRadius={20}
        _hover={{
          bg: 'white',
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        }}
      >
        <Image
          src="https://static.naukimg.com/s/0/0/i/trending-naukri/remote.svg"
          height={10}
        />{' '}
        <p>Remote</p>
      </Button>
    </Link>
            <Button
              textAlign='center'
              h='70px'
              width='140px'
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/mnc.svg' height={10} /> <p>Sale</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='190px'
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/finance.svg' height={10} /> <p>Ngân Hàng</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='190px'
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/temporary-wfh.svg' height={10} /> <p>Part-time</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='170px'
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/fortune-500.svg' height={10} /> <p>Giáo viên</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='170px'
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/project-management.svg' height={10} /> <p>Quản lý</p>
            </Button>
          </Flex>
          <Flex justifyContent='center'>
            <Button
              textAlign='center'
              h='70px'
              width='130px'
              mr={5}
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/hr.svg' height={10} /> <p>HR</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='170px'
              mr={5}
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/data-science.svg' height={10} /> <p>Phân tích data</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='170px'
              mr={5}
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/analytics.svg' height={10} /> <p>Kế Toán</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='190px'
              mr={5}
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/engineering.svg' height={10} /> <p>Lập trình viên</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='170px'
              mr={5}
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/startup.svg' height={10} /> <p>Full-Time</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='170px'
              mr={5}
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/startup.svg' height={10} /> <p>Fresher</p>
            </Button>
            <Button
              textAlign='center'
              h='70px'
              width='170px'
              mr={5}
              bg='white'
              boxShadow='rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px'
              borderTopLeftRadius={20}
              borderBottomRightRadius={20}
              _hover={{
                bg: 'white',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              }}>
              <Image src='https://static.naukimg.com/s/0/0/i/trending-naukri/startup.svg' height={10} /> <p>Senior</p>
            </Button>
          </Flex>
        </Grid>
      </Box>
    </div>
  )
}

export default JobButton
