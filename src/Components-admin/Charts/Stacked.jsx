import React, { useEffect, useState } from 'react'
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  StackingColumnSeries,
  Tooltip,
} from '@syncfusion/ej2-react-charts'

import { stackedCustomSeries, stackedPrimaryXAxis, stackedPrimaryYAxis } from '../../data/dummy'
import { useStateContext } from '../../contexts/ContextProvider'
import { loadJob } from '../../redux/Job-posting/Action'
import { useDispatch, useSelector } from 'react-redux'
import { cvService } from '../../Service/cv.service'

const Stacked = ({ width, height, cvData ,jobData}) => {
  const { currentMode } = useStateContext()
  const stackedCustomSeriesW = [
 

    {
      dataSource: cvData,
      xName: 'x',
      yName: 'y',
      name: 'Lượt ứng tuyển',
      type: 'StackingColumn',
      background: 'red',
    },
  ]



  const CVstackedPrimaryYAxis = {
    lineStyle: { width: 0 },
    minimum: 0,
    maximum: 20,
    interval: 1,
    majorTickLines: { width: 0 },
    majorGridLines: { width: 1 },
    minorGridLines: { width: 1 },
    minorTickLines: { width: 0 },
    labelFormat: '{value}',
  }

  return (
    <ChartComponent
      id='charts'
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={CVstackedPrimaryYAxis}
      width={width}
      height={height}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white' }}>
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {stackedCustomSeriesW.map((item, index) => (
          <SeriesDirective key={index} {...item} />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  )
}

export default Stacked
