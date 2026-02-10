import type { ToastType } from '../../hooks/useToast'

interface ToastProps {
  visible: boolean
  message: string
  type: ToastType
  onClose: () => void
}

export function Toast({ visible, message, type, onClose }: ToastProps) {
  if (!visible) return null

  const borderColor =
    type === 'success'
      ? 'border-green-400/60'
      : 'border-pink/60'

  const icon = type === 'success' ? '\u2713' : '!'

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 max-w-sm
        glass-card ${borderColor} border
        px-5 py-4 flex items-start gap-3
        toast-slide-in
      `}
      role="alert"
    >
      <span
        className={`
          flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          ${type === 'success' ? 'bg-green-400/20 text-green-400' : 'bg-pink/20 text-pink'}
        `}
      >
        {icon}
      </span>
      <p className="text-sm text-white/90 flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-white/40 hover:text-white transition-colors text-lg leading-none"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  )
}
