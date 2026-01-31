import { type ButtonHTMLAttributes } from 'react'

interface TagPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  tag: string
}

export function TagPill({
  tag,
  selected = false,
  className = '',
  ...props
}: TagPillProps) {
  return (
    <button
      type="button"
      className={`
        px-4 py-2
        rounded-full
        text-sm font-medium
        transition-all duration-200
        cursor-pointer
        ${
          selected
            ? 'bg-pink border border-pink text-white shadow-glow-pink'
            : 'bg-transparent border border-white/30 hover:bg-white/10 hover:border-white/50 gradient-tag-text'
        }
        ${className}
      `}
      {...props}
    >
      {tag}
    </button>
  )
}
