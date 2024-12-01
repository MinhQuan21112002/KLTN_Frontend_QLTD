import React from 'react'
import { Header } from '../../Components-admin'
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
  ResourcesDirective,
  ResourceDirective,
} from '@syncfusion/ej2-react-schedule'
import { useState } from 'react'
import { useEffect } from 'react'
import { calendarService } from '../../Service/calendar.service'
import { calendarConver } from './CalendarConvert'
import './calendar.css'
import { CircularProgress, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react'

const PropertyPane = (props) => <div className='mt-5'>{props.children}</div>

export const AdminCalendar = () => {
  const [scheduleObj, setScheduleObj] = useState()
  const accessToken = JSON.parse(localStorage.getItem('data')).access_token
  const [displayCalendar, setDisplayCalendar] = useState()

  const change = (args) => {
    scheduleObj.selectedDate = args.value
    scheduleObj.dataBind()
  }
  const onDragStart = (arg) => {
    arg.navigation.enable = true
  }

  useEffect(() => {
    calendarService
      .getMyCalendar(accessToken)
      .then((res) => {
        setDisplayCalendar(calendarConver.convertCalendar(res))
      })
      .catch((er) => console.log(er))
  }, [])

  if (displayCalendar === undefined) {
    return (
      <div className='m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Header category='pages' title='Calendar' />
        <Stack>
          <Skeleton height='50px' />
          <Skeleton height='50px' />
          <Skeleton height='50px' />
        </Stack>
      </div>
    )
  } else if (displayCalendar.length === 0) {
    return (
      <div className='m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
        <Header category='pages' title='Calendar' />
        <Text>Your calendar is null</Text>
      </div>
    )
  } else
    return (
      <>
        <div
          style={{ fontFamily: 'Montserrat', fontWeight: '400px' }}
          className='m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl'>
          <Header title='Calendar' />
          <ScheduleComponent
            height='650px'
            ref={(schedule) => setScheduleObj(schedule)}
            eventSettings={{ dataSource: displayCalendar }}
            selectedDate={new Date()}
            dragStart={onDragStart}>
            <ResourcesDirective>
              <ResourceDirective
                field='ResourceId'
                title='Resource'
                name='Resources'
                allowMultiple={true}
                dataSource={calendarConver.generateResourceData()}
                textField='Text'
                idField='Id'
                colorField='Color'></ResourceDirective>
            </ResourcesDirective>
            <ViewsDirective>
              {['Month', 'Agenda'].map((item) => (
                <ViewDirective key={item} option={item} />
              ))}
            </ViewsDirective>
            <Inject services={[Month, Agenda, Resize, DragAndDrop]} />
          </ScheduleComponent>
        </div>
      </>
    )
}