import React, { FC, useState } from 'react'
import MapDiagrams from '../../Diagrams/MapDiagrams'
import Infra3d from '../../Infra3d/Infra3d'
import MapTopicWidget from '../../Map/MapTopicWidget'
import MapComponent from '../../Map/MapComponent'
import './Karte.scss'
import LayerWidget from '../../Map/LayerWidget'
import useAppStore from '../../Store/AppStore'
import CollapsibleBox from '../../Layout/CollapsibleBox'

// I'd strongly advise to set the visibility of Infra3d and MapDiagrams in this Component.
// The Infra3d-Widget can be hidden altogether
const Karte: FC = () => {

  const [isOpen, setOpen] = useState(true)
  const [displayHeight, setDisplayHeight] = useState('middle')

  const displayHeightInfra3d = useAppStore(state => state.displayHeight)

  return (
    <div className="flex items-end top-[72px] bottom-0 h-full">
      <div>
        <MapComponent />
      </div>
      <div className="absolute w-56 h-[7rem] bg-sersa2 top-[5.5rem] left-4 px-1.5 pt-0.5 box-shadow">
        <LayerWidget />
      </div>
      <div className='absolute top-[5.5rem] left-1/2'>
        <MapTopicWidget />
      </div>
      <div className={`relative flex ${displayHeight === 'middle' ? 'h-1/2 w-full' : 'h-2.5 w-full'} items-end`}>
        <div className={`flex ${displayHeightInfra3d === 'full' ? 'w-2/5 h-4/5' : 'w-1/2 h-4/5'} items-end justify-start`}>
          <MapDiagrams />
        </div>
        <div className={`flex ${displayHeightInfra3d === 'full' ? 'w-3/5 h-full' : 'w-1/2 h-4/5'} items-end justify-end`}>
          <Infra3d />
        </div>
        {displayHeightInfra3d !== 'full' &&
        <div className={`absolute flex left-1/2 ${displayHeight === 'middle' ? 'top-[calc(20%_-_0.75rem)]' : '-top-3'}`}>
          <CollapsibleBox isOpen={isOpen} setOpen={setOpen} displayHeight={displayHeight} setDisplayHeight={setDisplayHeight} Component={'Map'}/>
        </div>
        }
      </div>
    </div>
  )
}

export default Karte
