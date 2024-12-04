import { Box, Button, Container, Flex, Heading, Image, Input, Select, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import JobButton from './JobButton'
import 'swiper/css'
import 'swiper/css/navigation'
import JobInterest from './JobInterest'
import JobSlider from './JobSlider'
import FeatureCompony from './FeatureCompony'
import { useNavigate } from 'react-router-dom'
import Cookies from "universal-cookie";
import News from './News'
const cookies = new Cookies();
const HomePage = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("refreshToken"));
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('userInfo'))
  const [search, setSearch] = useState({
    keyword: '',
    location: 'all',
    experience: 'all',
    salary: 'all',
  })
  console.log(isAuth);
  const handleChangeSearch = (e) => {
    const { name, value } = e.target
    setSearch((search) => ({ ...search, [name]: value }))
  }

  const handleSearch = () => {
    if (search.keyword !== '') {
      navigate(`/jobpage-search/${search.keyword}/${search.location}/${search.experience}/${search.salary}`)
    } else {
      navigate(`/jobpage-search/${search.location}/${search.experience}/${search.salary}`)
    }
  }

  return (
    <Box>
      <Container mb={'28px'} h={'80px'} maxW={'100%'}>
        <Heading fontFamily={'Montserrat'} textAlign={'center'} fontWeight={'700'} fontSize={'35px'} lineHeight={'50px'} mb={'6px'} mt={'104px'}>
          Tìm việc làm nhanh 24h, việc làm mới nhất
        </Heading>
      </Container>
      <Container h={'70px'} maxW={'100%'}>
        <Flex boxShadow='base' p='6' rounded='md' bg='white' w={'995px'} h={'100%'} m={'auto'} borderRadius={'50px'} pl={'24px'} pr={'9px'} py={'9px'}>
          <Box w={'28px'} display={'flex'} alignItems={'center'}>
            <Image mr={'8px'} w={'20px'} h={'20px'} src='https://static.naukimg.com/s/7/103/i/search.9ec0e1ac.svg' />
          </Box>
          <Box w={'340px'} h={'100%'} pr={'12px'} py={'4px'} pl={'4px'}>
            <Input fontFamily={'Montserrat'} value={search.keyword} name='keyword' onChange={handleChangeSearch} border={'none'} color={'#8292b4'} placeholder='vị trí tuyển dụng' />
          </Box>
          <Box w={'223px'} h={'100%'} pr={'0px'} pt={'4px'} pl={'10px'} pb={'6px'}>
            <Select fontFamily={'Montserrat'} onChange={handleChangeSearch} name='location' color={'#8292b4'} border={'none'} defaultValue='all'>
            <option value='all'>Địa điểm</option>
                    <option value='Hồ Chí Minh'>Hồ Chí Minh</option>
<option value='Đà Nẵng'>Đà Nẵng</option>
<option value='Hà Nội'>Hà Nội</option>
<option value='Cần Thơ'>Cần Thơ</option>
<option value='Hải Phòng'>Hải Phòng</option>
<option value='Quảng Ninh'>Quảng Ninh</option>
<option value='Thừa Thiên Huế'>Thừa Thiên Huế</option>
<option value='Bình Dương'>Bình Dương</option>
<option value='Đồng Nai'>Đồng Nai</option>
<option value='Khánh Hòa'>Khánh Hòa</option>
<option value='Lâm Đồng'>Lâm Đồng</option>
<option value='Nghệ An'>Nghệ An</option>
<option value='Thanh Hóa'>Thanh Hóa</option>
<option value='Bình Thuận'>Bình Thuận</option>
<option value='Bà Rịa - Vũng Tàu'>Bà Rịa - Vũng Tàu</option>
<option value='Kiên Giang'>Kiên Giang</option>
<option value='An Giang'>An Giang</option>
<option value='Bắc Ninh'>Bắc Ninh</option>
<option value='Hà Nam'>Hà Nam</option>
<option value='Thái Nguyên'>Thái Nguyên</option>
<option value='Quảng Ngãi'>Quảng Ngãi</option>
            </Select>
          </Box>
          <Box w={'223px'} h={'100%'} pr={'0px'} pt={'4px'} pl={'10px'} pb={'6px'}>
            <Select fontFamily={'Montserrat'} onChange={handleChangeSearch} name='experience' color={'#8292b4'} border={'none'} defaultValue='all'>
              <option value='all'>Kinh nghiệm</option>
              <option value='chưa có'>chưa có</option>
              <option value='dưới 1 năm'>dưới 1 năm</option>
              <option value='1 năm'>1 năm</option>
              <option value='2 năm'>2 năm</option>
              <option value='3 năm'>3 năm</option>
              <option value='4 năm'>4 năm</option>
              <option value='5 năm'>5 năm</option>
              <option value='trên 5 năm'>trên 5 năm</option>
            </Select>
          </Box>
          <Box w={'223px'} h={'100%'} pr={'0px'} pt={'4px'} pl={'10px'} pb={'6px'}>
            <Select fontFamily={'Montserrat'} onChange={handleChangeSearch} name='salary' color={'#8292b4'} border={'none'} defaultValue='all'>
              <option value='all'>Mức lương</option>
              <option value='Dưới 10 triệu'>Dưới 10 triệu</option>
              <option value='10 -15 triệu'>10 -15 triệu</option>
              <option value='15 -20 triệu'>15 -20 triệu</option>
              <option value='20 -25 triệu'>20 -25 triệu</option>
              <option value='25 -30 triệu'>25 -30 triệu</option>
              <option value='30 -50 triệu'>30 -50 triệu</option>
              <option value='trên 50 triệu'>trên 50 triệu</option>
              <option value='thỏa thuận'>thỏa thuận</option>
            </Select>
          </Box>
          <Button fontFamily={'Montserrat'} onClick={handleSearch} color={'white'} fontWeight={'600'} fontSize={'19px'} bgColor={'#457eff'} borderRadius={'50px'} h={'48px'} w={'120px'} px={'28px'} py={'11px'}>
            Search
          </Button>
        </Flex>
      </Container>
      <JobInterest />
      <JobButton />
      <FeatureCompony />

      {/* event */}
      <JobSlider />
      {/* <DiscoverJob />
      <JobOption /> */}
       <News />
    </Box>
  )
}

export default HomePage
