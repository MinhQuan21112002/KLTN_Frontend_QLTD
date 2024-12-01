import { Avatar, Box, Button, HStack, Img, Spinner, Stack, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AddInterviewer } from './AddInterviewer'
import { interviewerService } from '../../Service/interviewer.service'
import { userService } from '../../Service/user.servie'
import { ToastContainer, toast } from 'react-toastify'

export const ManageInterviewer = () => {
  const accessToken = JSON.parse(localStorage.getItem('data')).access_token
  const [hrs, sethrs] = useState([])
  const [loading, setLoading] = useState(false)
  const [change, setChange] = useState(false)

  
  useEffect(() => {
    setLoading(true)
    interviewerService
      .getMyInterviewer(accessToken)
      .then((res) => {
        sethrs(res)
        setLoading(false)
      })
      .catch((err) => console.log(err.message))
  }, [change])


  const handleAddBlackList = (id) => {
    const forms = {
      userId: id,
      description: 'string',
    }
    userService
      .addBlacklist(accessToken, forms)
      .then((res) => {
        toast.success(res.message)
        setChange(!change)
      })
      .catch((error) => console.log(error.message))
  }
  const handleRemoveBlackList = (id) => {
    userService
      .removeBlacklist(accessToken, id)
      .then((res) => {
        toast.success(res.message)
        setChange(!change)
      })
      .catch((error) => console.log(error.message))
  }

  if (loading) {
    return (
      <Box fontFamily={'Montserrat'} fontWeight={400} backgroundColor={'#e9f3f5'} p={30} overflow='hidden'>
        <VStack>
          <Box w={'100%'}>
            <AddInterviewer />
          </Box>
          <Text pt='20px' fontWeight='black' w='100%'>
            Danh sách đội tuyển dụng
          </Text>
          <Box w='100%' backgroundColor='#ffffff' p='2%' borderRadius={20}>
            <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
          </Box>
        </VStack>
      </Box>
    )
  } else if (hrs.length === 0 && loading === false) {
    return (
      <Box fontFamily={'Montserrat'} fontWeight={400} backgroundColor={'#e9f3f5'} p={30} overflow='hidden'>
        <VStack>
          <Box w={'100%'}>
            <AddInterviewer />
          </Box>
          <Text pt='20px' fontWeight='black' w='100%'>
            Danh sách đội tuyển dụng
          </Text>
          <Box w='100%' backgroundColor='#ffffff' p='2%' borderRadius={20}>
            You dont have any hr
          </Box>
        </VStack>
      </Box>
    )
  } else
    return (
      <Box fontFamily={'Montserrat'} fontWeight={400} backgroundColor={'#e9f3f5'} p={30} overflow='hidden'>
        <VStack>
          <Box w={'100%'}>
            <AddInterviewer />
          </Box>
          <Text pt='20px' fontWeight='black' w='100%'>
            Danh sách đội tuyển dụng
          </Text>
          <Box w='100%' backgroundColor='#ffffff' p='2%' borderRadius={20}>
            <VStack w='100%'>
              {hrs.map((hr) => (
                <Box p={2} borderRadius={20} w='100%' transition='transform 0.3s ease-in-out' _hover={{ borderWidth: '2px', transform: 'scale(1.006)' }}>
                  <HStack justifyContent={'space-between'}>
                    <HStack spacing={5}>
                      <Avatar size='xl' name={hr.fullName ? hr.fullName : hr.email} src={hr.avatar} />
                      <VStack>
                        <Text w='100%' fontWeight={'black'}>
                          Full Name: {hr.fullName}
                        </Text>
                        <Text w='100%'>Email: {hr.email}</Text>
                      </VStack>
                    </HStack>

                    {hr.status === 'INPROCESS' ? (
                      <Button onClick={() => handleAddBlackList(hr.id)} color={'white'} backgroundColor={'#30f0b6'}>
                        ACTIVE
                      </Button>
                    ) : (
                      <Button onClick={() => handleRemoveBlackList(hr.id)} color={'white'} backgroundColor={'#fa236e'}>
                        DISABLE
                      </Button>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
          {/* <ToastContainer position='bottom-right' autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme='light' /> */}
        </VStack>
      </Box>
    )
}
