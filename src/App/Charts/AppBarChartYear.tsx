import React, { FC, useState, useEffect } from 'react'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import './AppBarChartYear.scss'
import StatisticDefinition from 'esri/rest/support/StatisticDefinition'
import useAppStore from '../Store/AppStore'
import { t } from 'i18next'
import { UniqueValueRenderer } from 'esri/rasterRenderers'


interface AppBarChartYearProps {
  fieldName: string
  yearField: string
  layerId: number
}
interface ColorRampItem {
  id: number
  value: string
}

const AppBarChartYear: FC<AppBarChartYearProps> = (props: AppBarChartYearProps) => {
  const yearFilter = useAppStore(state => state.yearFilterValues.find(yf => yf.selected))
  const lineFilter = useAppStore(state => state.lineFilterValues)
  const lang = useAppStore(state => state.activeLanguage)
  const [colors, setColors] = useState<ColorRampItem[]>([])
  const setActiveChartFilter = useAppStore(state => state.setActiveChartFilter)
  const activeChartFilterValues = useAppStore(state => state.activeChartFilterValues)

  const [data, setData] = useState<{ year: string }[]>([])

  const [textOpen, setTextOpen] = useState(false)

  const [filter, setFilter] = useState<{ id: string, fieldName: string, type: string }>(null)
  useEffect(() => {
    const filter = activeChartFilterValues.find(filter => filter.fieldName === props.yearField)
    setFilter(filter)
  }, [activeChartFilterValues])

  const layer = new FeatureLayer({ url: `${yearFilter.url}/${props.layerId}` })

  // Transforms the data from esri rest response to format needed for chart
  // This function is used in two components and can be put to a separate file
  const transformData = (data: any[]): any[] => {
    const result = [] // Resulting array
    data.forEach(current => {

      const current_fieldname = props.fieldName + '_' + current[props.fieldName] // e.g. Schienentyp_ID_0
      const current_fieldname_translated = t(current_fieldname)
      const current_year = current[props.yearField]
      if (!current_year) return // If no value for this year ( = 0)

      // If the year is not yet in the result array, create new object with this year
      if (!result.find(r => r.year === current_year)) {
        result.push({ year: current_year })
      }

      // Get the existing object in result array
      const result_obj = result.find(r => r.year === current_year)
      // If no value is there, create new property
      if (!result_obj[current_fieldname_translated]) {
        result_obj[current_fieldname_translated] = 0
      }

      // Add the value of the current data entry
      result_obj[current_fieldname_translated] += current.value
    })
    return result.sort((a, b) => a.year - b.year) // Sort by year ascending
  }

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

    query.groupByFieldsForStatistics = [props.yearField, props.fieldName] // = GROUP BY
    query.returnGeometry = false
    if (selectedLineFilters.length > 0) {
      const sqlString = `'${selectedLineFilters.map(lf => lf.label).join("','")}'`
      query.where = `Linie IN (${sqlString})`
    }

    layer.queryFeatures(query)
      .then(response => {
        const newData = response.features.map(feat => feat.attributes)
        setData(transformData(newData))
      })
  }
  useEffect(() => fetchData(), [yearFilter, lineFilter, lang])

  const onBarClick =
    (entry, _) => {
      const year = entry.year as number

      {
        activeChartFilterValues.map(filter => {
          filter.id === year && filter.fieldName === props.yearField ? setActiveChartFilter(null, null, null) : setActiveChartFilter(year, props.yearField, 'bar')
        })
      }
    }

  const description = ''

  return (
    <div className="w-full h-full pt-2 pb-4 pr-3">
      {description && <>
      
      <button className='absolute info-icon top-[9px] right-[9px]' onMouseOver={() => setTextOpen(true)} onMouseOut={() => setTextOpen(false)}></button>
      { textOpen &&
        <div className="bg-sersa2 w-full h-full z-50 text-[12px] items-start justify-center text-justify mb-4 pt-2 px-3">{description}</div>
      }
      </>
      } 
      {data.length > 0 &&
        <ResponsiveContainer>
          <BarChart
            data={data}
            className="border-red"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(label: string) => `${label} km`}
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'white' }}
              itemStyle={{ color: 'black', fontSize: '12px' }}
              labelStyle={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}
              wrapperStyle={{ outline: 'none' }}

              formatter={(value) => (
                <span className="text-[12px]">{value.toFixed(1)} km</span>
              )} />

            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              iconType={'circle'}
              iconSize={14}
              formatter={(value) => (
                <span className="text-black text-[12px]">{value}</span>
              )} />

            { colors.map((col, idx) => {
              const isFiltered = data.some(d => d.year === filter?.id)
              if (isFiltered) {
                return <Bar key={idx} dataKey={t(props.fieldName + `_${col.id}`)} stackId="a" onClick={onBarClick} fill={colors.find(c => c.id === col.id).value}>
                  {
                    data.map((entry, index) => <Cell key={`cell-${index}`} fillOpacity={entry.year === filter.id ? 1 : 0.1} />)
                  }
                </Bar>
              }
              else {
                return <Bar key={idx} dataKey={t(props.fieldName + `_${col.id}`)} stackId="a" onClick={onBarClick} fill={colors.find(c => c.id === col.id).value} />
              }
            })
            }

          </BarChart>
        </ResponsiveContainer>
      }
    </div>

  )
}
export default AppBarChartYear