import React, { FC, useState, useEffect } from 'react'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts'
import './AppLineChartChanges.scss'
import StatisticDefinition from 'esri/rest/support/StatisticDefinition'
import useAppStore, { YearFilter } from '../Store/AppStore'
import { t } from 'i18next'
import { UniqueValueRenderer } from 'esri/rasterRenderers'
import FeatureSet from '@arcgis/core/rest/support/FeatureSet'


interface AppLineChartChangesProps {
  fieldName: string
  layerId: number
  description: number
}
interface ColorRampItem {
  id: number
  value: string
}

interface ChartDataItem {
  campaign: string
}

const AppLineChartChanges: FC<AppLineChartChangesProps> = (props: AppLineChartChangesProps) => {
  const yearFilters = useAppStore(state => state.yearFilterValues)
  const lineFilter = useAppStore(state => state.lineFilterValues)
  const lang = useAppStore(state => state.activeLanguage)

  const [data, setData] = useState<ChartDataItem[]>([])
  const [dataChanges, setDataChanges] = useState<ChartDataItem[]>([])
  const [colors, setColors] = useState<ColorRampItem[]>([])

  const [textOpen, setTextOpen] = useState(false)

  const getColorRamp = (renderer: UniqueValueRenderer) => {
    return renderer.uniqueValueInfos.map(ui => {
      return { id: Number(ui.value), value: ui.symbol.color.toHex() }
    })
  }

  const transformFeatureSet = (campaignLabel: string, featureSet: FeatureSet) => {
    const features = featureSet.features.map(feat => feat.attributes)
  
    const result: ChartDataItem = { campaign: campaignLabel }  

    // Ohne forEach
    // const feature = features[0]
    // const key = Object.keys(feature)[1]
    // const key_pt2 = feature[key] as string
   
    
    features.forEach((feature) => {
      const key = Object.keys(feature)[1]
      const value = feature[key] as string

      result[t(`${key}_${value}`)] = feature.value
    })

    return result
  }

  const calculateChanges = () => {
    const changes = []

    data.forEach((feature, id) => {

      const objectKeys = Object.keys(feature).filter(k => k != 'campaign')

      const result = {campaign: feature.campaign}     

      objectKeys.forEach((key) => {

        const category = key
        let value = 0
        let km = 0
        let abs = 0

        if (id > 0 && data[id-1][key] != null ) {//data[id-1][key] != null => check if value of last campaign != 0 (division / 0 is not allowed)

          abs = 100 * ((data[id][key] / data[id-1][key]) -1)
          
          if (key === 'Neuwertig' || key === 'Gut' || key === 'Ausreichend')
          
          value = 100 * ((data[id][key] / data[id-1][key]) -1),
          km = data[id][key]
          
          else 
          value = 100 * ((data[id][key] / data[id-1][key]) -1) * (-1), //Ungenüngend, Schlecht, Unbekannt * (-1)
          km = data[id][key]
          
          if (value > 100) value = 100
          if (value < -100) value = -100

        }  
        else {
          km = data[id][key]        
        }

        result[category] = value
        result[`${key}_km`] = km
        result[`${key}_abs`] = abs

      })

    changes.push(result)

  })
  setDataChanges(changes)
  }


  const fetchCampaignData = (campaign: YearFilter) => {
    const layer = new FeatureLayer({ url: `${campaign.url}/${props.layerId}` })
      
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
      return layer.queryFeatures(query)
    }

  const fetchColors = () => {
    const layer = new FeatureLayer({ url: `${yearFilters[0].url}/${props.layerId}` })
    layer.load().then(l => setColors(getColorRamp(l.renderer)))
  }

  const fetchData = () => {
    const promises = yearFilters.map(yearFilter => 
      fetchCampaignData(yearFilter).then(res => { return { yearFilter: yearFilter, featureSet: res } })
      )

    Promise.all(promises).then((result: Array<{ yearFilter: YearFilter, featureSet: FeatureSet }>) => {
            
      // Ohne map
      // const transformed = transformFeatureSet(result[0].featureSet, result[0].yearFilter.label)

      const transformed = result.map(res => transformFeatureSet(res.yearFilter.label, res.featureSet))
      // console.log('transformed', transformed)

      setData(transformed)
    })
  }

  useEffect(() => fetchData(), [lineFilter, lang])
  useEffect(() => fetchColors(), [])
  useEffect(() => {if (data.length > 0) calculateChanges()}, [data])

  return (
    <div className="w-full h-full pt-2 pb-4 pr-3">
      {props.description && <>

        <button className='absolute info-icon top-[9px] right-[9px]' onMouseOver={() => setTextOpen(true)} onMouseOut={() => setTextOpen(false)}></button>
        {textOpen &&
          <div className="bg-sersa2 w-full h-full z-50 text-[12px] items-start justify-center text-justify mb-4 px-3">{props.description}</div>
        }
        </>
        }
      {data.length > 0 &&
        <ResponsiveContainer>
          <LineChart
            data={dataChanges}
            className="border-red"
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={1}/>
                <stop offset="95%" stopColor="red" stopOpacity={1}/>
              </linearGradient>
            </defs>
            <ReferenceArea
            y1={-100}
            y2={0}
            fill="url(#colorGradient)"
            />
            <XAxis dataKey="campaign" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(label: number) => `${label.toFixed(0)} %`}
              tick={{ fontSize: 12 }}
              width={60}
              tickCount={10}
              domain={[-100, 100]}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'white' }}
              itemStyle={{ color: 'black', fontSize: '12px' }}
              labelStyle={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}
              wrapperStyle={{ outline: 'none' }}

              formatter={(value, name, props) => (
                <span className="text-[12px]">{props.payload[`${name}_km`].toFixed(1)} km ({props.payload[`${name}_abs`] > 0 ? '+' + props.payload[`${name}_abs`].toFixed(1) : props.payload[`${name}_abs`].toFixed(1)} %)</span>
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
          
              return <Line
              key={idx} 
              dataKey={t(props.fieldName + `_${col.id}`)} 
              fill={colors.find(c => c.id === col.id).value}
              stroke={colors.find(c => c.id === col.id).value}
              strokeWidth={2}/>

            })}           

          </LineChart>
        </ResponsiveContainer>
      }
    </div>
  )
}
export default AppLineChartChanges