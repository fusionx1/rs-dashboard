import React, { FC } from 'react'
import useMapStore from '../Store/MapStore'
import './MapTopicWidget.scss'
import { useTranslation } from 'react-i18next'

const MapTopicWidget: FC = () => {
    
    const { t } = useTranslation()

    const topics = useMapStore((state) => state.mapTopics)
    const select = useMapStore((state) => state.selectMapTopic)

    return (<div className='relative flex right-[200px] justify-center items-center map-topic-widget'>
        {topics.map(topic => {
            return (
                <span key={topic.id} className={topic.active ? 'topic-active' : 'topic'} onClick={() => select(topic.id)}>
                    {t(topic.title)}
                </span>
            )
        })}
    </div>)
}

export default MapTopicWidget

