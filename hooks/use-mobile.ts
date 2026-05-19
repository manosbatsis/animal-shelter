import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Helper to check the query status safely (won't crash on server)
const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {}
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

const getSnapshot = () => {
  if (typeof window === "undefined") return false
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
}

const getServerSnapshot = () => {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
}