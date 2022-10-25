import React, { FC, useState } from 'react'
import AppBarChartLine from '../../Charts/AppBarChartLine'
import AppBarChartYear from '../../Charts/AppBarChartYear'
import AppStackedAreaChart from '../../Charts/AppStackedAreaChart'
import AppPieChart from '../../Charts/AppPieChart'
import './Summary.scss'
import { useTranslation } from 'react-i18next'
import AppStackedAreaChart2 from '../../Charts/AppStackedAreaChart2'

// All the texts can be added to the translation files

// Summary and Karte dont need to be in a folder
// Names can be enhanced by using e. g. "SummaryPage" and "MapPage"

const Summary: FC = () => {

  const { t } = useTranslation()

  const [isHovering, setIsHovering] = useState(false)

  const handleMouseOver = () => {
    setIsHovering(true)
  }

  const handleMouseOut = () => {
    setIsHovering(false)
  }
  
  return (
    <div className="absolute left-0 right-0 top-[72px] w-full h-[calc(100%_-_4.5rem)] overflow-auto overflow-x-hidden">
      <div className="flex-col h-full">
        <div className="flex h-1/2">
          <div className="flex-col w-1/2 bg-sersa2 border-white border-r-[3px] border-b-[3px]">
          <div className="flex-col h-9">
              <div className='flex justify-between'>
                <div className='flex h-9 w-9'></div>
                <div className='flex h-9 text-lg items-center justify-center'>{t('Trend Netzzustand Fahrbahn')}</div>
                <div className='flex h-9 w-9 items-center justify-center'>
                  <button className='info-icon' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}></button>                
                </div>
              </div>
             </div>
            <div className="h-[calc(100%_-_2.25rem)]">
              <AppStackedAreaChart fieldName='TUG_TQI_ID'/>
              {isHovering &&
              <div className='relative top-[-100%] bg-sersa2 w-full h-full z-50 text-[12px] items-start justify-center text-justify pt-2 px-3'>{t('Trend Netzzustand Fahrbahn Description')}</div>
            }
            </div>
          </div>
          <div className="relative flex-col w-1/4 bg-sersa2 border-white border-x-[3px] border-b-[3px]">
            <div className="flex-col h-9">
              <div className='flex justify-between'>
                <div className='flex h-9 w-9'></div>
                <div className='flex h-9 text-lg items-center justify-center'>{t('Qualitätsnote Einzelfehler')}</div>
                <div className='flex h-9 w-9 items-center justify-center'>
                  {/*<button className='info-icon'></button>*/}
                </div>
              </div>
            </div>
            <div className="h-[calc(100%_-_2.25rem)]">
              <AppPieChart fieldName='Qualitaetsnote_ID' layerId={4} description={t('Qualitätsnote Einzelfehler Description')}/>
              </div>
          </div>
          <div className="relative flex-col w-1/4 bg-sersa2 border-white border-l-[3px] border-b-[3px]">
            <div className="flex-col h-9">
            <div className='flex justify-between'>
              <div className='flex h-9 w-9'></div>
              <div className='flex h-9 text-lg items-center justify-center'>{t('Gleislage Unruhe')}</div>
              <div className='flex h-9 w-9 items-center justify-center'>
                {/*<button className='info-icon'></button>*/}               
              </div>
            </div>
            </div>
            <div className="h-[calc(100%_-_2.25rem)]">
              <AppPieChart fieldName='TUG_TQI_ID' layerId={0} description={t('Gleislage Unruhe Description')}/>
            </div>
          </div>
        </div>


        <div className="flex h-1/2">
          <div className="flex-col w-1/4 bg-sersa2 border-white border-[3px]">
          <div className="flex h-9 text-lg items-center justify-center">
              {t('Schienentyp')}
              </div>
            <div className="h-[calc(100%_-_2.25rem)]">
              <AppBarChartYear fieldName='Schienentyp_ID' yearField='Schienenjahrgang' layerId={2} />
            </div>
          </div>
          <div className="flex-col w-1/4 bg-sersa2 border-white border-[3px]">
          <div className="flex h-9 text-lg items-center justify-center">
              {t('Schwellentyp')}
              </div>
            <div className="h-[calc(100%_-_2.25rem)]">
              <AppBarChartYear fieldName='Schwellentyp_ID' yearField='Schwellenjahrgang' layerId={1} />
            </div>
          </div>
          <div className="relative flex-col w-1/4 bg-sersa2 border-white border-[3px]">
          <div className="flex-col h-9">
              <div className='flex justify-between'>
              <div className='flex h-9 w-9'></div>
              <div className='flex h-9 text-lg items-center justify-center'>{t('Netzzustand Fahrbahn')}</div>
              <div className='flex h-9 w-9 items-center justify-center'>
                  {/*<button className='info-icon'></button>*/}
              </div>
              </div>
              </div>
            <div className="h-[calc(100%_-_2.25rem)]">
              <AppPieChart fieldName='Netzzustand_Fahrbahn_ID' layerId={5} description={t('Netzzustand Fahrbahn Description')}/>
           </div>
          </div>
          <div className="relative flex-col w-1/4 bg-sersa2 border-white border-[3px]">
          <div className="flex-col h-9">
              <div className='flex justify-between'>
                <div className='flex h-9 w-9'></div>
                <div className='flex h-9 text-lg items-center justify-center'>{t('Restlebensdauer')}</div>
                  <div className='flex h-9 w-9 items-center justify-center'>
                    {/*<button className='info-icon'></button>*/}
                  </div>
              </div>
              </div>
            <div className="h-[calc(100%_-_2.25rem)]">
              <AppPieChart fieldName='Restlebensdauer_ID' layerId={3} description={t('Restlebensdauer Description')}/>
            </div>
          </div>
        </div>


        <div className="flex h-1/2">
          <div className="relative flex-col w-1/3 bg-sersa2 border-white border-[3px]">
          <div className="flex-col h-9">
              <div className='flex justify-between'>
              <div className='flex h-9 w-9'></div>
              <div className='flex h-9 text-lg items-center justify-center'>{t('Gleislage Unruhe pro Linie')}</div>
              <div className='flex h-9 w-9 items-center justify-center'>
              </div>
              </div>
            </div>
            <div className="h-[calc(100%_-_2.25rem)]">
            <AppBarChartLine fieldName='TUG_TQI_ID' layerId={0} lineField='Linie' description={t('Gleislage Unruhe pro Linie Description')}/>
           </div>
          </div>
          <div className="relative flex-col w-1/3 bg-sersa2 border-white border-[3px]">
          <div className="flex-col h-9">
              <div className='flex justify-between'>
              <div className='flex h-9 w-9'></div>
              <div className='flex h-9 text-lg items-center justify-center'>{t('Qualitätsnote Einzelfehler pro Linie')}</div>
              <div className='flex h-9 w-9 items-center justify-center'>
              </div>
              </div>
            </div>
            <div className="h-[calc(100%_-_2.25rem)]">
            <AppBarChartLine fieldName='Qualitaetsnote_ID' layerId={4} lineField='Linie' description={t('Qualitätsnote Einzelfehler pro Linie Description')}/>
           </div>
          </div>
          <div className="relative flex-col w-1/3 bg-sersa2 border-white border-[3px]">
          <div className="flex-col h-9">
              <div className='flex justify-between'>
              <div className='flex h-9 w-9'></div>
              <div className='flex h-9 text-lg items-center justify-center'>{t('Netzzustand Fahrbahn pro Linie')}</div>
              <div className='flex h-9 w-9 items-center justify-center'>
              </div>
              </div>
            </div>
            <div className="h-[calc(100%_-_2.25rem)]">
            <AppBarChartLine fieldName='Netzzustand_Fahrbahn_ID' layerId={5} lineField='Linie' description={t('Netzzustand Fahrbahn pro Linie Description')}/>
           </div>
          </div>
        </div>
        <div className="flex h-1/2">
          <div className="relative flex-col w-1/3 bg-sersa2 border-white border-[3px]">
          <div className="flex-col h-9">
              <div className='flex justify-between'>
              <div className='flex h-9 w-9'></div>
              <div className='flex h-9 text-lg items-center justify-center'>{t('Trend Netzzustand Fahrbahn')}</div>
              <div className='flex h-9 w-9 items-center justify-center'>
              </div>
              </div>
            </div>
            <div className="h-[calc(100%_-_2.25rem)]">
            <AppStackedAreaChart2 fieldName='Netzzustand_Fahrbahn_ID' layerId={5} campaign='Messkampagne' description={t('Gleislage Unruhe pro Linie Description')}/>
           </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Summary
