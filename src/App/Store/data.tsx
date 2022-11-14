
// This file should contain plain stuff and not import anything (except for maybe types)
export const EPSG = 2056

// use coords in the same spatial ref as defined in globalSpatialReference
export const infra3dStartPosition = [2770869.9, 1172325.3]

export const defaultExtent = {
    xmin: 2647000,
    ymin: 1147500,
    xmax: 2882000,
    ymax: 1212500,
    spatialReference: {
        wkid: EPSG,
    },
}

export const FEAT_SERVICE_URL_RhB_2021_1 = 'https://services-eu1.arcgis.com/oT3bo8CXV1cksuST/arcgis/rest/services/RhB_2021_1/FeatureServer'
export const FEAT_SERVICE_URL_RhB_2021_2 = 'https://services-eu1.arcgis.com/oT3bo8CXV1cksuST/arcgis/rest/services/RhB_2021_2/FeatureServer'
export const FEAT_SERVICE_URL_RhB_2022_1 = 'https://services-eu1.arcgis.com/oT3bo8CXV1cksuST/arcgis/rest/services/RhB_2022_1/FeatureServer'
export const FEAT_SERVICE_URL_RhB_2022_2 = 'https://services-eu1.arcgis.com/oT3bo8CXV1cksuST/arcgis/rest/services/RhB_2022_2/FeatureServer'

export const yearFilterConfig = [
    { id: 0, label: '2021-1', selected: false, url: FEAT_SERVICE_URL_RhB_2021_1, infra3dCampaignId: 4, infra3dCampaignName: 'Mai 2021', infra3dLayerName: 'RhB_2021_1' },
    { id: 1, label: '2021-2', selected: false, url: FEAT_SERVICE_URL_RhB_2021_2, infra3dCampaignId: 4, infra3dCampaignName: 'Mai 2021', infra3dLayerName: 'RhB_2021_2' },
    { id: 2, label: '2022-1', selected: false, url: FEAT_SERVICE_URL_RhB_2022_1, infra3dCampaignId: 5, infra3dCampaignName: 'Mai 2022', infra3dLayerName: 'RhB_2022_1' },
    { id: 3, label: '2022-2', selected: true, url: FEAT_SERVICE_URL_RhB_2022_2, infra3dCampaignId: 5, infra3dCampaignName: 'Mai 2022', infra3dLayerName: 'RhB_2022_2' }
]
export interface AppLayer {
    layerId: number,
    title: string,
    field: string,
    infra3dLayerId: string,
    selected?: boolean,
    chart: string,
    year: string,
    chartTitle: string,
    chartDescription: string,
}

