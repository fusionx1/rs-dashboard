import React, { FC, useEffect, useRef, useState } from 'react'
import './MapComponent.scss'
import '@arcgis/core/assets/esri/themes/dark/main.css'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import Expand from '@arcgis/core/widgets/Expand'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import { grundkarteFarbig, grundkarteSW, luftbild } from './basemaps'
import useAppStore from '../Store/AppStore'
import { cimMarkerSymbol, EPSG } from '../Store/data'
import useMapStore from '../Store/MapStore'
import Legend from '@arcgis/core/widgets/Legend'
import Graphic from '@arcgis/core/Graphic'
import CIMPointSymbol from '@arcgis/core/symbols/CIMSymbol'
import { applyCIMSymbolRotation } from '@arcgis/core/symbols/support/cimSymbolUtils'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import { useThrottle } from '../../utils'
import { useTranslation } from 'react-i18next'
import Zoom from '@arcgis/core/widgets/Zoom'
import Home from '@arcgis/core/widgets/Home'

const MapComponent: FC = () => {
    const { t, i18n } = useTranslation()
    const mapRef = useRef()
    const LegendRef = useRef()
    const [didRender, setDidRender] = useState(false)
    const lineFilters = useAppStore(state => state.lineFilterValues)
    const chartFilter = useAppStore(state => state.activeChartFilterValues)
    const yearFilter = useAppStore(state => state.yearFilterValues)
    const displayHeightInfra3d = useAppStore(state => state.displayHeight)
    const view = useRef<MapView>(null)
    const RhbFeatureLayer = useRef<FeatureLayer>(null)
    const RhbFeatureLayerOuter = useRef<FeatureLayer>(null)
    const layers = useMapStore(state => state.layers)
    const infraPosition = useMapStore(state => state.infraPosition)
    const displayInfraPosition = useMapStore(state => state.displayInfraPosition)
    const infraPositionGraphic = useRef<Graphic>(null)
    const graphicId = useRef('infra3d')
    const infraOrientation = useMapStore(state => state.infraOrientation)
    const [xDistance, setXDistance] = useState(-1) // Holds the current extent's x width in meters
    const setExtent = (extent: { xmin: number, xmax: number, ymin: number, ymax: number, spatialReference: { wkid: number } }) => useMapStore.setState(() => ({ extent: extent }))

    const [basemapExpand, setBasemapExpand] = useState<Expand>(new Expand({
        autoCollapse: true,
        expandTooltip: t('hintergrundkarte auswählen'),
        collapseTooltip: t('ausblenden'),
    }))

    const [zoomWidget, setZoomWidget] = useState<Zoom>(new Zoom())
    const [homeWidget, setHomeWidget] = useState<Home>(new Home())

    const [legendWidget, setLegendWidget] = useState(new Legend())

    const [map, setMap] = useState(
        new Map({ basemap: grundkarteFarbig })
    )

    const extent = useMapStore(state => state.extent)

    // find graphics in the view that have an id attribute set to [graphicId]
    const getInfra3dGraphics = () => {
        return view.current.graphics.toArray().filter(g => g.attributes.id == graphicId)
    }

    const getLineFilterString = () => {
        const selected = lineFilters.filter(lf => lf.selected)
        return selected.length === 0 ? '' : `Linie IN ('${selected.map(lf => lf.label).join('\',\'')}')`
    }

    const [ChartFilterValue, setChartFilterValue] = useState('')
    useEffect(() => {
        {
            chartFilter.map(filter => {
                if (filter.type === 'pie') {
                    setChartFilterValue(`${filter.fieldName} = ${filter.id}`)
                }
                else {
                    filter.id === null ? setChartFilterValue('') : setChartFilterValue(`${filter.fieldName} = '${filter.id}'`)
                }
            })
        }

    })

    useEffect(() => {
        applyLineFilter()
    }, [lineFilters, ChartFilterValue])

    const applyLineFilter = () => {
        const layers = [RhbFeatureLayer, RhbFeatureLayerOuter].filter(layer => layer.current)
        layers.forEach(layer => {
            if (view.current) {
                view.current.whenLayerView(layer.current).then(layerView => {
                    if (getLineFilterString() != '' && ChartFilterValue != '')
                        layerView.filter = {
                            where: getLineFilterString() + ' AND ' + ChartFilterValue
                        }
                    else layerView.filter = {
                        where: getLineFilterString() + ChartFilterValue
                    }
                })
            }
        })
    }


    // does a hit-test on the map click.     
    const onMapClick = event => {
        view.current.hitTest(event.screenPoint).then(result => {
            // Check if inner or outer layer has been clicked
            const fLayer = result.results.find(hitResult => ['inner', 'outer'].includes(hitResult.layer.id))
            if (fLayer) {
                useMapStore.setState({ infraPositionTarget: event.mapPoint })
            }
        })
    }

    const template = {
        title: '{Linie} ({Von} - {Bis})',
        content: [
            {
                type: 'fields',
                fieldInfos: [
                    {
                        fieldName: 'Irissys',
                        label: 'IRISSYS'
                    },
                    {
                        fieldName: 'Linie',
                        label: t('Linie')
                    },
                    {
                        fieldName: 'Gleisposition',
                        label: t('Gleisposition IRISSYS')
                    },
                    {
                        fieldName: 'Schienendatum',
                        label: t('Schienendatum'),
                        format: {
                            dateFormat: 'short-date'
                        }

                    },
                    {
                        fieldName: 'Schwellendatum',
                        label: t('Schwellendatum'),
                        format: {
                            dateFormat: 'short-date'
                        }
                    },

                ]
            }
        ]
    }

    const replaceLayers = () => {
        const selected = layers.filter(layer => layer.selected)
        if (RhbFeatureLayer.current) {
            map.remove(RhbFeatureLayer.current)
            RhbFeatureLayer.current = null
        }
        if (RhbFeatureLayerOuter.current) {
            map.remove(RhbFeatureLayerOuter.current)
            RhbFeatureLayerOuter.current = null
        }

        if (selected.length === 2) {
            RhbFeatureLayerOuter.current = new FeatureLayer({
                url: yearFilter.find(yf => yf.selected).url,
                id: 'outer',
                layerId: selected[1].layerId,
                title: t(selected[1].title),
                visible: xDistance <= 8000,
                opacity: 0.7,
            })
            map.add(RhbFeatureLayerOuter.current)
            view.current.whenLayerView(RhbFeatureLayerOuter.current).then(() => {
                const layerField = RhbFeatureLayerOuter.current.typeIdField
                RhbFeatureLayerOuter.current.renderer.uniqueValueInfos.forEach(uv => {
                    uv.symbol.width = '20px'
                    uv.label = t(layerField + '_' + uv.value)
                })
            })
        }
        if (selected.length > 0) {
            RhbFeatureLayer.current = new FeatureLayer({
                url: yearFilter.find(yf => yf.selected).url,
                id: 'inner',
                layerId: selected[0].layerId,
                title: t(selected[0].title),
                popupTemplate: template,
            })
            map.add(RhbFeatureLayer.current)
            view.current.whenLayerView(RhbFeatureLayer.current).then(() => {
                const layerField = RhbFeatureLayer.current.typeIdField
                RhbFeatureLayer.current.renderer.uniqueValueInfos.forEach(uv => {
                    uv.symbol.width = '8px'
                    uv.label = t(layerField + '_' + uv.value)
                })
            })
        }

        applyLineFilter()
    }


    // Build up view...
    useEffect(() => {
        view.current = new MapView({
            container: mapRef.current,
            map: map,
            extent: extent,
            spatialReference: { wkid: EPSG },
            popup: {
                dockEnabled: true,
                dockOptions: {
                    buttonEnabled: true,
                    breakpoint: false
                },
            }
        })

        infraPositionGraphic.current = new Graphic({
            symbol: new CIMPointSymbol({
                data: {
                    type: 'CIMSymbolReference',
                    symbol: cimMarkerSymbol
                },
            }),
            attributes: { 'id': graphicId }
        })


        legendWidget.view = view.current
        legendWidget.container = LegendRef.current

        view.current.ui.add(legendWidget, 'top-left')
        view.current.ui.move(['zoom'], 'top-right')      

        const basemapGallery = new BasemapGallery({
            view: view.current,
            source: [grundkarteFarbig, grundkarteSW, luftbild],
        })

        basemapExpand.view = view.current
        basemapExpand.content = basemapGallery

        zoomWidget.view = view.current
        zoomWidget.when(widget => {
            widget.messages.zoomIn = t('zoom-in')
            widget.messages.zoomOut = t('zoom-out')
        })

        homeWidget.view = view.current
        homeWidget.when(widget => { widget.messages.title = t('home-widget-label') })
        view.current.ui.add(homeWidget, 'top-right')

        view.current.ui.add(basemapExpand, { position: 'top-right' })

        const extentWatch = reactiveUtils.watch(
            () => view?.current?.extent,
            extent => {
                setExtent(extent)
                setXDistance(extent.xmax - extent.xmin) // Watch extent and set xDistance
            }
        )
        view.current.when(() => {
            replaceLayers()
            setDidRender(true)
            view.current.on('click', e => onMapClick(e))
        })

        return () => {
            view.current.container = null
            extentWatch.remove()
        } // destroy when component unmounts

    }, [])

    // Watch xDistance, if high (= small zoom level), hide outer layer to keep map readable
    // Watching zoom is not possible, because extents are used, zoom level is always -1
    useEffect(() => {
        if (!RhbFeatureLayerOuter.current) return
        if (xDistance > 8000) RhbFeatureLayerOuter.current.visible = false // 8 km
        else RhbFeatureLayerOuter.current.visible = true
    }, [xDistance])

    useEffect(() => { if (didRender && yearFilter) applyLineFilter() }, [lineFilters])

    useEffect(() => { if (didRender) replaceLayers() }, [layers, yearFilter])

    useEffect(() => {

        // when the infra3d widget is displayed (not collapsed), then..
        if (didRender && displayInfraPosition) {

            // set the graphic's geometry to the current coordinate of the infra3d movie
            infraPositionGraphic.current.geometry = infraPosition

            // rotate the graphic symbol according to the infra3d movie orientation
            applyCIMSymbolRotation(infraPositionGraphic.current.symbol as CIMPointSymbol, infraOrientation, true)

            //make sure that the graphic showing the infra3d position is added only 
            //once to the views graphic collection
            if (getInfra3dGraphics().length === 0) {
                view.current.when((v: MapView) => v.graphics.add(infraPositionGraphic.current))
            }
        }

        // when the infra3d component is collapsed, remove the graphic from the view
        if (!displayInfraPosition) {
            const graphics = getInfra3dGraphics()
            view.current.graphics.removeMany(graphics)
        }
    }, [infraPosition, displayInfraPosition, didRender])

    useThrottle(() => {
        if (displayInfraPosition && view.current) view.current.goTo(infraPosition)
    }, 1000, [infraPosition])

    // Translate basemap titles and layers when language changes
    useEffect(() => {
        grundkarteFarbig.title = t('grundkarte farbig')
        grundkarteSW.title = t('grundkarte SW')
        luftbild.title = t('luftbild')
        replaceLayers()
        basemapExpand.expandTooltip = t('hintergrundkarte auswählen')
        basemapExpand.collapseTooltip = t('ausblenden')
        zoomWidget.when(widget => {
            widget.messages.zoomIn = t('zoom-in')
            widget.messages.zoomOut = t('zoom-out')
        })
        homeWidget.when(widget => {
            widget.messages.title = t('home-widget-label')
            // Since the home button does not rerender when 'messages' is set, we have to hack a rerender like this
            widget.viewModel.go()
            widget.viewModel.cancelGo()
        })
            
    }, [i18n.language])

    return (
        <div
            className={`absolute left-0 right-0 top-[72px] ${displayHeightInfra3d !== 'full' ? '-bottom-4' : 'bottom-[calc(40%_-_16px)]'} w-full`}
            ref={mapRef}
        >
            <div
                className="absolute bg-sersa2 text-black top-32 w-56"
                ref={LegendRef}
            ></div>
        </div>
    )
}

export default MapComponent


