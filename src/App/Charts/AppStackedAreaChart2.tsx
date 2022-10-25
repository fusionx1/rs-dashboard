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
import './AppStackedAreaChart2.scss'
import StatisticDefinition from 'esri/rest/support/StatisticDefinition'
import useAppStore from '../Store/AppStore'
import { t } from 'i18next'
import { UniqueValueRenderer } from 'esri/renderers'

interface AppStackedAreaChart2 {
  fieldName: string
  layerId: number
  campaign: string
  description: string
}
interface ColorRampItem {
  id: number
  value: string
}

const AppStackedAreaChart2: FC<AppStackedAreaChart2> = (props: AppStackedAreaChart2) => {
  const yearFilter = useAppStore(state => state.yearFilterValues)
  const lineFilter = useAppStore(state => state.lineFilterValues)
  const lang = useAppStore(state => state.activeLanguage)
  
  
  const [data, setData] = useState([])
  const [colors, setColors] = useState<ColorRampItem[]>([])

  const [textOpen, setTextOpen] = useState(false)

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
      const current_campaign = current[props.campaign]
      if (!current_campaign) return
      if (!result.find(r => r.campaign === current_campaign)) {
        result.push({ campaign: current_campaign })
      }
      const result_obj = result.find(r => r.campaign === current_campaign)
      if (!result_obj[current_fieldname_translated]) {
        result_obj[current_fieldname_translated] = 0
      }
      result_obj[current_fieldname_translated] += current.value
    })
    return result.sort((a,b) => a.campaign - b.campaign)
  }

  

  const fetchData = () => {
    yearFilter.forEach((campaign) => {
    
    const layer = new FeatureLayer({ url: `${campaign.url}/${props.layerId}`})

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
    query.groupByFieldsForStatistics = [props.campaign, props.fieldName] // = GROUP BY
    query.returnGeometry = false
    if (selectedLineFilters.length > 0) {
      const sqlString = `'${selectedLineFilters.map(lf => lf.label).join("','")}'`
      query.where = `Linie IN (${sqlString})`
    }
    
    layer.queryFeatures(query)
      .then(response => {
        const newData = response.features.map(feat => feat.attributes)
        console.log('newData', newData)
        setData(transformData(newData))
      })        
    })
  }

  useEffect(() => fetchData(), [yearFilter, lineFilter, lang])

  console.log('data', data)


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
      <AreaChart
        data={data}
        className="border-red"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="campaign" tick={{ fontSize: 12 }} />
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
            
          return <Area type="monotone" key={idx} dataKey={t(props.fieldName + `_${col.id}`)} stackId="1" stroke={colors.find(c => c.id === col.id).value} fill={colors.find(c => c.id === col.id).value} fillOpacity={1}/>
          })}

        </AreaChart>
      </ResponsiveContainer>
}
    </div>

  )
}
export default AppStackedAreaChart2
