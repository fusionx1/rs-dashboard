import React, { FC } from 'react'
import './Sprachwechsel.scss'
import useAppStore from '../Store/AppStore'

const Sprachwechsel: FC = () => {
  const setLang = useAppStore(state => state.setLang)
  const lang = useAppStore(state => state.activeLanguage)
  const appLangs = useAppStore(state => state.appLangs)

  return (
    <div className="flex sprachwechsel z-50">
      {
        appLangs.map(appLang =>
          <span
            key={appLang}
            className={
              lang === appLang
                ? 'text-sersa text-sm underline underline-offset-2'
                : ''
            }
          >
            <a
              className="flex px-1.5 text-sm hover:underline hover:underline-offset-2"
              onClick={() => setLang(appLang)}
            >
              {appLang.toUpperCase()}
            </a>
          </span>
        )}
    </div>
  )
}

export default Sprachwechsel