export const cimMarkerSymbol = {
    'type': 'CIMPointSymbol',
    'symbolLayers': [
        {
            'type': 'CIMVectorMarker',
            'enable': true,
            'anchorPoint': {
                'x': 0,
                'y': 0
            },
            'anchorPointUnits': 'Absolute',
            'dominantSizeAxis3D': 'Y',
            'size': 10,
            'billboardMode3D': 'FaceNearPlane',
            'frame': {
                'xmin': 0,
                'ymin': 0,
                'xmax': 17,
                'ymax': 17
            },
            'markerGraphics': [
                {
                    'type': 'CIMMarkerGraphic',
                    'geometry': {
                        'rings': [
                            [
                                [
                                    8.5,
                                    0
                                ],
                                [
                                    7.02,
                                    0.13
                                ],
                                [
                                    5.59,
                                    0.51
                                ],
                                [
                                    4.25,
                                    1.14
                                ],
                                [
                                    3.04,
                                    1.99
                                ],
                                [
                                    1.99,
                                    3.04
                                ],
                                [
                                    1.14,
                                    4.25
                                ],
                                [
                                    0.51,
                                    5.59
                                ],
                                [
                                    0.13,
                                    7.02
                                ],
                                [
                                    0,
                                    8.5
                                ],
                                [
                                    0.13,
                                    9.98
                                ],
                                [
                                    0.51,
                                    11.41
                                ],
                                [
                                    1.14,
                                    12.75
                                ],
                                [
                                    1.99,
                                    13.96
                                ],
                                [
                                    3.04,
                                    15.01
                                ],
                                [
                                    4.25,
                                    15.86
                                ],
                                [
                                    5.59,
                                    16.49
                                ],
                                [
                                    7.02,
                                    16.87
                                ],
                                [
                                    8.5,
                                    17
                                ],
                                [
                                    9.98,
                                    16.87
                                ],
                                [
                                    11.41,
                                    16.49
                                ],
                                [
                                    12.75,
                                    15.86
                                ],
                                [
                                    13.96,
                                    15.01
                                ],
                                [
                                    15.01,
                                    13.96
                                ],
                                [
                                    15.86,
                                    12.75
                                ],
                                [
                                    16.49,
                                    11.41
                                ],
                                [
                                    16.87,
                                    9.98
                                ],
                                [
                                    17,
                                    8.5
                                ],
                                [
                                    16.87,
                                    7.02
                                ],
                                [
                                    16.49,
                                    5.59
                                ],
                                [
                                    15.86,
                                    4.25
                                ],
                                [
                                    15.01,
                                    3.04
                                ],
                                [
                                    13.96,
                                    1.99
                                ],
                                [
                                    12.75,
                                    1.14
                                ],
                                [
                                    11.41,
                                    0.51
                                ],
                                [
                                    9.98,
                                    0.13
                                ],
                                [
                                    8.5,
                                    0
                                ]
                            ]
                        ]
                    },
                    'symbol': {
                        'type': 'CIMPolygonSymbol',
                        'symbolLayers': [
                            {
                                'type': 'CIMSolidStroke',
                                'enable': true,
                                'capStyle': 'Round',
                                'joinStyle': 'Round',
                                'lineStyle3D': 'Strip',
                                'miterLimit': 10,
                                'width': 2,
                                'color': [
                                    255,
                                    255,
                                    255,
                                    255
                                ]
                            },
                            {
                                'type': 'CIMSolidFill',
                                'enable': true,
                                'color': [
                                    255,
                                    0,
                                    0,
                                    255
                                ]
                            }
                        ]
                    }
                }
            ],
            'scaleSymbolsProportionally': true,
            'respectFrame': true,
            'rotateClockwise': true,
            'rotation': 20
        },
        {
            'type': 'CIMVectorMarker',
            'enable': true,
            'anchorPointUnits': 'Absolute',
            'dominantSizeAxis3D': 'Y',
            'size': 10,
            'billboardMode3D': 'FaceNearPlane',
            'frame': {
                'xmin': 0,
                'ymin': 0,
                'xmax': 17,
                'ymax': 17
            },
            'markerGraphics': [
                {
                    'type': 'CIMMarkerGraphic',
                    'geometry': {
                        'rings': [
                            [
                                [
                                    0,
                                    0.65
                                ],
                                [
                                    8.5,
                                    16.35
                                ],
                                [
                                    17,
                                    0.65
                                ],
                                [
                                    0,
                                    0.65
                                ]
                            ]
                        ]
                    },
                    'symbol': {
                        'type': 'CIMPolygonSymbol',
                        'symbolLayers': [
                            {
                                'type': 'CIMSolidStroke',
                                'enable': true,
                                'capStyle': 'Round',
                                'joinStyle': 'Round',
                                'lineStyle3D': 'Strip',
                                'miterLimit': 10,
                                'width': 1,
                                'color': [
                                    255,
                                    255,
                                    255,
                                    255
                                ]
                            },
                            {
                                'type': 'CIMSolidFill',
                                'enable': true,
                                'color': [
                                    255,
                                    0,
                                    0,
                                    255
                                ]
                            }
                        ]
                    }
                }
            ],
            'scaleSymbolsProportionally': true,
            'respectFrame': true,
            'offsetX': 0,
            'offsetY': 0,
            'anchorPoint': {
                'x': 0,
                'y': -8
            },
            'rotateClockwise': true,
            'rotation': 0
        }
    ]
}

