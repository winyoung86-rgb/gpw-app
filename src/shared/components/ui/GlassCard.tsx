import { type HTMLAttributes, type PropsWithChildren } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'purple' | 'pink' | 'orange' | 'none'
}

export function GlassCard({
  children,
  glow = 'none',
  className = '',
  ...props
}: PropsWithChildren<GlassCardProps>) {
  const glowStyles = {
    purple: 'shadow-glow-purple',
    pink: 'shadow-glow-pink',
    orange: 'shadow-glow-orange',
    none: '',
  }

  return (
    <div
      className={`glass-card ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
