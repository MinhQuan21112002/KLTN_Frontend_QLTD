import React from 'react'
import { Heading, HStack, SlideFade, VStack } from '@chakra-ui/react'
import {NewContainer} from './NewContainer'
import { ToastContainer, toast } from 'react-toastify'

export const News2 = () => {
  return (
    <VStack fontFamily={'Montserrat'}>
      <SlideFade in={true} offsetY={20}>
        <Heading size={'lg'} m={'6'} mt={24} ml={2} textAlign={'left'} marginRight='auto'></Heading>
      </SlideFade>
      <HStack align={'flex-start'} w={'70vw'}>
        <NewContainer />
      </HStack>
    </VStack>
  )
}
