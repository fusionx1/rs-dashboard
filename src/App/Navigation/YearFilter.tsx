import React, { FC } from 'react'
import useAppStore from '../Store/AppStore'
import './YearFilter.scss'
import { useTranslation } from 'react-i18next'


const YearFilter: FC = () => {

    const { t } = useTranslation()

    // YearFilter is maybe not the right word, use YearChooser or better Campaign- throughout the code

    // Use the scss files for component-specific styling
    // Scope styling using nested classes (e. g. per component)
    const yearFilterValues = useAppStore(state => state.yearFilterValues)
    const select = useAppStore(state => state.setYearFilter)

    return (
        <div className='flex justify-center items-center z-50'>
        <div className='filter-menu pr-4 pt-2'>
            <div className="dropdown">
                <button className='filter-icon'></button>
                <div className='dropdown-content'>
                    {
                        yearFilterValues.map(lf =>
                            <div key={lf.id}
                                className={
                                    lf.selected
                                        ? 'selected'
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
        <div className='text-black text-sm font-bold'>{t('Messkampagne')}</div>
        </div>
    )

}

export default YearFilter