import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Image,
  Text,
  useDisclosure,
  SimpleGrid,
  Badge,
  Link,
} from '@chakra-ui/react'
import React, { Fragment, useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BsBag, BsFillStarFill } from 'react-icons/bs'
import { CiLocationOn } from 'react-icons/ci'
import { loadJobDetail } from '../../redux/JobDetail/Action'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { hostName, webHost } from '../../global'
import { IoBriefcaseOutline } from 'react-icons/io5'
import { HiOutlineCurrencyDollar } from 'react-icons/hi'
import { MdOutlineLocationOn } from 'react-icons/md'
import { MdOutlineTimelapse } from 'react-icons/md'
import { IoHourglassOutline } from 'react-icons/io5'
import { IoMedalOutline } from 'react-icons/io5'
import { AiOutlineUser, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { companyService } from '../../Service/company.service'
import { loadUserInfo } from '../../redux/UserInfo/Action'
import { db } from '../../firebase'
import {
  collection,
  addDoc,
  query, where, getDocs,
  Timestamp,
} from "firebase/firestore";
function JobDetail() {
  const infoAppyRef = collection(db, "applyInfomation_candidate");
  const params = useParams()
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadJobDetail(params.id))
    if (accessToken != null) {
      dispatch(loadUserInfo())
    }
  }, [params.id])
  const data = useSelector((store) => store.jobDetail.data)
  const company = companies.filter((item) => item.userId === data.user_id)
  const user = useSelector((store) => store.userInfo.data)

  // if (user) {
  //   console.log("công việc : " + JSON.stringify(data.image, null, 2));
  // }
  // if (user) {
  //   console.log("nguoi dung : " + JSON.stringify(user.email, null, 2));
  // }
  useEffect(() => {
    companyService.getAllCompany().then((res) => setCompanies(res))
  }, [])

  const accessToken =
    JSON.parse(localStorage.getItem('data')) !== null
      ? JSON.parse(localStorage.getItem('data')).access_token
      : null
  const submitHandler = async (e) => {
    if(accessToken===null)
    {
      toast.info('Hãy Đăng nhập trước', {
        position: 'top-center',
      })
      setTimeout(() => {
        navigate('/login')
      }, 3000); // Delay 3 giây
    }
    if (user.cv_pdf === null) {
      toast.info('Hãy tạo CV trong profile trước', {
        position: 'top-center',
      })
    } else {
      console.log(e.target.value)
      const jobId = e.target.value
      try {
        const { Data } = await axios.post(`${hostName}/apply-job`, jobId, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })

       
      } catch (error) {
        toast.error(error, {
          position: 'top-center',
        })
      }
    }
    try {
      // Tạo truy vấn để kiểm tra trùng lặp
      const q = query(infoAppyRef, 
        where("jobId", "==",  params.id),
        where("candidateId", "==", user.userId)
      );
  
      // Thực hiện truy vấn
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        toast.error("Bạn đã apply rồi ", { position: "top-center" });
        return; // Dừng nếu đã tồn tại
      }
  
      // Thêm tài liệu mới nếu không tìm thấy trùng lặp
      await addDoc(infoAppyRef, {
        reccerId: data.user_id,
        dateApply: Timestamp.now(),
        jobId: params.id,
        candidateId: user.userId,
        emailCandiate:user.email,
        nameCandidate:user.fullName,
        image:data.image,
      });
  
      toast.success('Apply Job Successfully', {
        position: 'top-center',
      })
    } catch (error) {
      toast.error("Bạn đã apply rồi ", { position: "top-center" });
    }
  }
  

   
    
  if (data != null) {
    return (
      <Box mt='100px' fontFamily={'Montserrat'}>
        <Box display='flex' justifyContent='space-evenly'>
          <Box w='850px'>
            <Box
              borderRadius={7}
              ml='50px'
              p='20px'
              boxShadow='rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'
              color='RGBA(0, 0, 0, 0.76)'>
              <Text fontSize='20px' fontWeight='bold'>
                {data.name}
              </Text>

              <SimpleGrid w='100%' h='80px' mt='50px' mr='10' columns={3} spacing={'10'}>
                <Box>
                  <Image pl='25%' borderRadius='3px' h='80px' src={`${data.image}`} />
                </Box>

                <Box fontSize='15px' justifyItems='center'>
                  <Text display='flex' alignContent='center'>
                    <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                      <IoBriefcaseOutline />
                    </Box>
                    Vị trí :
                    <Text ml={2} fontWeight={'bold'}>
                      {data.position}
                    </Text>
                  </Text>

                  <Text display='flex' alignContent='center'>
                    <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                      <HiOutlineCurrencyDollar />
                    </Box>
                    Mức lương :
                    <Text ml={2} fontWeight={'bold'}>
                      {data.salary}
                    </Text>
                  </Text>
                </Box>

                <Box>
                  <Text display='flex' alignContent='center'>
                    <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                      <IoHourglassOutline />
                    </Box>
                    Kinh Nghiệm :
                    <Text ml={2} fontWeight={'bold'}>
                      {data.experience}
                    </Text>
                  </Text>

                  <Text display='flex' alignContent='center'>
                    <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                      <MdOutlineLocationOn />
                    </Box>
                    Địa điểm:
                    <Text ml={2} fontWeight={'bold'}>
                      {data.location}
                    </Text>
                  </Text>
                </Box>
              </SimpleGrid>

              <Box w='100%' mt='30px' mb='20px'>
                <Button w='100%' value={data.id} onClick={submitHandler}>
                  Apply
                </Button>
              </Box>
            </Box>

            <Box
              borderRadius={7}
              mb={20}
              mt='30px'
              ml='50px'
              p='20px'
              boxShadow='rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'
              color='RGBA(0, 0, 0, 0.76)'>
              <Text fontSize='20px' fontWeight='bold'>
                Job description
              </Text>
              <Text width='60%' lineHeight='30px'>
                {data.dis}
              </Text>

              <Box>
                <Text mt='30px' fontSize='18px' fontWeight='bold'>
                  Vị trí
                </Text>
                <Text mb='30px'> {data.position} </Text>
                {data.requirements && (
                  <Fragment>
                    <Text fontSize='18px' fontWeight='bold'>
                      Kỹ năng
                    </Text>
                    <Text mb='30px'>
                      {data.requirements.split('\n').map((item, index) => (
                        <Fragment key={index}>
                          {item}
                          <br />
                        </Fragment>
                      ))}
                    </Text>
                  </Fragment>
                )}

                <Text fontSize='18px' fontWeight='bold'>
                  Địa chỉ Doanh nghiệp
                </Text>
                <Text mb='30px'> {data.detailLocation} </Text>
                {data.interest && (
                  <Fragment>
                    <Text fontSize='18px' fontWeight='bold'>
                      Quyền lợi
                    </Text>
                    <Text mb='30px'>
                      {data.interest.split('\n').map((item, index) => (
                        <Fragment key={index}>
                          {item}
                          <br />
                        </Fragment>
                      ))}
                    </Text>
                  </Fragment>
                )}
                {data.detailJob && (
                  <Fragment>
                    <Text fontWeight='bold' fontSize='18px'>
                      Mô tả công việc
                    </Text>
                    <Text mb='10px'> {data.workingForm} </Text>
                    <Text mb='30px'>
                      {data.detailJob.split('\n').map((item, index) => (
                        <Fragment key={index}>
                          {item}
                          <br />
                        </Fragment>
                      ))}
                    </Text>
                  </Fragment>
                )}
              </Box>
            </Box>
          </Box>
          <Box width='400px' height='400px'>
            <Box
              borderRadius={7}
              p='20px'
              boxShadow='rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'>
              <Text fontSize='18px' mb='20px' fontWeight='bold'>
                Genaral information
              </Text>
              <Box mb={2}>
                <Text fontSize='15px' fontWeight='bold'>
                  Cấp bậc
                </Text>
                <Text display='flex' alignContent='center'>
                  <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                    <IoMedalOutline />
                  </Box>
                  <Text>{data.position}</Text>
                </Text>
              </Box>

              <Box mb={2}>
                <Text fontSize='15px' fontWeight='bold'>
                  Kinh nghiệm
                </Text>
                <Text display='flex' alignContent='center'>
                  <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                    <IoHourglassOutline />
                  </Box>
                  <Text>{data.experience}</Text>
                </Text>
              </Box>

              <Box mb={2}>
                <Text fontSize='15px' fontWeight='bold'>
                  Số lượng tuyển
                </Text>
                <Text display='flex' alignContent='center'>
                  <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                    <AiOutlineUsergroupAdd />
                  </Box>
                  <Text>{data.number}</Text>
                </Text>
              </Box>

              <Box mb={2}>
                <Text fontSize='15px' fontWeight='bold'>
                  Hình thức làm việc
                </Text>
                <Text display='flex' alignContent='center'>
                  <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                    <IoBriefcaseOutline />
                  </Box>
                  <Text>{data.workingForm}</Text>
                </Text>
              </Box>
              <Box mb={2}>
                <Text fontSize='15px' fontWeight='bold'>
                  Giới tính
                </Text>
                <Text display='flex' alignContent='center'>
                  <Box mt='4px' mr='15px' color='RGBA(0, 0, 0, 0.36)'>
                    <AiOutlineUser />
                  </Box>
                  <Text>{data.sex}</Text>
                </Text>
              </Box>
            </Box>

            <Box
              borderRadius={7}
              p='20px'
              mt='20px'
              boxShadow='rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em'>
              <Text fontSize='18px' mb='20px' fontWeight='bold'>
                Company
              </Text>
              {company[0] && (
                <Fragment>
                  <Image mb={2} src={company[0].avatar} />
                  <Text fontSize='15px' fontWeight='bold'>
                    {company[0].name}
                  </Text>

                  <Text display='flex' textAlign='center'>
                    <Text fontSize='13px' mt='1px' mr='10px'>
                      {company[0].address}
                    </Text>
                    <Text mt='2.5px' color='orange' ml='2px' mr='10px'></Text>
                  </Text>
                  <Text mt='5px' fontWeight='bold' color='blue.500'>
                    <Link href='/ss'>View</Link>
                  </Text>
                </Fragment>
              )}
            </Box>
          </Box>
        </Box>
        <ToastContainer />
      </Box>
    )
  }
}

export default JobDetail
