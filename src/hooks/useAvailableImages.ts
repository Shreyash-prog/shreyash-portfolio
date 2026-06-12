import { useEffect, useState } from 'react'

/**
 * Probes each candidate image path and returns only those that actually load.
 * Lets the UI tolerate screenshots the owner hasn't added yet — missing slots
 * are simply hidden rather than rendering broken-image icons.
 */
export function useAvailableImages(sources: string[] | undefined): string[] {
  const [available, setAvailable] = useState<string[]>([])

  useEffect(() => {
    if (!sources || sources.length === 0) {
      setAvailable([])
      return
    }

    let cancelled = false
    const results = new Array<string | null>(sources.length).fill(null)
    let remaining = sources.length

    const settle = () => {
      if (cancelled) return
      remaining -= 1
      if (remaining === 0) {
        setAvailable(results.filter((s): s is string => s !== null))
      }
    }

    sources.forEach((src, i) => {
      const img = new Image()
      img.onload = () => {
        results[i] = src // preserve original order
        settle()
      }
      img.onerror = settle
      img.src = src
    })

    return () => {
      cancelled = true
    }
  }, [sources])

  return available
}
