import { useEffect, useRef, useState } from 'react'

export function useLastInteractionMinHeight(interactionsLength: number, margin = 32) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [minHeight, setMinHeight] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const handleResize = () => {
      setMinHeight(containerRef.current!.clientHeight)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [interactionsLength, margin])

  return { containerRef, minHeight }
}