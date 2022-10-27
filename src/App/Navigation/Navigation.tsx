import React, { FC } from 'react'
import ArgeLogo from '../../assets/ArgeLogo.png'
import { useTranslation } from 'react-i18next'
import Kartenwechsel from './Kartenwechsel'
import Sprachwechsel from './Sprachwechsel'
import FilterMenu from './LineFilter'
import YearFilter from './YearFilter'
import useAppStore from '../Store/AppStore'
import './Navigation.scss' 

// Logos should not change height-width ratio

const Navigation: FC = () => {
  const { t } = useTranslation()
  const hasYearFilters = useAppStore(state => state.yearFilterValues.length > 0)
  const hasLineFilters = useAppStore(state => state.lineFilterValues.length > 0)

  return (
    <header className="flex bg-white h-[72px] text-black fixed top-0 left-0 right-0 z-50 absolute">
      <div className="w-18 h-18 border-t-[72px] border-t-sersa  border-r-[28.5px] border-r-white"></div>
      <div className="flex w-[60rem]">
      <div className="flex ml-10 items-center">
        <a href="https://www.fahrwegdiagnose.ch/" target="_blank">
          <img src={ArgeLogo} className="h-10 cursor-pointer" />
        </a>
        <h1 className="text-2xl ml-6">{t('title')}</h1>
      </div>
      </div>
      <div className='flex flex-1 items-center'>
        <div className='relative diagonal flex h-full basis-1/4 items-center justify-center'>
          <Sprachwechsel />
        </div>
        <div className='relative diagonal flex h-full basis-1/4 items-center justify-center'>
          { hasLineFilters &&
          <FilterMenu></FilterMenu>
          }
        </div>
        
        <div className='relative triangle flex h-full basis-1/4 items-center justify-center'>
        { hasYearFilters &&
          <YearFilter></YearFilter>
        }
        </div>
        
        <div className='flex h-full basis-1/4'>
          <Kartenwechsel />
        </div>
      </div>
      
    </header>
  )
}


export default Navigation
