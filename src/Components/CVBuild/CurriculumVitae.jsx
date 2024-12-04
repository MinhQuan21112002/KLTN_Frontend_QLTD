import React, { useRef, useState } from 'react'
import {
  Button,
  FormLabel,
  Heading,
  HStack,
  SlideFade,
  Stack,
  Switch,
  VStack,
} from '@chakra-ui/react'
import { ToastContainer, toast } from 'react-toastify'
import { SectionWithInfo } from './SectionWithInfo'
import { SectionWithList } from './SectionWithList'
import { SectionWithParagraph } from './SectionWithParagraph'
import { SectionWithTable } from './SectionWithTable'
import { useReactToPrint } from 'react-to-print'
import './index.css'

export const CurriculumVitae = () => {
  const initState = {
    name: 'Nguyễn Vũ Minh Quân',
    position: 'FullStack Developer',
    info: [
      ['Name', 'Nguyễn Lê Quốc Khánh'],
      ['Date Of Birth', '21/11/2002'],
      ['Phone', '0385542672'],
      ['Gmail', 'nguyenkhanh2kpi@gmail.com'],
      ['Address', 'Tân Thanh, Lâm Hà, Lâm Đồng'],
    ],
    overview: `- Over 2 years of experience in programming with good communication and quick learning skills\n- Over 2 years of experience in programming with good communication and quick learning skills\n- Over 2 years of experience in programming with good communication and quick learning skills\n- Over 2 years of experience in programming with good communication and quick learning skills\n- Over 2 years of experience in programming with good communication and quick learning skills`,
    expr: [
      [
        '07/2015 - 03/2018',
        'AI&T JSC',
        `Full-stack Developer\n- Outsourcing projects\n- Create coding frames and design database based on project descriptions`,
      ],
      [
        '01/2019 - 01/2020',
        'Freelance',
        `Full-stack Developer\n- Develop web module on given projects.`,
      ],
    ],
    edu: [
      ['08/2020 - 08/2024', 'HCMUTE University', `- Khóc hơn chục lần\n- Deadline tới chết\n`],
      [
        '10/2020 - 12/2020',
        'Toeic Time',
        `- Học Tiếng Anh mục tiêu 600\n- Ra trường với Toeic cao`,
      ],
      ['08/2020 - 08/2024', 'Life Cycle', `- Ăn và code tới khi không ngồi được nữa`],
    ],
    skill: [
      [
        'Main',
        '- HTML, CSS, JavaScript (ReactJS, React-Native, Lit)\n- PHP (Laravel, Symfony, Codeigniter, Yii)\n- Node (ExpressJS)\n- RESTful API, GraphQL',
      ],
      ['Others', '- Ruby (Ruby on Rails)\n- SVN, GIT'],
    ],
    proj: [
      {
        name: 'Apply Job Web',
        time: '06/2023 - Present',
        client: 'Team 03',
        desc: 'Design and Build an Apply Job website',
        noOfMem: 7,
        pos: 'Front End Dev',
        responsibility: '- Dev\n- Solution Architect',
        technology: '- Frontend: ReactJS\n- Backend: Java \n- Database: GraphQL',
      },
    ],
  }

  const cvRef = useRef()
  const [data, setData] = useState(initState)
  const [imgSrc, setImgSrc] = useState(
    'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'
  )

  const generatePDF = useReactToPrint({
    content: () => cvRef.current,
    documentTitle: 'CV_PDF',
    onAfterPrint: () => alert('Data saved in PDF'),
  })
  const [isEdit, setIsEdit] = useState(false)

  const hanldeAddField = (type, payload) => {
    if (payload.newVal) {
      switch (type) {
        case 'INFO':
          data.info[payload.idx] = payload.newVal
          break
        case 'TABLE':
          data.expr.splice(payload.idx + 1, 0, ['TIME', 'COMPANY', 'CONTENT'])
          break
        case 'EDU':
          data.edu.splice(payload.idx + 1, 0, ['TIME', 'UNI OR COURSE', 'CONTENT'])
          break
        case 'SKL':
          data.skill.splice(payload.idx + 1, 0, ['TYPE', 'NOTE', 'SKILLS'])
          break
        case 'PROJ':
          data.proj.splice(payload.idx + 1, 0, {
            name: 'NAME',
            time: '',
            desc: '',
            client: '',
            noOfMem: 0,
            pos: '',
            responsibility: '',
            technology: '',
          })
          break
        default:
          break
      }
      return
    }

    switch (type) {
      case 'INFO':
        data.info.splice(payload.idx + 1, 0, ['DATA FIELD', 'VALUE'])
        break
      case 'TABLE':
        data.expr.splice(payload.idx + 1, 0, ['TIME', 'COMPANY', 'CONTENT'])
        break
      case 'EDU':
        data.edu.splice(payload.idx + 1, 0, ['TIME', 'UNI OR COURSE', 'CONTENT'])
        break
      case 'SKL':
        data.skill.splice(payload.idx + 1, 0, ['TYPE', 'NOTE', 'SKILLS'])
        break
      case 'PROJ':
        data.proj.splice(payload.idx + 1, 0, {
          name: 'NAME',
          time: '',
          desc: '',
          client: '',
          noOfMem: 0,
          pos: '',
          responsibility: '',
          technology: '',
        })
        break
      default:
        return
    }
  }

  const hanldeRemoveField = (type, payload) => {
    switch (type) {
      case 'INFO':
        data.info.splice(payload.idx, 1)
        break
      case 'TABLE':
        data.expr.splice(payload.idx, 1)
        break
      case 'EDU':
        data.edu.splice(payload.idx, 1)
        break
      case 'SKL':
        data.skill.splice(payload.idx, 1)
        break
      case 'PROJ':
        data.proj.splice(payload.idx, 1)
        break
      default:
        return
    }
  }
  const handleUpdateData = (type, payload, addField = true) => {
    if (!payload) {
      setData({ ...data })
      return
    }
    if (addField) hanldeAddField(type, payload)
    else hanldeRemoveField(type, payload)
    setData({ ...data })
  }

  const handleChangAvt = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      const reader = new FileReader()
      reader.onload = () => {
        setImgSrc(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      console.log('BUG')
    }
  }

  return (
    <VStack fontFamily={'Montserrat'} fontWeight={400}>
      <SlideFade in={true} offsetY={20}>
        <Heading size={'lg'} m={'6'} mt={24} ml={2} textAlign={'left'} marginRight='auto'></Heading>
        <Stack direction='row' spacing={4}>
          <Switch
            colorScheme='teal'
            size='lg'
            style={{ margin: '8px' }}
            isChecked={isEdit}
            onChange={() => setIsEdit(!isEdit)}
          />
          <Button colorScheme='blue' variant='outline' onClick={generatePDF}>
            Print PDF
          </Button>
        </Stack>
      </SlideFade>
      <HStack align={'flex-start'} w={'60vw'} m={5} p={5}>
        <input
          type='file'
          accept='image/*'
          onChange={handleChangAvt}
          id='fileInput'
          className='hidden'
        />
        <div
          className='cv'
          style={{
            backgroundImage:
              "url('https://cv.fullstack.edu.vn/backgrounds/graph-dot-top-458966.svg')",
          }}>
          <div className='page' ref={cvRef} style={{ fontFamily: 'Montserrat', padding: '20px' }}>
            <div>
              <input
                className='cv-ipt name'
                style={{ color: 'green', fontWeight: '600' }}
                value={data.name}
                onChange={(e) => {
                  data.name = e.target.value
                  handleUpdateData(data)
                }}
              />
              <br />
              <input
                className='cv-ipt name'
                style={{
                  color: 'green',
                  fontWeight: '600',
                  fontSize: '23px',
                }}
                value={data.position}
                onChange={(e) => {
                  data.position = e.target.value
                  handleUpdateData(data)
                }}
              />
              <br />
            </div>
            <div className='d-flex justify-content-between'>
              <SectionWithInfo
                title={''}
                type={'INFO'}
                sectionData={data.info}
                handleUpdateData={handleUpdateData}
                isShowButton={isEdit}
              />
              <div
                onClick={() => {
                  const fileInput = document.getElementById('fileInput')
                  if (fileInput) {
                    fileInput.click()
                  }
                }}
                className='img-container'
                style={{
                  backgroundImage: `url(${imgSrc})`,
                  height: 220,
                  width: 220,
                  backgroundPosition: 'center center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }}></div>
            </div>
            <SectionWithParagraph
              iconName={'bi bi-yelp'}
              title={'Overview'}
              sectionData={data.overview}
              isShowButton={isEdit}
            />
            <SectionWithList
              iconName={'bi bi-pie-chart'}
              title={'Skill'}
              type={'SKL'}
              oneRow={true}
              sectionData={data.skill}
              handleUpdateData={handleUpdateData}
              isShowButton={isEdit}
            />
            <SectionWithList
              iconName={'bi bi-award'}
              title={'Work Experience'}
              type={'EXPR'}
              sectionData={data.expr}
              handleUpdateData={handleUpdateData}
              isShowButton={isEdit}
            />
            <SectionWithList
              iconName={'bi bi-box'}
              title={'Education'}
              type={'EDU'}
              sectionData={data.edu}
              handleUpdateData={handleUpdateData}
              isShowButton={isEdit}
            />
            <SectionWithTable
              iconName={'bi bi-brightness-high'}
              title={'Project'}
              type={'PROJ'}
              sectionData={data.proj}
              handleUpdateData={handleUpdateData}
              isShowButton={isEdit}
            />
          </div>
        </div>
      </HStack>
    </VStack>
  )
}
