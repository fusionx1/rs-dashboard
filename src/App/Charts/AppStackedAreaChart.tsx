import React, { FC, useState, useEffect } from 'react'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

import {AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './AppStackedAreaChart.scss'
import StatisticDefinition from 'esri/rest/support/StatisticDefinition'
import useAppStore from '../Store/AppStore'
import { t } from 'i18next'
import { UniqueValueRenderer } from 'esri/renderers'

interface AppStackedAreaChartProps {
  fieldName: string
}

const AppStackedAreaChart: FC<AppStackedAreaChartProps> = (props: AppStackedAreaChartProps) => {
  const yearFilter = useAppStore(state => state.yearFilterValues.find(yf => yf.selected))
  const lineFilter = useAppStore(state => state.lineFilterValues)
  const lang = useAppStore(state => state.activeLanguage)
  const [colors, setColors] = useState([])
  
  const [data, setData] = useState([])

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
    return result.sort((a,b) => a.year - b.year) // Sort by year ascending
  }

  const getColorRamp = (renderer: UniqueValueRenderer) => {
    return renderer.uniqueValueInfos.map(ui => {
      return { id: Number(ui.value), value: ui.symbol.color.toHex() }
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

  const testdata = [
    {
      name: '2021-1',
      Neuwertig: 8.13024110121279,
      New: 8.13024110121279,
      Gut: 4.38177228824528,
      Good: 4.38177228824528,
      Ausreichend: 4.29828134772965,
      Sufficient: 4.29828134772965,
      Schlecht: 1.44001321175369,
      Bad: 1.44001321175369,
      Unbekannt: 2.58022977304963,
      Unknown: 2.58022977304963
    },
    {
      name: '2021-2',
      Neuwertig: 8.80085878453505,
      New: 8.80085878453505,
      Gut: 3.75714532639115,
      Good: 3.75714532639115,
      Ausreichend: 4.50391451592552,
      Sufficient: 4.50391451592552,
      Schlecht: 1.37259022204627,
      Bad: 1.37259022204627,
      Unbekannt: 2.39602887309304,
      Unknown: 2.39602887309304
    },
    {
      name: '2022-1',
      Neuwertig: 8.36973627316877,
      New: 8.36973627316877,
      Gut: 4.07843933873444,
      Good: 4.07843933873444,
      Ausreichend: 4.57331762280473,
      Sufficient: 4.57331762280473,
      Schlecht: 1.41301561419007,
      Bad: 1.41301561419007,
      Unbekannt: 2.39602887309304,
      Unknown: 2.39602887309304
    },
  ]

  return (
    <div className="w-full h-full pb-4 pr-3 ">
    <ResponsiveContainer>
      <AreaChart
          data={testdata}
          >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{fontSize: 12}} />
          <YAxis 
            tickFormatter={(label) => `${label} km`} 
            tick={{fontSize: 12}} 
            width={60}
            />
          <Tooltip
            contentStyle={{ backgroundColor: 'white'}}
            itemStyle={{color: 'black', fontSize: '12px'}}
            labelStyle={{fontSize: '14px', fontWeight: 'bold', textAlign: 'center'}}
            wrapperStyle= {{outline:'none'}}
                     
            formatter={(value) => (
            <span className="text-[12px]">{value.toFixed(2)} km</span>
            )}/>
          <Legend 
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconType={'circle'}
            iconSize={14}
            formatter={(value) => (
              <span className="text-black text-[12px]">{value}</span>
            )}/>
          <Area type="monotone" dataKey={t('Neuwertig')} stackId="1" stroke="#38A800" fill="#38A800" fillOpacity={1}/>
          <Area type="monotone" dataKey={t('Gut')} stackId="1" stroke="#FFFF00" fill="#FFFF00" fillOpacity={1}/>
          <Area type="monotone" dataKey={t('Ausreichend')} stackId="1" stroke="#E69800" fill="#E69800" fillOpacity={1}/>
          <Area type="monotone" dataKey={t('Schlecht')} stackId="1" stroke="#730000" fill="#730000" fillOpacity={1}/>
          <Area type="monotone" dataKey={t('Unbekannt')} stackId="1" stroke="#AAAAAA" fill="#AAAAAA" fillOpacity={1}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>

  )
}
export default AppStackedAreaChart