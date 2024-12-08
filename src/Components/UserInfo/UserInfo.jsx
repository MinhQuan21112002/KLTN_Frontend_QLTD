import React, { useState, useEffect } from 'react'
import { Badge, Box, Button, Center, FormLabel, Image, Spinner, Text } from '@chakra-ui/react'
import axios from 'axios'
import './Both.css'
import { ToastContainer, toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
// import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from 'react-redux'
import { loadUserInfo } from '../../redux/UserInfo/Action'
import { hostName, webHost } from '../../global'
import { IoEyeOutline } from 'react-icons/io5'
import { IoEyeOffOutline } from 'react-icons/io5'
import { storage } from '../../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Cookies from "universal-cookie";
import { loadJob } from '../../redux/Job-posting/Action'
import { ItemJobInCompany } from '../Companies/ItemJobInCompany'
import { ItemJob } from './ItemJob'

const cookies = new Cookies();
const UserInfo = () => {
  const navigate = useNavigate()
  const isAuthenticated = cookies.get("auth-token");
  
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadUserInfo())
    dispatch(loadJob())
  }, [])


  const user = useSelector((store) => store.userInfo.data)
  const listJob=user.listJobPosting;
  console.log(user.listJobPosting)
  const accessToken = JSON.parse(localStorage.getItem('data')).access_token

  const [passShow, setPassShow] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword1, setNewPassword1] = useState('')
  const [newPassword2, setNewPassword2] = useState('')

  const [email, setEmail] = useState(user.email)
  const [fullName, setFullName] = useState(user.fullName)
  const [address, setAddress] = useState(user.address)
  const [phone, setPhone] = useState(user.phone)
  const [gender, setGender] = useState(user.gender)
  const [language, setLanguage] = useState(user.language)
  const [skill, setSkill] = useState(user.skill)
  const [experience, setExperience] = useState(user.experience)
  const [description, setDescription] = useState(user.description)
  const [testAva, setTestAva] = useState()
  const [testCV, setTestCV] = useState()

  let ImageAva = []
  let CV = []

  const submitHandlerPassword = async (e) => {
    e.preventDefault()
    if (oldPassword === '') {
      toast.error('Old password is required!', {
        position: 'top-center',
      })
    } else if (oldPassword.length < 8) {
      toast.error('password must be 8 char!', {
        position: 'top-center',
      })
    } else if (newPassword1 === '') {
      toast.error('New password is required!', {
        position: 'top-center',
      })
    } else if (newPassword1.length < 8) {
      toast.error('password must be 8 char!', {
        position: 'top-center',
      })
    } else if (newPassword2 === '') {
      toast.error('New password is required!', {
        position: 'top-center',
      })
    } else if (newPassword2.length < 8) {
      toast.error('password must be 8 char!', {
        position: 'top-center',
      })
    } else {
    }

    let data = JSON.stringify({
      password: oldPassword,
      newPassword: newPassword1,
      confirmPassword: newPassword2,
    })

    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `${hostName}/user/password`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    }

    axios
      .request(config)
      .then((response) => {
        console.log('haha')
      })
      .catch((error) => {
        console.log(error)
        toast.error('Update Info Failed', {
          position: 'top-center',
        })
      })

    toast.success('Update Password Successfuly', {
      position: 'top-center',
    })
    setTimeout(() => {
      navigate('/logOut')
    }, 2000)
  }
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
  const SubmitHandler = async (e) => {
    try {
   
      if (testCV != null) {
        console.log("Đang upload file trực tiếp lên Firebase...");
        const downloadURL = await uploadToFirebase(testCV);
        if (downloadURL) {
          CV.push(downloadURL);
          console.log("CV đã lưu tại URL:", CV.at(0));
        }
      } else {
        console.log("File CV bị null");
      }

      console.log('test ava null', ImageAva.length == 0 ? 'bi null' : 'ko null')
      if (testAva != null) {
        console.log("Đang upload file trực tiếp lên Firebase...");
        const downloadURL = await uploadToFirebase(testAva);
        if (downloadURL) {
          ImageAva.push(downloadURL);
          console.log("Ava đã lưu tại URL:", ImageAva.at(0));
        }
      } else {
        console.log("File Ava bị null");
      }

      let data = JSON.stringify({
        fullName: fullName,
        email: email,
        phone: phone,
        gender: gender,
        address: address,
        dob: '',
        cv_pdf: CV.length == 0 ? user.cv_pdf : CV.at(0),
        avatar: ImageAva.length == 0 ? user.avatar : ImageAva.at(0),
        language: language,
        skill: skill,
        experience: experience,
        description: description,
      })

      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${hostName}/profile`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        data: data,
      }

      axios
        .request(config)
        .then((response) => {
          console.log('haha')
        })
        .catch((error) => {
          console.log(error)
          toast.error('Update Info Failed', {
            position: 'top-center',
          })
        })

      localStorage.setItem(
        'avatar',
        JSON.stringify(ImageAva.length == 0 ? user.avatar : ImageAva.at(0))
      )
      toast.success('Update Info Successfuly', {
        position: 'top-center',
      })
      navigate('/userInfo')
    } catch (error) {}
  }

  if (!user.email)
    return (
      <Center direction='row' spacing={4} w={'80vw'} h={'20vw'}>
        <Spinner color='blue.500' size='xl' />
      </Center>
    )
  else {
    return (
      <Box fontFamily={'Montserrat'} display='flex' justifyContent='center' alignItems='center'>
        <Box w={'60%'} mt={20}>
          <Box h={'auto'} p={10} justifyContent={'center'} className='form_data3'>
            <Box mt={10} fontSize={25} className='form_heading'>
              Thông tin cá nhân
            </Box>
            <form>
              <Image
                borderRadius='full'
                mr={'8px'}
                w={'100px'}
                h={'100px'}
                style={{ marginBottom: '10px', marginTop: '20px' }}
                src={user.avatar}
              />
              <div className='form_input'>
                <label htmlFor='email'>
                  <p style={{ marginRight: '5px', width: '130px' }}>
                    <Badge borderRadius='full' fontSize='14px' px='2'>
                      Email
                    </Badge>
                  </p>
                </label>
                <input
                  type='text'
                  value={email != null ? email : user.email}
                  onChange={(e) => setEmail(e.target.value)}
                  name='email'
                  id='email'
                />
              </div>

              <div className='form_input'>
                <label htmlFor='fullName'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Họ tên
                  </Badge>
                </label>

                <input
                  type='text'
                  value={fullName != null ? fullName : user.fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  name='fullName'
                  id='fullName'
                />
              </div>
              <div className='form_input'>
                <label htmlFor='address'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Địa chỉ
                  </Badge>
                </label>

                <input
                  type='text'
                  value={address != null ? address : user.address}
                  onChange={(e) => setAddress(e.target.value)}
                  name='address'
                  id='address'
                />
              </div>
              <div className='form_input'>
                <label htmlFor='phone'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Số điện thoại
                  </Badge>
                </label>

                <input
                  type='text'
                  value={phone != null ? phone : user.phone}
                  onChange={(e) => setPhone(e.target.value)}
                  name='phone'
                  id='phone'
                />
              </div>

              <div className='form_input'>
                <label htmlFor='phone'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Giới tính
                  </Badge>
                </label>

                <select
                style={{padding:3, borderRadius: "10px"}}
                  value={gender != null ? gender : user.gender}
                  onChange={(e) => setGender(e.target.value)}
                  name='sex'
                  id='sex'>
                  <option value='male'>MALE</option>
                  <option value='female'>FEMALE</option>
                  <option value='other'>NON_BINARY</option>
                </select>

                {/* <input
                  type='text'
                  value={gender != null ? gender : user.gender}
                  onChange={(e) => setGender(e.target.value)}
                  name='sex'
                  id='sex'
                /> */}
              </div>

              <div className='form_input'>
                <label htmlFor='phone'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Ngôn ngữ
                  </Badge>
                </label>

                <input
                  type='text'
                  value={language != null ? language : user.language}
                  onChange={(e) => setLanguage(e.target.value)}
                  name='language'
                  id='language'
                />
              </div>

              <div className='form_input'>
                <label htmlFor='phone'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Kỹ năng
                  </Badge>
                </label>

                <input
                  type='text'
                  value={skill != null ? skill : user.skill}
                  onChange={(e) => setSkill(e.target.value)}
                  name='skill'
                  id='skill'
                />
              </div>

              <div className='form_input'>
                <label htmlFor='phone'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Kinh nghiệm
                  </Badge>
                </label>

                <input
                  type='text'
                  value={experience != null ? experience : user.experience}
                  onChange={(e) => setExperience(e.target.value)}
                  name='experience'
                  id='experience'
                />
              </div>

              <div className='form_input'>
                <label htmlFor='phone'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Mô tả
                  </Badge>
                </label>

                <input
                  type='text'
                  value={description != null ? description : user.description}
                  onChange={(e) => setDescription(e.target.value)}
                  name='description'
                  id='description'
                />
              </div>

              <div className='form_input'>
                <label htmlFor='phone'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    CV
                  </Badge>
                  <Box p={2}>
                    {user.cv_pdf ? (
                    <a 
                      href={user.cv_pdf} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ fontSize: '20px', fontWeight: 'bold' }}
                    >
                      Tải CV tại đây
                    </a>
                  ) : (
                    <span style={{ fontSize: '18px', color: 'gray' }}>Chưa có</span>
                  )}

                  </Box>
                </label>

                <input
                  type='file'
                  onChange={(e) => setTestCV(e.target.files[0])}
                  name='cv_pdf'
                  id='cv_pdf'
                />
              </div>

              <div className='form_input'>
                <label htmlFor='phone'>
                  <p style={{ marginRight: '5px', width: '130px' }}></p>
                  <Badge borderRadius='full' fontSize='14px' px='2'>
                    Avatar
                  </Badge>
                </label>

                <input
                  type='file'
                  onChange={(e) => setTestAva(e.target.files[0])}
                  name='avatar'
                  id='avatar'
                />
              </div>
              <Button color={'white'} mb={10} backgroundColor={'#87b2c4'} onClick={SubmitHandler}>
                Cập nhật thông tin
              </Button>
            </form>
          </Box>
      {isAuthenticated==null?
         ( 
         <Box mb={20} p={10} h={'auto'} className='form_data3'>
            <Box mt={10} fontSize={25} className='form_heading'>
              Thay đổi mật khẩu
            </Box>
            <form>
              <div className='form_input'>
                <label htmlFor='password'>Mật khẩu cũ</label>
                <div className='two'>
                  <input
                    type={!passShow ? 'password' : 'text'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    name='oldPassword'
                    id='oldPassword'
                    placeholder='Enter Your Old password'
                  />
                  <div className='showpass' onClick={() => setPassShow(!passShow)}>
                    {!passShow ? <IoEyeOutline /> : <IoEyeOffOutline />}
                  </div>
                </div>
              </div>

              <div className='form_input'>
                <label htmlFor='password'>Nhập mật khẩu mới</label>
                <div className='two'>
                  <input
                    type={!passShow ? 'password' : 'text'}
                    value={newPassword1}
                    onChange={(e) => setNewPassword1(e.target.value)}
                    name='newPassword1'
                    id='newPassword1'
                    placeholder='Enter Your New password'
                  />
                  <div className='showpass' onClick={() => setPassShow(!passShow)}>
                    {!passShow ? <IoEyeOutline /> : <IoEyeOffOutline />}
                  </div>
                </div>
              </div>
              <div className='form_input'>
                <label htmlFor='password'>Nhập lại mật khẩu mới</label>
                <div className='two'>
                  <input
                    type={!passShow ? 'password' : 'text'}
                    value={newPassword2}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    name='newPassword2'
                    id='newPassword2'
                    placeholder='Enter Your New password'
                  />
                  <div className='showpass' onClick={() => setPassShow(!passShow)}>
                    {!passShow ? <IoEyeOutline /> : <IoEyeOffOutline />}
                  </div>
                </div>
              </div>
              <Button
                color={'white'}
                mb={10}
                backgroundColor={'#87b2c4'}
                onClick={submitHandlerPassword}>
                Cập nhật
              </Button>
            </form>
            <ToastContainer />
          </Box>
         ):
         <></>
        }

          <Box w={'100%'} borderWidth='1px' borderRadius='lg' overflow='hidden' boxShadow='md' align={'flex-start'} marginBottom={"10%"}>
                  <FormLabel fontWeight={'bold'} fontSize={18} w={'100%'} p={4}>
                  Công việc đã ứng tuyển
                  </FormLabel>
                  {listJob
                    .filter((job) => job.status === true) // Lọc các job có status là false
                    .map((job) => (
                      <ItemJob key={job.id} {...job} /> // Hiển thị các job đã lọc
                    ))}

          </Box>
        </Box>
      </Box>
    )
  }
}

export default UserInfo
