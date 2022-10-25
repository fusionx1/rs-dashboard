import React, { FC, useState } from 'react'
import './Kartenwechsel.scss'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

const Kartenwechsel: FC = () => {
  const { t } = useTranslation()

  const navigate = useNavigate()
  const location = useLocation()

  const [state, setState] = useState(location.pathname)

  const togglePage = () => {
    const otherPathname = location.pathname === '/summary' ? '/karte' : '/summary'
    navigate(otherPathname, { replace: true })
    setState(otherPathname)
  }

  return (
      <button
        className="relative button-hover w-full h-18 bg-innovitas text-black text-sm font-bold"
        onClick={togglePage}
      >
        {state === '/karte' || state === '/' ? t('summary') : t('karte')}
      </button>
  )
}

export default Kartenwechsel
