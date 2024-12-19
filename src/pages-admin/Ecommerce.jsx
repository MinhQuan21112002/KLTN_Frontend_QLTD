import React, { useState } from 'react'
// import { GoPrimitiveDot } from "react-icons/go";
import { MdOutlineSupervisorAccount } from 'react-icons/md'
import { IoIosMore } from 'react-icons/io'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Stacked, Pie, LineChart, SparkLine } from '../Components-admin'
import { loadRoom } from '../redux/Room/Action'
import { loadInterviewer } from '../redux/Interviewer/Action'
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/react'
import {
  earningData,
  medicalproBranding,
  recentTransactions,
  weeklyStats,
  dropdownData,
  SparklineAreaData,
  ecomPieChartData,
} from '../data/dummy'
import { useStateContext } from '../contexts/ContextProvider'
import product9 from '../data/product9.jpg'
import { loadJob } from '../redux/Job-posting/Action'
import { cvService } from '../Service/cv.service'
import { companyService } from '../Service/company.service'

const Ecommerce = () => {
  const data=JSON.parse(localStorage.getItem("data"));
  const { currentColor, currentMode } = useStateContext()
  const [cvChartData, setCvChartData] = useState([])
  const [jobChartData, setJobChartData] = useState([])
   const [candidate, setCandidate] = useState([])
  const accessToken = JSON.parse(localStorage.getItem('data')).access_token
  console.log(data);
  useEffect(() => {
    dispatch(loadJob())
  },[])
  const jobList = useSelector((store) => store.job.data)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadRoom())
    dispatch(loadInterviewer())
  }, [])
  const roomList = useSelector((store) => store.room.data)
  const interviewerList = useSelector((store) => store.interviewer.data)

  const datda = [
    { x: 1, yval: 2 },
    { x: 2, yval: 6 },
    { x: 3, yval: 8 },
    { x: 4, yval: 5 },
    { x: 5, yval: 10 },
  ]

  useEffect(() => {
    cvService.getAllCVs(accessToken).then((res) => {
      const cvCountPermonth = Array(12).fill(0)
      res.data.forEach((cv) => {
        const applyDate = new Date(cv.dateApply)
        const monthIndex = applyDate.getMonth()
        cvCountPermonth[monthIndex]++
      })
      const cvCountsData = cvCountPermonth.map((count, index) => ({
        x: new Date(2023, index, 1).toLocaleString('default', { month: 'short' }),
        y: count,
      }))
      setCvChartData(cvCountsData)
    })

    companyService.getListCandidate(accessToken).then((res) => {
      console.log("Danh sách candidate:", res); // In toàn bộ mảng
        setCandidate(res)
    })

    const m = Array.from({ length: 12 }, (_, index) => ({
      month: index,
      y: 0,
    }));
    
    // Lặp qua danh sách công việc và tăng giá trị y cho tháng tương ứng
    jobList.forEach((item) => {
      const month = new Date(item.createDate).getMonth(); // Lấy tháng từ createDate
      if (m[month]) {
        m[month].y += 1;
      }
    });
    
    // Cập nhật dữ liệu biểu đồ
    setJobChartData(m);
  }, [])
  console.log(jobList)

  return (
    <div style={{ fontFamily: 'Montserrat' }} className='mt-24'>
      <div className='flex flex-wrap lg:flex-nowrap justify-center '>

      {data.data.role!='ADMIN'&&(        
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center'>
          <div className='flex justify-between items-center'>
            <div>
              <p className='font-bold text-gray-400'>
              {roomList ? `${roomList.length} ` : "0"}
                {/* {roomList.length}  */}
                Phòng</p>
              <p className='text-2xl'>Số lượng phòng</p>
            </div>
          </div>
          <div className='mt-6'>
            <Button
              height='50px'
              color='white'
              bgColor={currentColor}
              text='Xem chi tiết'
              borderRadius='10px'>
              <Link to='/roomList'>Xem chi tiết</Link>
            </Button>
          </div>
        </div>
      )}
      
      {data.data.role!='ADMIN'&&(
        <div className='flex m-3 flex-wrap justify-center gap-1 items-center'>
          <div
            key='Người phỏng vấn'
            className='bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl '>
            <button
              type='button'
              style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
              className='text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl'>
              <MdOutlineSupervisorAccount />
            </button>
            <p className='mt-3'>
              <span className='text-lg font-semibold'>
              {interviewerList ? `${interviewerList.length} ` : "0"}
                {/* {interviewerList.length}  */}
                người </span>
            </p>
            <p className='text-sm text-gray-400  mt-1'>Người phỏng vấn</p>
          </div>
          <div
            key='Ứng viên'
            className='bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl '>
            <button
              type='button'
              style={{ color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)' }}
              className='text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl'>
              <MdOutlineSupervisorAccount />
            </button>
            <p className='mt-3'>
              <span className='text-lg font-semibold'>
              {candidate ? `${candidate.length} ` : "0"}
                {/* {interviewerList.length}  */}
                người </span>
            </p>
            <p className='text-sm text-gray-400  mt-1'>Ứng viên</p>
          </div>
        </div>
        )}

      </div>

      <div className='flex gap-10 flex-wrap justify-center'>
        <div className='bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  '>
          <div className='flex justify-between'>
            <p className='font-semibold text-xl'>Ứng tuyển việc làm</p>
            <div className='flex items-center gap-4' style={{marginRight:"10%"}}>
              <p className='flex items-center gap-2 text-green-400 hover:drop-shadow-xl ' style={{fontSize:"20px"}} >
                <span>{/* <GoPrimitiveDot /> */}</span>
                <span>Ứng viên</span>
              </p>
              <p className='flex items-center gap-2 text-green-400 hover:drop-shadow-xl'>
                <span>{/* <GoPrimitiveDot /> */}</span>
                <span></span>
              </p>
            </div>
          </div>
          <div className='mt-10 flex gap-10 flex-wrap justify-center'>
            <div className=' border-r-1 border-color m-4 pr-10'>
              <div>
                <p>
                  <span className='text-3xl font-semibold'>{cvChartData.reduce((acc, cv) => acc + cv.y, 0)}</span>
                </p>
                <p className='text-gray-500 mt-1'>Lượt ứng tuyển</p>
              </div>
              <div className='mt-8'>
                <p className='text-3xl font-semibold'>
                  {/* {jobList.length} */}
                  {jobList ? `${jobList.length} ` : "0"}
                  </p>

                <p className='text-gray-500 mt-1'>Bài đăng</p>
              </div>

           
              <div className='mt-10'>
                {/* <Button
                  color='yellow'
                  backgroundColor={'green'}
                  bgColor={currentColor}
                  text='Download Report'
                  borderRadius='10px'
                > D</Button> */}
              </div>
            </div>
            <div>
              <Stacked currentMode={currentMode} width='320px' height='360px' cvData={cvChartData}  />
            </div>
          </div>
        </div>

      
      </div>

      
    </div>
  )
}

export default Ecommerce
