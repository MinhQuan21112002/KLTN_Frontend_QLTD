import React, { useId, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import {
  Box,
  Flex,
  Text,
  Image,
  Badge,
  Select,
  HStack,
  VStack,
  Button,
  Textarea,
  Input,
} from '@chakra-ui/react'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import './style4.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { loadJob } from '../../redux/Job-posting/Action'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase.js'
import { hostName } from '../../global.js'
const JobPosting = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    // getData(typeOfProduct).then((res) => setProductArr(res));
    dispatch(loadJob())
  }, [])

  const data = useSelector((store) => store.job.data)
  if (data !== null) {
    console.log(data.length)
  }
  const jobList = data !== null ? data.slice(data.length - 3, data.length) : []
  const [passShow, setPassShow] = useState(false)
  const [cpassShow, setCPassShow] = useState(false)
  const navigate = useNavigate()

  const accessToken = JSON.parse(localStorage.getItem('data')).access_token
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [language, setLanguage] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [number, setNumber] = useState('')
  const [workingForm, setWorkingForm] = useState('')
  const [sex, setSex] = useState('')
  const [experience, setExperience] = useState('')
  const [detailLocation, setDetailLocation] = useState('')
  const [detailJob, setDetailJob] = useState('')
  const [requirements, setRequirements] = useState('')
  const [interest, setInterest] = useState('')
  const [image, setImage] = useState()

  async function uploadToFirebase(file) {
    if (!file) {
      console.error("File không tồn tại");
      return null;
    }
    try {
      // Tạo tham chiếu đến Firebase Storage
      const storageRef = ref(storage, `uploads/${file.name}`);
  
      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      // Lắng nghe trạng thái upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload đang thực hiện: ${progress}%`);
        },
        (error) => {
          console.error("Lỗi upload:", error);
        }
      );
  
      // Hoàn thành và lấy URL của ảnh
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File đã lưu tại:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi upload file:", error);
      return null;
    }
  }
  let img = []
  console.log(image)
  const HandleSubmit = async (e) => {
    
    console.log(image)
       
    if (image != null ) {
      const downloadURL = await uploadToFirebase(image);
      if (downloadURL) {
        img.push(downloadURL);
        console.log("Image đã lưu tại URL:", img.at(0));
      }
      
    } else {
      console.log('img bi null r ')
    }


    if (name === '') {
      toast.warning('name is required!', {
        position: 'top-center',
      })
    } else if (position === '') {
      toast.error('position is required!', {
        position: 'top-center',
      })
    } else if (salary === '') {
      toast.error('salary is required!', {
        position: 'top-center',
      })
    } else if (workingForm === '') {
      toast.error('workingForm is required!', {
        position: 'top-center',
      })
    } else if (location === '') {
      toast.error('location is required!', {
        position: 'top-center',
      })
    } else if (language === '') {
      toast.error('language is required!', {
        position: 'top-center',
      })
    } else if (sex === '') {
      toast.error('sex is required!', {
        position: 'top-center',
      })
    } else if (number === '') {
      toast.error('number is required!', {
        position: 'top-center',
      })
    } else if (detailLocation === '') {
      toast.error('detailLocation is required!', {
        position: 'top-center',
      })
    } else if (experience === '') {
      toast.error('experience is required!', {
        position: 'top-center',
      })
    } else if (detailJob === '') {
      toast.error('detailJob is required!', {
        position: 'top-center',
      })
    } else if (requirements === '') {
      toast.error('requirements is required!', {
        position: 'top-center',
      })
    } else if (interest === '') {
      toast.error('interest is required!', {
        position: 'top-center',
      })
    } else if (image === null) {
      toast.error('image is required!', {
        position: 'top-center',
      })
    } else {
      try {

    
       
        const imageData = img.at(0);

        console.log("hinh ne "+img.at(0));
        let data = JSON.stringify({
          name,
          position,
          language,
          location,
          salary,
          number,
          workingForm,
          sex,
          experience,
          detailLocation,
          detailJob,
          requirements,
          interest,
          image: imageData,
        })

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${hostName}/job-posting`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          data: data,
        }

        axios
          .request(config)
          .then((response) => {
            console.log('ok')
          })
          .catch((error) => {
            console.log(error)
            toast.error('Upload Job Failed', {
              position: 'top-center',
            })
          })

        toast.success('Upload Job Successfuly', {
          position: 'top-center',
        })
        window.location.replace(`/job-posting`)
      } catch (error) {}
    }
  }

  const userId = JSON.parse(localStorage.getItem('data')).data.userInfo.id

  return (
    <>
      <VStack>
        <Box fontFamily={'Montserrat'} fontWeight={400} w='70%'>
          <div className='form_data6'>
            <div className='form_heading'>
              <h2
                style={{
                  color: '#000000',
                  fontSize: '30px',
                  padding: '10px',
                  borderRadius: '10px',
                }}>
                Đăng tin tuyển dụng
              </h2>
            </div>

            <form>
              <div>
                <label htmlFor='name'>
                  <Badge borderRadius='full' fontSize='14px' p='2'>
                    Tên công việc
                  </Badge>
                </label>
                <Input
                  mt={3}
                  mb={5}
                  w={'100%'}
                  backgroundColor={'#ffffff'}
                  fontSize={20}
                  type='text'
                  onChange={(e) => setName(e.target.value)}
                  name='name'
                  id='Name'
                />
              </div>

              <div>
                <label htmlFor='name'>
                  <Badge borderRadius='full' fontSize='14px' p='2' >
                    Địa chỉ làm việc
                  </Badge>
                </label>

                <Input
                  mt={3}
                  mb={5}
                  w={'100%'}
                  backgroundColor={'#ffffff'}
                  fontSize={20}
                  type='position'
                  onChange={(e) => setDetailLocation(e.target.value)}
                  name='position'
                  id='position'
                />
              </div>
              <div class='flex-container'>
                <div className='form_input flex' style={{ heigth: '20% !important' }}>
                  <div
                    htmlFor='name'
                    style={{ display: 'block', paddingTop: '7%', paddingRight: '2%' }}>
                    <Badge borderRadius='full' fontSize='14px' x p='2' >
                      Mức lương
                    </Badge>
                  </div>
                  <Select
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    mt={6}
                    onChange={(e) => setSalary(e.target.value)}
                    defaultValue='all'>
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
                </div>
                <Box mt={4} className='flex' style={{ marginLeft: '10px' }}>
                  <HStack>
                    <Box htmlFor='name' style={{ display: 'block', paddingRight: '2%' }}>
                      <Badge borderRadius='full' fontSize='14px' p='2'>
                        Hình thức làm việc
                      </Badge>
                    </Box>
                    <Input
                      w={'100%'}
                      backgroundColor={'#ffffff'}
                      fontSize={20}
                      onChange={(e) => setWorkingForm(e.target.value)}
                      type='text'
                      name='workingForm'
                      id='workingForm'
                    />
                  </HStack>
                </Box>
              </div>

              <div class='flex-container'>
                <div className='form_input flex'>
                  <div
                    htmlFor='name'
                    style={{ display: 'block', paddingTop: '7%', paddingRight: '2%' }}>
                    <Badge borderRadius='full' fontSize='14px' p='2' >
                      Địa điểm
                    </Badge>
                  </div>
                  <Select
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    mt={6}
                    defaultValue='all'
                    onChange={(e) => setLocation(e.target.value)}>
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
                </div>
                <Box mt={6} className='flex' style={{ marginLeft: '10px' }}>
                  <div htmlFor='name' style={{ display: 'block', paddingRight: '2%' }}>
                    <Badge borderRadius='full' fontSize='14px' p='2' >
                      Ngôn ngữ
                    </Badge>
                  </div>
                  <Input
                    w={'100%'}
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    onChange={(e) => setLanguage(e.target.value)}
                    type='text'
                    name='language'
                    id='language'
                  />
                </Box>
              </div>

              <div class='flex-container'>
                <div className='form_input flex'>
                  <div
                    htmlFor='name'
                    style={{ display: 'block', paddingTop: '7%', paddingRight: '2%' }}>
                    <Badge borderRadius='full' fontSize='14px' x p='2'>
                      Giới tính
                    </Badge>
                  </div>
                  <Select
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    mt={6}
                    onChange={(e) => setSex(e.target.value)}
                    defaultValue='NONE'>
                    <option value='MALE'>Nam</option>
                    <option value='FEMALE'>Nữ</option>
                    <option value='NONE'>Không yêu cầu</option>
                  </Select>
                </div>
                <Box className='flex' style={{ marginLeft: '10px' }}>
                  <div
                    htmlFor='name'
                    style={{ display: 'block', paddingTop: '7%', paddingRight: '2%' }}>
                    <Badge borderRadius='full' fontSize='14px' x p='2'>
                      Số lượng
                    </Badge>
                  </div>
                  <Input
                    mt={6}
                    w={'100%'}
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    onChange={(e) => setNumber(e.target.value)}
                    type='text'
                    name='number'
                    id='number'
                  />
                </Box>
              </div>

              <div class='flex-container'>
                <Box className='flex'>
                  <div
                    htmlFor='name'
                    style={{ display: 'block', paddingTop: '7%', paddingRight: '2%' }}>
                    <Badge borderRadius='full' fontSize='14px' x p='2' >
                      Vị trí tuyển dụng
                    </Badge>
                  </div>
                  <Input
                    mt={6}
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    onChange={(e) => setPosition(e.target.value)}
                    type='text'
                    name='detailLocation'
                    id='detailLocation'
                  />
                </Box>
                <div className='form_input flex' style={{ marginLeft: '10px' }}>
                  <div
                    htmlFor='name'
                    style={{ display: 'block', paddingTop: '7%', paddingRight: '2%' }}>
                    <Badge borderRadius='full' fontSize='14px' x p='2'>
                      Kinh nghiệm
                    </Badge>
                  </div>
                  <Select
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    onChange={(e) => setExperience(e.target.value)}
                    mt={6}
                    defaultValue={'Chưa có'}>
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
                </div>
              </div>

              <div className='form_input'>
                <div
                  htmlFor='name'
                  style={{
                    display: 'block',
                    paddingTop: '5%',
                    paddingRight: '2%',
                    paddingBottom: '2%',
                  }}>
                  <Badge borderRadius='full' fontSize='14px' x p='2' >
                    Mô tả công việc
                  </Badge>
                </div>

                <div className='two'>
                  <Textarea
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    w={'100%'}
                    h={200}
                    onChange={(e) => setDetailJob(e.target.value)}
                    type='text'
                    name='detailJob'
                    id='detailJob'
                  />
                </div>
              </div>

              <div className='form_input'>
                <div
                  htmlFor='name'
                  style={{
                    display: 'block',
                    paddingTop: '2%',
                    paddingRight: '2%',
                    paddingBottom: '2%',
                  }}>
                  <Badge borderRadius='full' fontSize='14px' x p='2' >
                    Yêu cầu ứng{' '}
                  </Badge>
                </div>
                <div className='two'>
                  <Textarea
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    w={'100%'}
                    h={200}
                    onChange={(e) => setRequirements(e.target.value)}
                    type='text'
                    name='requirements'
                    id='requirements'
                  />
                </div>
              </div>

              <div className='form_input'>
                <div
                  htmlFor='name'
                  style={{
                    display: 'block',
                    paddingTop: '2%',
                    paddingRight: '2%',
                    paddingBottom: '2%',
                  }}>
                  <Badge borderRadius='full' fontSize='14px' x p='2'>
                    Quyền lợi
                  </Badge>
                </div>
                <div className='two'>
                  <Textarea
                    backgroundColor={'#ffffff'}
                    fontSize={20}
                    w={'100%'}
                    h={200}
                    onChange={(e) => setInterest(e.target.value)}
                    type='text'
                    name='interest'
                    id='interest'
                  />
                </div>
              </div>

              <div className='form_input'>
                <div
                  htmlFor='name'
                  style={{ display: 'block', paddingTop: '2%', paddingRight: '2%' }}>
                  <Badge borderRadius='full' fontSize='14px' p='2' >
                    Hình ảnh
                  </Badge>
                </div>
                <Input
                  w={'100%'}
                  backgroundColor={'#ffffff'}
                  type='file'
                  fontSize={20}
                  onChange={(e) => setImage(e.target.files[0])}
                  name='image'
                  id='image'
                />
              </div>

              <Button
                color={'white'}
                backgroundColor='#03c9d7'
                onClick={HandleSubmit}
                borderRadius={20}
                mb={10}>
                Đăng tin
              </Button>
            </form>
            <ToastContainer />
          </div>
        </Box>
      </VStack>
    </>
  )
}

export default JobPosting
