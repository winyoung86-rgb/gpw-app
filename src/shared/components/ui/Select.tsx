import { type SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[]
  placeholder?: string
  onChange: (value: string) => void
}

export function Select({
  options,
  placeholder = 'Select an option',
  value,
  onChange,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="relative p-[1px] rounded-lg bg-gradient-to-r from-pink/40 via-purple/40 to-pink/40">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full appearance-none
          bg-background backdrop-blur-md
          border-none
          text-white
          px-4 py-3
          rounded-lg
          cursor-pointer
          transition-all duration-200
          hover:bg-white/5
          focus:outline-none focus:ring-2 focus:ring-purple/50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        <option value="" disabled className="bg-background text-text-muted">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-background text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