// All layers with properties
export const appLayers: AppLayer[] = [
    {
        layerId: 0,
        title: 'Gleislage Unruhe',
        field: 'TUG_TQI_ID',
        infra3dLayerId: '0',
        chart: 'Pie',
        year: '',
        chartTitle: 'Gleislage Unruhe',
        chartDescription: 'Gleislage Unruhe Description',
    },
    {
        layerId: 1,
        title: 'Schwellentyp',
        field: 'Schwellentyp_ID',
        infra3dLayerId: '1',
        chart: 'Bar',
        year: 'Schwellenjahrgang',
        chartTitle: 'Schwellentyp',
        chartDescription: '',
    },
    {
        layerId: 2,
        title: 'Schienentyp',
        field: 'Schienentyp_ID',
        infra3dLayerId: '2',
        chart: 'Bar',
        year: 'Schienenjahrgang',
        chartTitle: 'Schienentyp',
        chartDescription: '',
    },
    {
        layerId: 3,
        title: 'Restlebensdauer',
        field: 'Restlebensdauer_ID',
        infra3dLayerId: '3',
        chart: 'Pie',
        year: '',
        chartTitle: 'Restlebensdauer',
        chartDescription: 'Restlebensdauer Description',
    },
    {
        layerId: 4,
        title: 'Qualitätsnote Einzelfehler',
        field: 'Qualitaetsnote_ID',
        infra3dLayerId: '4',
        chart: 'Pie',
        year: '',
        chartTitle: 'Qualitätsnote Einzelfehler',
        chartDescription: 'Qualitätsnote Einzelfehler Description',
    },

    {
        layerId: 5,
        title: 'Netzzustand Fahrbahn',
        field: 'Netzzustand_Fahrbahn_ID',
        infra3dLayerId: '5',
        chart: 'Pie',
        year: '',
        chartTitle: 'Netzzustand Fahrbahn',
        chartDescription: 'Netzzustand Fahrbahn Description',
    },
    {
        layerId: 6,
        title: 'Belastungsgruppe',
        field: 'Belastungsgruppe_ID',
        infra3dLayerId: '6',
        chart: 'Pie',
        year: '',
        chartTitle: 'Belastungsgruppe',
        chartDescription: '',
    },
]

// Layers per map topic
export const layersGleislage: AppLayer[] = [
    {
       ...appLayers.find(al => al.field === 'TUG_TQI_ID'),
        selected: true,
    },
    {
       ...appLayers.find(al => al.field === 'Qualitaetsnote_ID'),
       selected: false
    },
    {
       ...appLayers.find(al => al.field === 'Schienentyp_ID'),
       selected: false
    },
    {
       ...appLayers.find(al => al.field === 'Schwellentyp_ID'),
       selected: false
    },
    {
       ...appLayers.find(al => al.field === 'Belastungsgruppe_ID'),
       selected: false
    },
]

export const layersSchiene: AppLayer[] = [ 
    {
        ...appLayers.find(al => al.field === 'Schienentyp_ID'),
        selected: true
     }, 
    {
        ...appLayers.find(al => al.field === 'Schwellentyp_ID'),
        selected: false
     }, 
    {
        ...appLayers.find(al => al.field === 'Belastungsgruppe_ID'),
        selected: false
     },
]
export const layersNetzzustand: AppLayer[] = [
    {
        ...appLayers.find(al => al.field === 'Netzzustand_Fahrbahn_ID'),
        selected: true
     },
    {
        ...appLayers.find(al => al.field === 'Restlebensdauer_ID'),
        selected: false
     },
    {
        ...appLayers.find(al => al.field === 'Schienentyp_ID'),
        selected: false
     },
    {
        ...appLayers.find(al => al.field === 'Schwellentyp_ID'),
        selected: false
     },
    {
        ...appLayers.find(al => al.field === 'Belastungsgruppe_ID'),
        selected: false
     },
]