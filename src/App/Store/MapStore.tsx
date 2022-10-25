import { layer } from 'esri/views/3d/support/LayerPerformanceInfo'
import create from 'zustand'
import { AppLayer, layersGleislage, layersNetzzustand, layersSchiene, infra3dStartPosition, defaultExtent, appLayers } from './data'


interface MapTopic {
    id: number,
    title: string,
    active: boolean,
    layers: AppLayer[]
}

interface MapStore {
    mapTopics: MapTopic[],
    selectMapTopic: (id: number) => void,
    layers: AppLayer[],
    allLayers: AppLayer[],
    selectedLayerInfra3d: AppLayer,
    toggleLayerInfra3d: (id: number) => void,
    toggleLayer: (id: number) => void,
    infraPosition: __esri.Point,
    infraPositionTarget: __esri.Point
    displayInfraPosition: boolean,
    infra3dStartPosition: Array<number>,
    extent: {xmin: number, xmax: number, ymin: number, ymax: number, spatialReference: { wkid: number }},
    infraOrientation: number
}

const useMapStore = create<MapStore>((set, get) => ({
    mapTopics: [
        { id: 0, title: 'Gleislage', active: true, layers: layersGleislage },
        // { id: 1, title: 'Schiene', active: false, layers: layersSchiene },
        { id: 2, title: 'Netzzustand Fahrbahn', active: false, layers: layersNetzzustand },
    ],
    selectMapTopic: (id) => {
        const result = get().mapTopics.map(topic => {
            topic.active = topic.id === id
            return topic
        })
        set(() => ({ selectedLayerInfra3d: null }))
        set(() => ({ layers: result.find(mt => mt.active).layers })) // Set layers for topic
        set(() => ({ mapTopics: result }))

        // get().selectLayerInfra3d(result.find(topic => topic.active).layers[0].layerId) // Select first as Infra3d Layer
    },
    layers: layersGleislage,
    allLayers: appLayers,
    selectedLayerInfra3d: null,
    toggleLayerInfra3d: (id) => {

        if (get().selectedLayerInfra3d?.layerId === id) set(() => ({ selectedLayerInfra3d: null }))

        else set(() => ({ selectedLayerInfra3d: appLayers.find(layer => layer.layerId === id) }))
    },
    toggleLayer: (id) => {
        const result = get().layers.map(l => {
            if (l.layerId === id) l.selected = !l.selected
            
            return l 
        })

        // If turning off the layer that is shown in infra3d, remove layer from infra 3d
        const layer = get().layers.find(l => l.layerId === id)
        if (!layer.selected && layer.layerId === get().selectedLayerInfra3d?.layerId) get().toggleLayerInfra3d(null)
        set(() => ({ layers: result }))
    },
    infraPosition: null, // Coordinate actually shown on the map
    infraPositionTarget: null, // Will not be displayed, just an input coordinate for Infra3d
    displayInfraPosition: false,
    infra3dStartPosition: infra3dStartPosition,
    extent: defaultExtent,
    infraOrientation: 0
}))

export default useMapStore