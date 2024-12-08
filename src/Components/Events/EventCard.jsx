import { ArrowForwardIcon, CopyIcon, StarIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Card, CardBody, Flex, Heading, HStack, IconButton, Image, SlideFade, Stack, Text, Wrap, WrapItem } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

export const EventCard = ({ id, title, article, time, author, image, content, status }) => {
  const navigate = useNavigate()
  const property = {
    imageUrl: 'https://bit.ly/2Z4KKcF',
  }
  const copyToClipboard = (e) => {
    const textToCopy = `http://localhost:3000/event/${e.target.value}`
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success('Đã sao chép vào clipboard: ', textToCopy)
      })
      .catch((err) => {
        console.error('Lỗi khi sao chép vào clipboard ', err)
      })
  }
  return (
    <SlideFade in={true} offsetX='-20px'>
      <Box
        backgroundColor='#ffffff'
        maxW='sm'
        borderRadius='lg'
        overflow='hidden'
        fontFamily={'Montserrat'}
        _hover={{
          boxShadow: 'xl',
          transition: 'all 0.2s ease-in-out',
          transform: 'translate(2px, -5px)',
        }}>
        <Image src={image} alt={property.imageUrl} width='400px' height='262px' />

        <Box p='6'>
          <Box display='flex' alignItems='baseline'>
            <Badge borderRadius='full' px='2' colorScheme='teal'>
              New
            </Badge>
            <Box color='gray.500' fontWeight='semibold' letterSpacing='wide' fontSize='xs' textTransform='uppercase' ml='2'>
              {property.beds} beds &bull; {property.baths} baths
            </Box>
          </Box>

          <Box mt='1' fontWeight='semibold' as='h4' lineHeight='tight' noOfLines={1}>
            {title}
          </Box>

          <Box noOfLines={3}>{article}</Box>

          <Box display='flex' mt='2' alignItems='center'>
            <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='outline' onClick={() => navigate('/event/' + id)} w='200px'>
              View more
            </Button>
            <IconButton value={id} aria-label='Search database' icon={<CopyIcon />} marginLeft='auto' onClick={copyToClipboard} />
          </Box>
        </Box>
      </Box>
    </SlideFade>
  )
}
