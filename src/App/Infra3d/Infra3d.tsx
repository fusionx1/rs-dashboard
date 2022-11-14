import React, { FC, useEffect, useState } from 'react'
import './Infra3d.scss'
import CollapsibleBox from '../Layout/CollapsibleBox'
import '../../assets/vendor/infra3dapi'
import useMapStore from '../Store/MapStore'
import Point from '@arcgis/core/geometry/Point'
import SpatialReference from '@arcgis/core/geometry/SpatialReference'
import { EPSG } from '../Store/data'
import useAppStore from '../Store/AppStore'

const Infra3d: FC = () => {
    const startPosition = useMapStore(state => state.infra3dStartPosition)
    const [displayHeight, setDisplayHeight] = useState('middle')
    
    const yearFilterValues = useAppStore(state => state.yearFilterValues)

    const activeLayer = useMapStore(state => state.selectedLayerInfra3d)

    const allLayers = useMapStore(state => state.allLayers)
    const infraPositionTarget = useMapStore(state => state.infraPositionTarget)

    const [infra3dInitialized, setInfra3dInitialized] = useState(false)

    const displayHeightInfra3d = useAppStore(state => state.displayHeight)
    const infra3dIsOpen = useAppStore(state => state.infra3dIsOpen)

    // updates the current infra3d movie position and the movie orientation in the mapstore.
    function positionChangedHandler(easting, northing, height, epsg, orientation, framenumber, cameraname, cameratype, date, address, campaign) {
        useMapStore.setState({
            infraPosition: new Point({
                x: easting, y: northing, spatialReference: new SpatialReference({ wkid: epsg })
            }),
            infraOrientation: orientation
        })
        const selectedYear = yearFilterValues.find(yf => yf.selected)
        if (selectedYear.infra3dCampaignName != campaign) infra3d.loadAtCampaign(selectedYear.infra3dCampaignId)
    }

    useEffect(() => {
        if (!infra3dInitialized) {
            infra3d.init('infra3d', 'https://client-v3.infra3d.ch/latest', {
                easting: startPosition[0],
                northing: startPosition[1],
                //imageKey: 'cHVibGljQG1ldGFfY2hfcmhiX2x2OTVfdjMvNzM0Ny0yNg==',
                epsg: EPSG,
                lang: 'de',
                map: false,
                layer: false,
                navigation: true,
                forcelayerreset: true,
                credentials: ['rhb_arge_dashboard', '8luvsQeA6pYqXY1nhbfj']
            }, () => {
                setInfra3dInitialized(true)
                useMapStore.setState({ displayInfraPosition: true })
                infra3d.setOnPositionChanged(positionChangedHandler, this)
            })
        }
    })

    useEffect(() => {
        const selectedYear = yearFilterValues.find(yf => yf.selected)
        infra3d.loadAtCampaign(selectedYear.infra3dCampaignId)
    }, [yearFilterValues])

    // updates the mapstore with the collapsible state of the infra3d component
    useEffect(() => {
        if (infra3dInitialized) {
            useMapStore.setState({ displayInfraPosition: infra3dIsOpen })
        }
    }, [infra3dIsOpen])


    useEffect(() => {
        if (infra3dInitialized) {
            infra3d.loadAtPosition(infraPositionTarget.x, infraPositionTarget.y)
        }
    }, [infraPositionTarget])

    useEffect(() => {
        // Hide all layers
        yearFilterValues.forEach(yf => {
            allLayers.forEach(layer => {
                infra3d.showLayer(yf.infra3dLayerName + '.' + layer.infra3dLayerId, false)
            })
        })

        // Set selected to true
        const yearName = yearFilterValues.find(yf => yf.selected).infra3dLayerName
        if (activeLayer !== null && activeLayer !== undefined) {
            const layerName = activeLayer.infra3dLayerId
            infra3d.showLayer(yearName + '.' + layerName, true)
        }
    }, [activeLayer, yearFilterValues])


    return (
        <div
            className='relative flex bg-white h-full w-full'
            id="infra3d"
        >
            {displayHeightInfra3d !== 'closed' &&
            <div className='absolute flex left-1/2 -top-3'>
                <CollapsibleBox displayHeight={displayHeight} setDisplayHeight={setDisplayHeight} Component={'Infra3d'}/>
            </div>
            }          
        </div>
    )
}

export default Infra3d

