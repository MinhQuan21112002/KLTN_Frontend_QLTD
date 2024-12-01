import React, { useState, useEffect } from 'react'
import { Box, Skeleton, Stack } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Heading,
  HStack,
  SlideFade,
  VStack,
  Image,
  Text,
  Button,
  Wrap,
  WrapItem,
  Avatar,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react'
import { AssignInterviewer } from '../Assign/AssignInterviewer'
import { AssignCandidate } from '../Assign/AssignCandidate'
import { interviewService } from '../../Service/interview.service'
import { toast, ToastContainer } from 'react-toastify'

import { GoogleCalendar } from '../GoogleCalendar/GoogleCalendar'
const initialRoomData = {
  id: 0,
  jobPostId: 0,
  roomName: '',
  roomSkill: '',
  roomDescription: '',
  startDate: '',
  endDate: '',
  status: '',
  link: null,
  listInterviewer: [],
  listCandidate: [],
}
const convertData = (initialRoomData) => {
  const {
    id,
    jobPostId,
    roomName,
    roomSkill,
    roomDescription,
    startDate,
    endDate,
    status,
    link,
    listInterviewer,
    listCandidate,
  } = initialRoomData

  const form = {
    roomId: id,
    roomName: roomName,
    skill: roomSkill,
    description: roomDescription,
    startDate: startDate,
    endDate: endDate,
    status: status,
    linkMeet: link || '',
  }
  return form
}

