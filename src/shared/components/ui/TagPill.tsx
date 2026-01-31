import { type ButtonHTMLAttributes, useState, useEffect } from 'react'

interface TagPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  tag: string
}

export function TagPill({
  tag,
  selected = false,
  className = '',
  onClick,
  ...props
}: TagPillProps) {
  const [animate, setAnimate] = useState(false)

  // Trigger animation when selected changes to true
  useEffect(() => {
    if (selected) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 200)
      return () => clearTimeout(timer)
    }
  }, [selected])

  return (
    <button
      type="button"
      onClick={onClick}
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
        ${animate ? 'tag-select-animation' : ''}
        ${className}
      `}
      {...props}
    >
      {tag}
    </button>
  )
}
