import React, { useEffect, useState } from 'react'
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, useDisclosure, Button, Input, Box, VStack, Image, extendTheme, ChakraProvider, HStack, Text } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { companyService } from '../../Service/company.service'

export const SearchCompany = ({ keyword, onChange, companies }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const [conpanys, setCompanies] = useState(companies)

  useEffect(() => {
    if (!keyword) {
      setCompanies(companies)
    } else {
      const filtered = companies.filter((company) => company.name.toLowerCase().includes(keyword.toLowerCase()))
      setCompanies(filtered)
    }
  }, [keyword, companies])

  return (
    <>
      <Button onClick={onOpen} p={2} mt={2} mr={5} w={'100%'} borderRadius={20} size='sm'>
        <Search2Icon />
      </Button>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} size={'lg'}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              <Input fontFamily={'Montserrat'} value={keyword} name='keyword' onChange={onChange} backgroundColor={'#FFFFFF'} pr='4.5rem' type='text' placeholder='Search' borderRadius={30} p={6} />
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack maxHeight={'1000px'} h={'1000px'} overflow={'auto'} p={2}>
                {conpanys.map((company) => (
                  <Box borderWidth={1} borderRadius={5} p={3} w={'100%'} h='200px' mt={3}>
                    <HStack>
                      <Image borderRadius={4} w={300} h={150} src={company.avatar} />
                      <Text>{company.name}</Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
