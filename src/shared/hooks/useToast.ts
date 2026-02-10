import { useState, useCallback, useRef } from 'react'

export type ToastType = 'success' | 'error'

interface ToastState {
  visible: boolean
  message: string
  type: ToastType
}

export function useToast(autoDismissMs = 5000) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  })
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setToast({ visible: true, message, type })
      timerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }))
      }, autoDismissMs)
    },
    [autoDismissMs],
  )

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast((prev) => ({ ...prev, visible: false }))
  }, [])

  return { toast, showToast, hideToast }
}
