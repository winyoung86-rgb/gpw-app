import { useState, useRef, useEffect } from 'react'

interface SelectOption {
  value: string
  label: string
  labelShort?: string
}

interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Select({
  options,
  placeholder = 'Select an option',
  value,
  onChange,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)
  const displayLabel = selectedOption
    ? isMobile
      ? selectedOption.labelShort || selectedOption.label
      : selectedOption.label
    : placeholder

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <div className="p-[1px] rounded-lg bg-gradient-to-r from-pink/40 via-purple/40 to-pink/40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full text-left
            bg-background backdrop-blur-md
            border-none
            px-4 py-3
            rounded-lg
            cursor-pointer
            transition-all duration-200
            hover:bg-white/5
            focus:outline-none focus:ring-2 focus:ring-purple/50
            flex items-center justify-between
            ${!selectedOption ? 'text-text-muted' : 'text-white'}
          `}
        >
          <span className="truncate pr-2">{displayLabel}</span>
          <svg
            className={`w-5 h-5 text-white/50 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
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
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 p-[1px] rounded-lg bg-gradient-to-r from-pink/40 via-purple/40 to-pink/40">
          <div className="bg-background backdrop-blur-md rounded-lg overflow-hidden max-h-64 overflow-y-auto">
            {options.map((option) => {
              const optionLabel = isMobile
                ? option.labelShort || option.label
                : option.label
              const isSelected = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`
                    w-full text-left px-4 py-3
                    transition-colors duration-150
                    cursor-pointer
                    ${
                      isSelected
                        ? 'bg-purple/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-purple flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className={isSelected ? '' : 'pl-6'}>{optionLabel}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
