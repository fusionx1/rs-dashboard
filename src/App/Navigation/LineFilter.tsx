import React, { FC } from 'react'
import useAppStore from '../Store/AppStore'
import './LineFilter.scss'

import { useTranslation } from 'react-i18next'

const FilterMenu: FC = () => {

    const { t } = useTranslation()

    const lineFilterValues = useAppStore(state => state.lineFilterValues)
    const select = useAppStore(state => state.toggleLineFilter)

    return (
        <div className='flex justify-center items-center'>
        <div className='filter-menu pr-4 pt-2'>
            <div className="dropdown">
                <button className='filter-icon'></button>
                <div className='dropdown-content'>
                    {
                        lineFilterValues.map(lf =>
                            <div key={lf.id}
                                className={
                                    lf.selected
                                        ? 'dropdwon-item selected'
                                        : 'dropdown-item'
                                }
                                onClick={() => select(lf.id)}
                            >
                                {lf.label}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
        <div className='text-black text-sm font-bold'>{t('Linie')}</div>
        </div>
    )

}

export default FilterMenu