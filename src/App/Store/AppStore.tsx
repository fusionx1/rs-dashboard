import i18n from '../../i18n'
import create from 'zustand'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import uniqueValues from '@arcgis/core/smartMapping/statistics/uniqueValues'
import { yearFilterConfig } from './data'
import * as intl from '@arcgis/core/intl'

type AppLang = 'de' | 'en'
interface YearFilter {
    id: number,
    label: string,
    selected: boolean,
    url: string,
    infra3dCampaignId: number,
    infra3dCampaignName: string
}
interface AppStore {
    appLangs: AppLang[],
    activeLanguage: AppLang,
    setLang: (lang: AppLang) => void,
    lineFilterValues: Array<{ id: number, label: string, selected: boolean }>,
    toggleLineFilter: (lineFilter: number) => void,
    fetchLineFilters: () => void,
    yearFilterValues: YearFilter[],
    setYearFilter: (id: number) => void,
    activeChartFilterValues: Array<{id: number, fieldName: string, type: string}>,
    setActiveChartFilter: (id: number, fieldName: string, type: string) => void,
    displayHeight: string,
    setDisplayHeight: (height: string) => void,
}

const getUniqueValues = (field: string, layerUrl: string) => {
    const layer = new FeatureLayer({ url: layerUrl })
    return uniqueValues({ layer: layer, field: field })
        .then(response => response.uniqueValueInfos)
}


const useAppStore = create<AppStore>((set, get) => ({
    appLangs: ['de', 'en'], // All supported languages
    activeLanguage: null,
    setLang: (lang: AppLang) => {
        set(() => ({ activeLanguage: lang }))
        i18n.changeLanguage(get().activeLanguage)
        intl.setLocale(lang)
    },
    lineFilterValues: [],
    toggleLineFilter: (lineFilter) => {
        const result = get().lineFilterValues.map(l => {
            if (l.id === lineFilter) l.selected = !l.selected
            return l
        })
        set(() => ({ lineFilterValues: result }))
    },
    fetchLineFilters: () => {
        const layerUrl = get().yearFilterValues.find(yf => yf.selected).url
        getUniqueValues('Linie', layerUrl)
            .then(res => {
                const lineFilterValues = res.map((info, index) => {
                    return { id: index, label: info.value, selected: false }
                }) as Array<{ id: number, label: string, selected: boolean }>
                set(() => ({ lineFilterValues: lineFilterValues }))
            })
    },
    yearFilterValues: [],
    setYearFilter: (id) => {
        const result = get().yearFilterValues.map(yearFilter => {
            yearFilter.selected = yearFilter.id === id
            return yearFilter
        })
        set(() => ({ yearFilterValues: result }))
        get().fetchLineFilters()
    },
    activeChartFilterValues: [{id: null, fieldName: null, type: null}],
    setActiveChartFilter: (id, fieldName, type) => {
        const result = get().activeChartFilterValues.map(filter => {
            filter.id = id
            filter.fieldName = fieldName
            filter.type = type
            return filter
        })
        set(() => ({activeChartFilterValues: result}))     
    },
    displayHeight: 'middle',
    setDisplayHeight: (height) => {
        set(() => ({displayHeight: height}))
    },
    
}))

// set language
let lang = i18n.language.slice(0, 2) as AppLang
if (!useAppStore.getState().appLangs.includes(lang)) lang = 'de'
useAppStore.getState().setLang(lang)

// fetch filters on init
useAppStore.setState(() => ({ yearFilterValues: yearFilterConfig }))
useAppStore.getState().fetchLineFilters()


export default useAppStore