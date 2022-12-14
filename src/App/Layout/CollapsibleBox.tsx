import React, { FC } from 'react'
import './CollapsibleBox.scss'
import useAppStore from '../Store/AppStore'


interface CollapsibleBoxProps {
  Component: string,
  displayHeight: string,
  setDisplayHeight: (height: string) => void
}

// This is basically just the button, not the box
const CollapsibleBox: FC<CollapsibleBoxProps> = (props) => {

  const setDisplayHeight = useAppStore(state => state.setDisplayHeight)
  const infra3dIsOpen = useAppStore(state => state.infra3dIsOpen)
  const setInfra3dIsOpen = useAppStore(state => state.setInfra3dIsOpen)

  const increaseButton = <button
      className="relative right-6 w-9 mx-1.5 text-center text-xs rounded-full ring ring-black ring-1 bg-white z-50"
      onClick={() => {
      if (props.displayHeight === 'closed')
      {props.setDisplayHeight('middle'); setDisplayHeight('middle'); setInfra3dIsOpen(!infra3dIsOpen)} 
      else 
      {props.setDisplayHeight('full'); setDisplayHeight('full')}}}
    >
      +
    </button>

  const decreaseButton = <button
      className="relative right-6 w-9 mx-1.5 text-center text-xs rounded-full ring ring-black ring-1 bg-white z-50" 
      onClick={() => {
      if (props.displayHeight === 'full') 
      {props.setDisplayHeight('middle'); setDisplayHeight('middle')} 
      else 
      {props.setDisplayHeight('closed'); setDisplayHeight('closed'); setInfra3dIsOpen(!infra3dIsOpen)}}}
    >
      -
    </button>
  
  let buttonIncrease
  let buttonDecrease

  if (props.Component === 'Map') {
  if (props.displayHeight === 'closed')
      buttonIncrease = increaseButton
  if (props.displayHeight === 'middle')
      buttonDecrease = decreaseButton
  
    }

  else {
  if (props.displayHeight === 'middle')
      buttonIncrease = increaseButton
  if (props.displayHeight === 'full')
      buttonDecrease = decreaseButton
    }

  return (
    <div>
      {buttonIncrease}
      {buttonDecrease}
    </div>
  )
}

export default CollapsibleBox