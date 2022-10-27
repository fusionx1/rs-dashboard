import React, { FC, useState, useEffect } from 'react'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './AppAreaChartTrend.scss'
import StatisticDefinition from 'esri/rest/support/StatisticDefinition'
import useAppStore, { YearFilter } from '../Store/AppStore'
import { t } from 'i18next'
import { UniqueValueRenderer } from 'esri/renderers'
import FeatureSet from '@arcgis/core/rest/support/FeatureSet'

interface AppAreaChartTrendProps {
  fieldName: string
  layerId: number
  description: string
}
interface ColorRampItem {
  id: number
  value: string
}

interface ChartDataItem {
  campaign: string
}

const AppAreaChartTrend: FC<AppAreaChartTrendProps> = (props: AppAreaChartTrendProps) => {
  const yearFilters = useAppStore(state => state.yearFilterValues)
  const lineFilter = useAppStore(state => state.lineFilterValues)
  const lang = useAppStore(state => state.activeLanguage)


  const [data, setData] = useState<ChartDataItem[]>([])
  const [colors, setColors] = useState<ColorRampItem[]>([])

  const [textOpen, setTextOpen] = useState(false)

  const getColorRamp = (renderer: UniqueValueRenderer) => {
    return renderer.uniqueValueInfos.map(ui => {
      return { id: Number(ui.value), value: ui.symbol.color.toHex() }
    })
  }

  const transformFeatureSet = (campaignId: string, featureSet: FeatureSet) => {
    const features = featureSet.features.map(feat => feat.attributes)
  
    const result: ChartDataItem = { campaign: campaignId }

    // Ohne forEach
    // const feature = features[0]
    // const key = Object.keys(feature)[1]
    // const key_pt2 = feature[key] as string
    
    features.forEach(feature => {
      const key = Object.keys(feature)[1]
      const value = feature[key] as string

      result[t(`${key}_${value}`)] = feature.value
    })

    return result
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
      setData(transformed)
    })
  }

  useEffect(() => fetchData(), [lineFilter, lang])
  useEffect(() => fetchColors(), [])

  return (
    <div className="w-full h-full pt-2 pb-4 pr-3">
      {props.description && <>

        <button className='absolute info-icon top-[9px] right-[9px]' onMouseOver={() => setTextOpen(true)} onMouseOut={() => setTextOpen(false)}></button>
        {textOpen &&
          <div className="bg-sersa2 w-full h-full z-50 text-[12px] items-start justify-center text-justify mb-4 px-3">{props.description}</div>
        }
      </>
      }
      {data && colors.length > 0 &&
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

            {colors.map((col, idx) => {

              return <Area type="monotone"
                key={idx}
                dataKey={t(props.fieldName + `_${col.id}`)}
                stackId="1"
                stroke={colors.find(c => c.id === col.id).value}
                fill={colors.find(c => c.id === col.id).value}
                fillOpacity={1} />
            })}

          </AreaChart>
        </ResponsiveContainer>
      }
    </div>

  )
}
export default AppAreaChartTrend
