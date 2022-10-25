import React, { FC, useState } from 'react'
import './MapDiagrams.scss'
import CollapsibleBox from '../Layout/CollapsibleBox'
import AppPieChart from '../Charts/AppPieChart'
import useMapStore from '../Store/MapStore'
import AppBarChartYear from '../Charts/AppBarChartYear'
import { useTranslation } from 'react-i18next'
import useAppStore from '../Store/AppStore'



const MapDiagrams: FC = () => {

  const { t } = useTranslation()

  const [isOpen, setOpen] = useState(true)
  const [displayHeight, setDisplayHeight] = useState('middle')
  
  const displayHeightInfra3d = useAppStore(state => state.displayHeight)

  // Example of conditionally added className, makes the code more readable

  const layers = useMapStore(state => state.layers)
  const selected = layers.filter(layer => layer.selected)

  return (
    <div className={`relative flex bg-sersa2 ${displayHeight === 'middle' ? 'h-full w-full' : 'h-2.5 w-full'} z-0`}>

      {selected.map(layer => (

        <div className="relative flex-col flex-1 w-1/2 border-white border-x-[3px]" key={layer.layerId}>
          <div>
                <div className='flex h-9 text-lg items-center justify-center'>{t(layer.chartTitle)}</div>
            </div>
              {layer.chart === 'Pie' &&
                <div className="h-[calc(100%_-_2.25rem)]">
                  <AppPieChart fieldName={layer.field} layerId={layer.layerId} description={t(layer.chartDescription)} />
              </div>
              }
              {layer.chart === 'Bar' &&
                <div className="h-[calc(100%_-_2.25rem)]">
                  <AppBarChartYear fieldName={layer.field} yearField={layer.year} layerId={layer.layerId}/>
              </div>
              }
          </div>
      ))}
      {displayHeightInfra3d !== 'full' &&
      <div className='absolute flex left-1/2 -top-3'>
        <CollapsibleBox isOpen={isOpen} setOpen={setOpen} displayHeight={displayHeight} setDisplayHeight={setDisplayHeight} Component={'MapDiagrams'}/>
      </div>
      }
    </div>
  )
}

export default MapDiagrams
