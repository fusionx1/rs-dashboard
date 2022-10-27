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
        'https://fwd-rhb.maps.arcgis.com/sharing/rest/content/items/b89e5ef56de04a839fe3de99e0833c39/data',
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
        'https://fwd-rhb.maps.arcgis.com/sharing/rest/content/items/0e093906ef5f42a288f311ba78b3b26a/data',
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
        'https://fwd-rhb.maps.arcgis.com/sharing/rest/content/items/a5f32e5c51cd4a89850055f1083c7e22/data',
})