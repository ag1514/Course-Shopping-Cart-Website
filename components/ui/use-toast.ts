"use client"

import { useState, useCallback } from "react"
import type { ToastActionElement } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

export type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(
    ({ ...props }: Omit<ToastProps, "id">) => {
      setToasts((state) => {
        if (state.length >= TOAST_LIMIT) {
          state.pop()
        }

        return [
          {
            id: genId(),
            ...props,
          },
          ...state,
        ]
      })

      return {
        id: count.toString(),
        dismiss: () => setToasts((state) => state.filter((t) => t.id !== count.toString())),
      }
    },
    [setToasts],
  )

  const dismiss = useCallback((toastId?: string) => {
    setToasts((state) => (toastId ? state.filter((t) => t.id !== toastId) : []))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}

export type Toast = ReturnType<typeof useToast>
