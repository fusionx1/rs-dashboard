import { useCallback, useEffect, useRef } from 'react'
import _ from 'lodash'

// Custom Hook for calling a throttled useEffect
// Usage: useThrottled(() => console.log('do something'), 1000, [value])
// Usage: useThrottled(function, timeout, changedValue)
export const useThrottle = (cb, delay, additionalDeps) => {
    const options = { leading: true, trailing: false } // pass custom lodash options
    const cbRef = useRef(cb)
    const throttledCb = useCallback(
      _.throttle((...args) => cbRef.current(...args), delay, options),
      [delay]
    )
    useEffect(() => {
      cbRef.current = cb
    })
    // set additionalDeps to execute effect, when other values change (not only on delay change)
    useEffect(throttledCb, [throttledCb, ...additionalDeps])
  }