import React, { useState, useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { Box, Badge, WrapItem, Text, Button, VStack, Spacer, Input } from '@chakra-ui/react'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { interviewService } from '../../Service/interview.service'
import { ToastContainer, toast } from 'react-toastify'
import { interviewerService } from '../../Service/interviewer.service'

export const AssignInterviewer = ({ roomId }) => {
  const [interviewer, setInterviewer] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const accessToken = JSON.parse(localStorage.getItem('data')).access_token
  const [form, setForm] = useState({
    interviewerEmail: 'khanh@gmial.com',
    roomId: roomId.toString(),
  })

  const handleAssignInterviewer = (email) => {
    form.interviewerEmail = email
    interviewService
      .interviewerAssign(accessToken, form)
      .then((res) => {
        if (res.message != 'Add success!') {
          toast.info(res.message)
        } else {
          toast.success(res.message)
        }
      })
      .catch((er) => {
        toast.error(er.message)
      })
  }

  const truncatedEmail = (email) => {
    if (email.length > 20) {
      return `${email.substring(0, 20)}...`
    }
    return email
  }

  useEffect(() => {
    interviewerService
      .getMyInterviewer(accessToken)
      .then((res) => setInterviewer(res))
      .catch((error) => console.log(error))
  }, [])


  const data=JSON.parse(localStorage.getItem('data'));
  const filteredInterviewers = interviewer.filter(inter => inter.reccerID === data.data.userInfo.id);
  return (
    <>
      <Button fontFamily={'Montserrat'} fontWeight={400} colorScheme='blue' onClick={onOpen}>
        Assign Interviewer
      </Button>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent fontFamily={'Montserrat'} fontWeight={400}>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Assign Interviewer
            </AlertDialogHeader>
            <AlertDialogBody style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {filteredInterviewers.map((interviewer) => (
                <Box maxW='sm' borderWidth='3px' borderRadius='lg' overflow='hidden' m={2}>
                  <WrapItem m={2} alignItems='center'>
                    <Avatar name={interviewer.fullName} src={interviewer.avatar} />
                    <VStack>
                      <Text m={2}>{truncatedEmail(interviewer.email)}</Text>
                      <Text justifyContent={'flex-start'} m={2}>
                        {interviewer.fullName}
                      </Text>
                    </VStack>

                    <Spacer />
                    <VStack justifyContent='flex-start'>
                      <Button
                        onClick={() => handleAssignInterviewer(interviewer.email)}
                        backgroundColor='green'
                        p={1}
                        h={'100%'}
                        colorScheme='teal'
                        size='xs'>
                        Đăng kí
                      </Button>
                    </VStack>
                  </WrapItem>
                </Box>
              ))}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
