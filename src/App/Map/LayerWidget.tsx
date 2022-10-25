import React, { FC, useMemo, useEffect } from 'react'
import useMapStore from '../Store/MapStore'
import useAppStore from '../Store/AppStore'
import './LayerWidget.scss'
import { useTranslation } from 'react-i18next'

const LayerWidget: FC = () => {

  const { t } = useTranslation()

  const layers = useMapStore(state => state.layers)
  const countSelected = useMemo(() => layers.filter(l => l.selected).length, [layers])
  const toggleLayer = useMapStore(state => state.toggleLayer)
  const selectedLayerInfra3d = useMapStore(state => state.selectedLayerInfra3d)
  const toggleLayerInfra3d = useMapStore(state => state.toggleLayerInfra3d)
  const activeChartFilterValues = useAppStore(state => state.activeChartFilterValues)
  const setActiveChartFilter = useAppStore(state => state.setActiveChartFilter)
  
  useEffect(() => {
    layers.map(layer => {
      activeChartFilterValues.map(filter => {
        if (layer.selected != true && layer.field === filter.fieldName || layer.year === filter.fieldName)
        setActiveChartFilter(null,null,null)
      })
    })
  }, [layers]) 

  return (
    <div>
      <div className='flex justify-between items-center h-6 pt-1.5 pb-1.5'>
      <h1 className="text-lg">{t('Layerauswahl')}</h1>
      <div className='layerWidgetMouseOver'>
        <button className='flex w-3.5 h-3.5 info-icon'></button>
            <div className='layerWidgetMouseOver-content text-[12px] items-start justify-center text-justify px-3'>
              <div>{t('Layerauswahl Description Paragraph 1')}</div>
              <div>{t('Layerauswahl Description Paragraph 2')}</div>
              <div>{t('Layerauswahl Description Paragraph 3')}</div>
            </div>
          </div>
      </div>
      { layers.map(layer => (
        <div className="flex text-xs ml-1.5" key={layer.layerId}>
          <input className='mr-1.5'
          type="checkbox"
          checked={layer.selected}
          disabled={countSelected >= 2 && !layer.selected}
          onChange={() => toggleLayer(layer.layerId)}
        />

        <label>
        {layer.selected ?
        <div>
        <input id="infra3dSelect"
          type="checkbox"
          checked={layer.layerId === selectedLayerInfra3d?.layerId}
          
          onChange={() => toggleLayerInfra3d(layer.layerId)} 
        />
        <div className='sersa-radio'></div>
        </div>
          :
          <div className='w-4'></div>
        }              
        </label>
        <p className="ml-1.5">{t(layer.title)}</p>
      </div>
      ))
      }
    </div>
  )
}

export default LayerWidget
