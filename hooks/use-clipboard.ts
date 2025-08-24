"use client"

import { useState } from "react"

export function useClipboard(duration = 1600) {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), duration)
      return true
    } catch {
      return false
    }
  }

  return { copied, copy }
}
