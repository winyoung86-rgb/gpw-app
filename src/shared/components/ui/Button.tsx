import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-heading font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-purple/[0.18] backdrop-blur-md text-white border border-purple/40 hover:border-pink/50 hover:bg-purple/[0.25] active:scale-95 shadow-[0_0_12px_rgba(176,38,255,0.3),_0_0_24px_rgba(255,0,128,0.15)] hover:shadow-[0_0_20px_rgba(176,38,255,0.45),_0_0_35px_rgba(255,0,128,0.25)] disabled:shadow-none disabled:hover:shadow-none disabled:border-white/10 disabled:bg-white/[0.06]',
    secondary:
      'bg-white/5 text-white border border-white/10 hover:bg-white/10 active:scale-95',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/5',
    outline:
      'bg-white/[0.06] backdrop-blur-md text-white border border-orange/40 hover:border-orange/60 hover:bg-orange/[0.12] active:scale-95 shadow-[0_0_12px_rgba(255,69,0,0.2)] hover:shadow-[0_0_20px_rgba(255,69,0,0.35)] disabled:shadow-none disabled:hover:shadow-none disabled:border-white/10',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
