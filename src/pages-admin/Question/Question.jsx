import React, { useEffect, useState } from 'react'
import { Header } from '../../Components-admin'
import {
  Box,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Skeleton,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { MdCheckCircle, MdSettings } from 'react-icons/md'
import { questionService } from '../../Service/question.service'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { Exposure } from '@mui/icons-material'
import { skillPositionService } from '../../Service/skillPosition.service'
import { Pagination } from 'react-bootstrap'
import { PaginationItem } from '@mui/material'
import { AddIcon, ArrowBackIcon, ArrowForwardIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import './question.css'

export const dropdownField = [
  {
    id: 0,
    field: '--Choose--',
  },
  {
    id: 1,
    field: 'SoftSkill',
  },
  {
    id: 2,
    field: 'TechSkill',
  },
  {
    id: 3,
    field: 'Language',
  },
]

export const dropdownSkill = (skills) => {
  const dropdownItems = skills?.map((item) => ({ id: item.id, field: item.skillName })) || []
  dropdownItems.unshift({ id: 0, field: '--Choose--' })
  return dropdownItems
}

export const dropdownPosition = (positions) => {
  const dropdownItems = positions?.map((item) => ({ id: item.id, field: item.positionName })) || []
  dropdownItems.unshift({ id: 0, field: '--Choose--' })
  return dropdownItems
}

export const Question = () => {
  const navigate = useNavigate()
  const [allQuestions, setAllQuestions] = useState([])
  const accessToken = JSON.parse(localStorage.getItem('data')).access_token
  const [skills, setSkill] = useState([])
  const [positions, setPositions] = useState([])
  const [filter, setFilter] = useState({
    fieldId: 0,
    skillId: 0,
    positionId: 0,
  })
  // const [pageNumber, setPageNumber] = useState(1);

  const getAllquestion = (data) => {
    let allQuestions = []
    data.forEach((field) => {
      if (field.questions && field.questions.length > 0) {
        allQuestions = allQuestions.concat(field.questions)
      }
    })
    return allQuestions
  }

  useEffect(() => {
    questionService.getAllquestion(accessToken).then((res) => setAllQuestions(getAllquestion(res)))
    skillPositionService
      .getSkill(accessToken)
      .then((res) => setSkill(res))
      .catch((er) => console.log(er))
    skillPositionService
      .getPosition(accessToken)
      .then((res) => setPositions(res))
      .catch((er) => console.log(er))
  }, [])

  const [filteredQuestions, setFilteredQuestions] = useState([])

  useEffect(() => {
    const filteredData = allQuestions.filter((question) => {
      const fieldMatch =
        filter.fieldId === 0 ||
        question.fieldEnum === dropdownField.find((item) => item.id === filter.fieldId)?.field
      const skillMatch = filter.skillId === 0 || question.skillIds.includes(filter.skillId)
      const positionMatch =
        filter.positionId === 0 || question.positionIds.includes(filter.positionId)
      return fieldMatch && skillMatch && positionMatch
    })
    setFilteredQuestions(filteredData)
  }, [filter, allQuestions])

  const DropDown = ({ list, onChange, name, value }) => {
    const handleSelectChange = (event) => {
      const selectedValue = event.target.value
      onChange(selectedValue)
    }
    return (
      <div className='w-28 border-1 border-color px-2 py-1 rounded-md'>
        <DropDownListComponent
          id='field'
          name={`${name}`}
          fields={{ text: 'field', value: 'id' }}
          style={{ border: 'none' }}
          value={value}
          dataSource={list}
          popupHeight='220px'
          popupWidth='120px'
          onChange={handleSelectChange}
        />
      </div>
    )
  }

  // panigate
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const pageCount = Math.ceil(filteredQuestions.length / itemsPerPage)
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected)
  }
  const displayItems = filteredQuestions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  if (allQuestions.length === 0) {
    return (
      <Box
        fontFamily={'Montserrat'}
        fontWeight={400}
        backgroundColor={'#e9f3f5'}
        p={30}
        overflow='hidden'>
        <VStack spacing={10}>
          <Skeleton w={'70%'}>
            <div>contents wrapped</div>
            <div>won't be visible</div>
          </Skeleton>
          <Skeleton h={300} w={'70%'}>
            <div>contents wrapped</div>
            <div>won't be visible</div>
          </Skeleton>
          <Skeleton w={'70%'}>
            <div>contents wrapped</div>
            <div>won't be visible</div>
          </Skeleton>
          <Skeleton h={300} w={'70%'}>
            <div>contents wrapped</div>
            <div>won't be visible</div>
          </Skeleton>
          <Skeleton w={'70%'}>
            <div>contents wrapped</div>
            <div>won't be visible</div>
          </Skeleton>
        </VStack>
      </Box>
    )
  } else
    return (
      <>
        <div
          style={{ fontFamily: 'Montserrat' }}
          className='m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
          <Header title='Question' />
          <IconButton
            color='#03C9D7'
            backgroundColor='#f7f7f7'
            aria-label='Search database'
            icon={<AddIcon />}
            onClick={() => navigate('/question/add')}
          />

          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-2'>
              <p className='text-xl font-semibold'>Filter</p>
            </div>
            <div className='flex items-center gap-2'>
              <p>Field:</p>
              <DropDown
                value={filter.fieldId}
                name='field'
                list={dropdownField}
                onChange={(selectedValue) =>
                  setFilter((filter) => ({
                    ...filter,
                    fieldId: selectedValue,
                  }))
                }
              />
            </div>
            <div className='flex items-center gap-2'>
              <p>Skill:</p>
              <DropDown
                value={filter.skillId}
                name='skill'
                list={dropdownSkill(skills)}
                onChange={(selectedValue) =>
                  setFilter((filter) => ({
                    ...filter,
                    skillId: selectedValue,
                  }))
                }
              />
            </div>
            <div className='flex items-center gap-2'>
              <p>Position:</p>
              <DropDown
                value={filter.positionId}
                name='position'
                list={dropdownPosition(positions)}
                onChange={(selectedValue) =>
                  setFilter((filter) => ({
                    ...filter,
                    positionId: selectedValue,
                  }))
                }
              />
            </div>
          </div>

          <Stack w={'100%'}>
            <ReactPaginate
              className='question-panigate'
              pageCount={pageCount}
              onPageChange={handlePageChange}
              previousLabel='<'
              nextLabel='>'
              breakLabel='...'
              breakClassName='page-item'
              breakLinkClassName='page-link'
              containerClassName='pagination'
              pageClassName='page-item'
              pageLinkClassName='page-link'
              previousClassName='page-item'
              previousLinkClassName='page-link'
              nextClassName='page-item'
              nextLinkClassName='page-link'
              activeClassName='active'
            />
          </Stack>

          <List spacing={3}>
            {displayItems.map((item) => (
              <ListItem key={item.id}>
                <ListIcon as={MdCheckCircle} color='green.500' />
                <Box>
                  <Text fontSize='lg' fontWeight='bold'>
                    {item.question}
                  </Text>
                  <Text>Creator: {item.creatorName}</Text>
                  <Text>Field: {item.fieldEnum}</Text>
                  <Text>Answer: {item.answer}</Text>
                  <Text>
                   
                  </Text>
                  <Text>
                   
                  </Text>
                  <IconButton
                    color='#e06cae'
                    backgroundColor='#f7f7f7'
                    aria-label='Search database'
                    icon={<EditIcon />}
                    onClick={() => navigate(`/question/edit/${item.id}`)}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </div>
      </>
    )
}
