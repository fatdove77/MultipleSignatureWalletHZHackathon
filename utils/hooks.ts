// 节流hooks
import { useRef, useCallback } from 'react'
type FnType = (...arg: any[]) => any
interface RefType {
  fn: FnType
  timer: NodeJS.Timeout | null
}
export function useThrottle(fn: FnType, delay: number, dep: any[] = []) {
  const { current } = useRef<RefType>({ fn, timer: null })
  current.fn = fn
  return useCallback((...args: any[]) => {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        current.timer = null
      }, delay)
      current.fn.apply( args)
    }
  }, dep)
}

