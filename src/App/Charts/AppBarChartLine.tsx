import React, { FC, useState, useEffect } from 'react'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

import {BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './AppBarChartLine.scss'
import StatisticDefinition from 'esri/rest/support/StatisticDefinition'
import useAppStore from '../Store/AppStore'
import { t } from 'i18next'
import { UniqueValueRenderer } from 'esri/renderers'

interface AppBarChartLineProps {
  fieldName: string
  layerId: number
  lineField: string
  description: string
}
interface ColorRampItem {
  id: number
  value: string
}

const AppBarChartLine: FC<AppBarChartLineProps> = (props: AppBarChartLineProps) => {
  const yearFilter = useAppStore(state => state.yearFilterValues.find(yf => yf.selected))
  const lineFilter = useAppStore(state => state.lineFilterValues)
  const lang = useAppStore(state => state.activeLanguage)
  
  const [data, setData] = useState([])
  const [colors, setColors] = useState<ColorRampItem[]>([])

  const [textOpen, setTextOpen] = useState(false)

  const layer = new FeatureLayer({ url: `${yearFilter.url}/${props.layerId}`})

  const getColorRamp = (renderer: UniqueValueRenderer) => {
    return renderer.uniqueValueInfos.map(ui => {
      return { id: Number(ui.value), value: ui.symbol.color.toHex()}
    })
  }


  // Transforms the data from esri rest response to format needed for chart
  const transformData = (data: any[]): any[] => {
    const result = []
    data.forEach(current => {
      
      const current_fieldname = props.fieldName + '_' + current[props.fieldName] // e.g. Schienentyp_ID_0
      const current_fieldname_translated = t(current_fieldname)
      const current_line = current[props.lineField]
      if (!current_line) return
      if (!result.find(r => r.line === current_line)) {
        result.push({ line: current_line })
      }
      const result_obj = result.find(r => r.line === current_line)
      if (!result_obj[current_fieldname_translated]) {
        result_obj[current_fieldname_translated] = 0
      }
      result_obj[current_fieldname_translated] += current.value
    })
    return result.sort((a,b) => a.line - b.line)
  }

  const fetchData = () => {
    layer.when(l => setColors(getColorRamp(l.renderer)))

    const selectedLineFilters = lineFilter.filter(lf => lf.selected)

    const query = layer.createQuery()
    query.outStatistics = [
      {
        onStatisticField: 'Prozent_Segment',
        outStatisticFieldName: 'value',
        statisticType: 'sum'
      } as StatisticDefinition,
    ]
    
    query.groupByFieldsForStatistics = [props.lineField, props.fieldName] // = GROUP BY
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

  return (
    <div className="w-full h-full pt-2 pb-4 pr-3 overflow-hidden">
      {props.description && <>
      
      <button className='absolute info-icon top-[9px] right-[9px]' onMouseOver={() => setTextOpen(true)} onMouseOut={() => setTextOpen(false)}></button>
      { textOpen &&
        <div className="bg-sersa2 w-full h-full z-50 text-[12px] items-start justify-center text-justify mb-4 px-3">{props.description}</div>
      }
      </>
      }
      { data && colors.length > 0 &&
      <ResponsiveContainer>
        <BarChart
          data={data}
          className="border-red"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="line" tick={{fontSize: 12}} />
          <YAxis 
            tickFormatter={(label) => `${label} %`} 
            tick={{fontSize: 12}} 
            width={60}
            />
          <Tooltip
            contentStyle={{ backgroundColor: 'white'}}
            itemStyle={{color: 'black', fontSize: '12px'}}
            labelStyle={{fontSize: '14px', fontWeight: 'bold', textAlign: 'center'}}
            wrapperStyle= {{outline:'none'}}
                     
            formatter={(value) => (
            <span className="text-[12px]">{value.toFixed(1)} %</span>
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

          { colors.map((col, idx) => {
            
          return <Bar key={idx} dataKey={t(props.fieldName + `_${col.id}`)} stackId="a" fill={colors.find(c => c.id === col.id).value} />
          })}

        </BarChart>
      </ResponsiveContainer>
}
    </div>

  )
}
export default AppBarChartLine