export const RoomEditInfomation = () => {
  const [room, setRoom] = useState(initialRoomData)
  const params = useParams()
  const accessToken = JSON.parse(localStorage.getItem('data')).access_token
  const navigate = useNavigate()
  const [listAttendee, setListAttendee] = useState([])
  const [form, setForm] = useState({
    roomId: 0,
    roomName: '',
    skill: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    linkMeet: '',
  })

  useEffect(() => {
    interviewService
      .getInterviewByID(accessToken, params.idRoom)
      .then((res) => {
        setRoom(res)
        const interviewerEmails = res.listInterviewer.map((interviewer) => interviewer.email)
        const candidateEmails = res.listCandidate.map((candidate) => candidate.email)
        const combinedEmails = [...interviewerEmails, ...candidateEmails]
        const uniqueEmails = [...new Set(combinedEmails)]
        setListAttendee(uniqueEmails)
      })
      .catch((er) => toast.error(er.message))
  }, [])
 

  const handleOnChangeForm = (event) => {
    const { name, value } = event.target
    setRoom((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleUpdateRoom = () => {
    interviewService.updateRoom(convertData(room), accessToken).then((res) => {
      if (res.message === 'SUCCESS!!') {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  if (room.id === 0) {
    return (
      <>
        <Stack>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>
      </>
    )
  } else {
    return (
      <>
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
        <Box
          fontFamily={'Montserrat'}
          fontWeight={400}
          backgroundColor={'#e9f3f5'}
          p={30}
          overflow='hidden'>
          <VStack spacing={10}>
            <Box p={4} borderRadius='lg' backgroundColor={'#FFFFFF'} w={'100%'} h={'230px'}>
              <HStack h={'100%'}>
                <Image
                  borderRadius='lg'
                  m={2}
                  h={'100%'}
                  w={'18%'}
                  src='https://www.peninsulapersonnel.com.au/wp-content/uploads/2020/09/Best-HR-Interview-1.png'
                  alt='Dan Abramov'
                />
                <VStack h={'100%'} w={'82%'} p={2}>
                  <HStack
                    backgroundColor={'#FFFFFF'}
                    w={'100%'}
                    p={2}
                    justifyContent={'space-between'}
                    mb={0}>
                    <Text fontSize={27} fontWeight={'bold'}>
                      {room.roomName}
                    </Text>
                    <Button size='xs' colorScheme='green' variant='outline'>
                      {room.status}
                    </Button>
                    <HStack>
                      <AssignInterviewer roomId={params.idRoom} />
                      <AssignCandidate
                        roomId={params.idRoom}
                        jobId={params.id}
                        startDate={room.startDate}
                        endDate={room.endDate}
                      />
                    </HStack>
                  </HStack>
                  <Text p={2} w={'100%'}>
                    {room.roomDescription}
                  </Text>
                  <HStack spacing={5} w={'100%'} p={2} justifyContent={'flex-start'} mt={0}>
                    <Button size='sm' colorScheme='blue' variant='outline'>
                      {room.startDate}
                    </Button>
                    <Button size='sm' colorScheme='blue' variant='outline'>
                      {room.listCandidate && Array.isArray(room.listCandidate)
                        ? room.listCandidate.length
                        : 0}{' '}
                      Addtendee
                    </Button>
                    <Wrap ml={20}>
                      {room.listCandidate.map((candidate) => (
                        <WrapItem position='relative'>
                          <Avatar name={candidate.name} src={candidate.avatar} />
                        </WrapItem>
                      ))}
                      {room.listInterviewer.map((interviewer) => (
                        <WrapItem position='relative'>
                          <Avatar name={interviewer.fullName} src={interviewer.avatar} />
                        </WrapItem>
                      ))}
                    </Wrap>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
            <Box p={4} borderRadius='lg' w={'100%'} backgroundColor={'#FFFFFF'}>
              <HStack>
                <Text w={'55%'} pl={5} fontSize={27} fontWeight={'bold'}>
                  Room setting
                </Text>
                <GoogleCalendar
                  startDate={room.startDate}
                  endDate={room.endDate}
                  listEmail={listAttendee}
                  roomId={params.idRoom}
                />
              </HStack>
              <br />
              <hr />
              <VStack m={10} justifyContent={'flex-start'} spacing={10}>
                <HStack w={'100%'}>
                  <FormLabel w={'30%'}>Room name</FormLabel>
                  <Input
                    onChange={handleOnChangeForm}
                    name='roomName'
                    backgroundColor={'#FFFFFF'}
                    w={'60%'}
                    placeholder='Room name'
                    value={room.roomName}
                  />
                </HStack>
                <HStack w={'100%'}>
                  <FormLabel w={'30%'}>Skill</FormLabel>
                  <Input
                    name='roomSkill'
                    onChange={handleOnChangeForm}
                    backgroundColor={'#FFFFFF'}
                    w={'60%'}
                    placeholder='Room skill'
                    value={room.roomSkill}
                  />
                </HStack>
                <HStack w={'100%'}>
                  <FormLabel w={'30%'}>status</FormLabel>
                  <Select
                    name='status'
                    onChange={handleOnChangeForm}
                    backgroundColor={'#FFFFFF'}
                    w={'60%'}
                    size='md'
                    value={room.status}>
                    <option value='Created'>Created</option>
                    <option value='Processing'>Processing</option>
                    <option value='Ended'>Ended</option>
                  </Select>
                </HStack>
                <HStack w={'100%'}>
                  <FormLabel w={'30%'}>Description</FormLabel>
                  <Input
                    name='roomDescription'
                    onChange={handleOnChangeForm}
                    backgroundColor={'#FFFFFF'}
                    w={'60%'}
                    placeholder='Room description'
                    value={room.roomDescription}
                  />
                </HStack>
                <HStack w={'100%'}>
                  <FormLabel w={'30%'}>Date time</FormLabel>
                  <HStack w='60%'>
                    <Input
                      onChange={handleOnChangeForm}
                      name='startDate'
                      backgroundColor={'#FFFFFF'}
                      w={'50%'}
                      placeholder='Room description'
                      type='datetime-local'
                      defaultValue={room.startDate}
                    />
                    <Text>To</Text>
                    <Input
                      onChange={handleOnChangeForm}
                      name='endDate'
                      backgroundColor={'#FFFFFF'}
                      w={'50%'}
                      placeholder='Room description'
                      type='datetime-local'
                      defaultValue={room.endDate}
                    />
                  </HStack>
                </HStack>
                <HStack w={'100%'}>
                  <FormLabel w={'30%'}>Link</FormLabel>
                  <Input
                    name='link'
                    onChange={handleOnChangeForm}
                    backgroundColor={'#FFFFFF'}
                    w={'60%'}
                    placeholder='link'
                    type='link'
                    value={room.link}
                  />
                </HStack>
              </VStack>
            </Box>
            <Box>
              <HStack spacing={10}>
                <Button onClick={() => navigate('/roomList')} w={40} colorScheme='gray' size='lg'>
                  Back
                </Button>
                <Button w={40} colorScheme='teal' size='lg' onClick={handleUpdateRoom}>
                  Save
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </>
    )
  }
}
