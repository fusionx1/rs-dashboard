import React, { FC, useState, useEffect } from 'react'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

import {
  Pie,
  PieChart,
  Sector,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import './AppPieChart.scss'
import StatisticDefinition from 'esri/rest/support/StatisticDefinition'
import useAppStore from '../Store/AppStore'
import { t } from 'i18next'
import { UniqueValueRenderer } from 'esri/rasterRenderers'

interface AppPieChartProps {
  fieldName: string
  layerId: number
  description: string
}

const AppPieChart: FC<AppPieChartProps> = (props: AppPieChartProps) => {
  const yearFilter = useAppStore(state => state.yearFilterValues.find(yf => yf.selected))
  const lineFilter = useAppStore(state => state.lineFilterValues)
  const lang = useAppStore(state => state.activeLanguage)
  const setActiveChartFilter = useAppStore(state => state.setActiveChartFilter)
  const activeChartFilterValues = useAppStore(state => state.activeChartFilterValues)

  const [data, setData] = useState([])
  const [colors, setColors] = useState([])

  const [textOpen, setTextOpen] = useState(false)

  const layer = new FeatureLayer({ url: `${yearFilter.url}/${props.layerId}` })

  const getColorRamp = (renderer: UniqueValueRenderer) => {
    return renderer.uniqueValueInfos.map(ui => {
      return { id: Number(ui.value), value: ui.symbol.color.toHex()}
    })
  }

  const fetchData = () => {
    layer.when(l => setColors(getColorRamp(l.renderer)))
    const selectedLineFilters = lineFilter.filter(lf => lf.selected)

    const query = layer.createQuery()
    query.outStatistics = [
      {
        onStatisticField: 'Segmentlaenge_km',
        outStatisticFieldName: 'value',
        statisticType: 'sum'
      } as StatisticDefinition,
    ]

    query.groupByFieldsForStatistics = [props.fieldName] // = GROUP BY
    query.returnGeometry = false
    if (selectedLineFilters.length > 0) {
      const sqlString = `'${selectedLineFilters.map(lf => lf.label).join("','")}'`
      query.where = `Linie IN (${sqlString})`
    }
  
    layer.queryFeatures(query)
      .then(response => {
        const newData = response.features.map(feat => {
          const name = feat.attributes[props.fieldName] as string
          return { id: name, name: t(props.fieldName + '_' + name), value: feat.attributes.value }
        })
        setData(newData)
        
      })
  }

  useEffect(() => fetchData(), [yearFilter, lineFilter, lang])

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      percent,
      name,
      value,
    } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 5) * cos
    const sy = cy + (outerRadius + 5) * sin
    const mx = cx + (outerRadius + 15) * cos
    const my = cy + (outerRadius + 15) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 11
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <>
      { colors.length > 0 &&
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke="#000000"
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill="#000000" stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#000000"
          fontSize={12}
        >
          {name}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#000000"
          fontSize={12}
        >
          {`${value.toFixed(1)} km (${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
  }
      </>
    )
  }

  const [activeIndex, setActiveIndex] = useState(-1)
  const onPieEnter = 
    (_, index) => {
      setActiveIndex(index)
    }
    
  const onPieOut = 
    () => {
      setActiveIndex(-1)
    }

  const onPieClick = 
  (entry, _) => {
    const id = entry.id as number
    
    {activeChartFilterValues.map(filter => {
      if (filter.id === id && filter.fieldName === props.fieldName) {
      setActiveChartFilter(null, null, null)
    }
      else {
      setActiveChartFilter(id, props.fieldName, 'pie')
    }
    })}
}

  const numDescending = [...data].sort((a, b) => a.id - b.id) 
 
  
  return (
    <div className="w-full h-full pb-4">
      {props.description && <>
      
      <button className='absolute info-icon top-[9px] right-[9px]' onMouseOver={() => setTextOpen(true)} onMouseOut={() => setTextOpen(false)}></button>
      { textOpen &&
        <div className="bg-sersa2 w-full h-full z-50 text-[12px] items-start justify-center text-justify mb-4 pt-2 px-3">{props.description}</div>
      }
      </>
      }   
      <ResponsiveContainer>
        <PieChart>
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconType={'circle'}
            iconSize={14}
            formatter={(size) => (
              <span className="text-black text-[12px]">{size}</span>
            )}
          />
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={numDescending}
            outerRadius="50%"
            cx="50%"
            cy="50%"
            fill="#ff00000"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseOut={onPieOut}
            onClick={onPieClick}
            minAngle={2}
          >
            {activeChartFilterValues.map(filter => (
              
            numDescending.map((entry, index) => (
              filter.fieldName === props.fieldName ?
              <Cell
                key={`cell-${index}`}
                fill={colors.find(col => col.id === entry.id).value}
                fillOpacity={index === filter.id ? 1 : 0.1}
              />
            :
              <Cell
                key={`cell-${index}`}
                fill={colors.find(col => col.id === entry.id).value}
              />
              ))
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AppPieChart
