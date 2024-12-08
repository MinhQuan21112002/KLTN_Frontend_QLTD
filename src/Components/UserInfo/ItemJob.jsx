import { ArrowUpDownIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { FiDollarSign } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { AiOutlineDollar } from 'react-icons/ai'

export const ItemJob = ({ id, image, name, position, location, salary, workingForm }) => {
  const navigate = useNavigate()
  return (
    <>
      <Box  onClick={() => navigate(`/jobDetail/${id}`)} key={id} maxW='100%' borderWidth='1px' borderRadius='lg' overflow='hidden' fontFamily={'Montserrat'} m={4} p={2} w={'95%'}>
        <HStack w={'100%'}>
          <Box borderRadius='lg' overflow='hidden' w={'23%'} height={'100%'}>
            <Image w={'100%'} h={'100%'} src={image} alt={name} />
          </Box>
          <VStack w={'77%'}>
            <HStack p={0} w={'100%'}>
              <VStack w={'60%'} align={'flex-start'}>
                <Text fontWeight='bold'>{name}</Text>
                <Text>Position: {position}</Text>
              </VStack>
              <HStack w={'40%'}>
                <AiOutlineDollar />
                <Text>Salary: {salary}</Text>
              </HStack>
            </HStack>

            <HStack w={'100%'} p={0}>
              <HStack w='60%'>
                <Button size='xs' m={1} p={1} fontSize={10}>
                  {location}
                </Button>
                <Button size='xs'>{workingForm}</Button>
              </HStack>
              <Button size='xs' colorScheme='whatsapp' m={2} >
                Đã ứng tuyển
              </Button>
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </>
  )
}
