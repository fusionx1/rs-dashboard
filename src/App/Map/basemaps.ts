import WMTSLayer from '@arcgis/core/layers/WMTSLayer'
import Basemap from '@arcgis/core/Basemap'
import { t } from 'i18next'
import { EPSG } from '../Store/data'

const url = `https://wmts.geo.admin.ch/EPSG/${EPSG}/`

export const grundkarteFarbig = new Basemap({
    baseLayers: [
        new WMTSLayer({
            url: url,
            activeLayer: {
                id: 'ch.swisstopo.pixelkarte-farbe',
            },
        }),
    ],
    title: t('grundkarte farbig'),
    thumbnailUrl:
        'https://rsrg-smg.maps.arcgis.com/sharing/rest/content/items/9e9c6687b111405bbe20349f591236b5/data',
})
export const grundkarteSW = new Basemap({
    baseLayers: [
        new WMTSLayer({
            url: url,
            activeLayer: {
                id: 'ch.swisstopo.pixelkarte-grau',
            },
        }),
    ],
    title: t('grundkarte SW'),
    thumbnailUrl:
        'https://rsrg-smg.maps.arcgis.com/sharing/rest/content/items/86d78ad43bdf48408056eae89ce18778/data',
})
export const luftbild = new Basemap({
    baseLayers: [
        new WMTSLayer({
            url: url,
            activeLayer: {
                id: 'ch.swisstopo.swissimage',
            },
        }),
    ],
    title: t('luftbild'),
    thumbnailUrl:
        'https://rsrg-smg.maps.arcgis.com/sharing/rest/content/items/dc8572c592fc47c1846d65b4eecb8a17/data',
})