import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-primary">{label}</label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-text-muted pointer-events-none">{icon}</span>
          )}
          <input
            ref={ref}
            {...props}
            className={`w-full rounded-lg border bg-surface-secondary text-text-primary placeholder-text-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue ${
              error ? 'border-status-danger' : 'border-border-primary'
            } ${icon ? 'pl-9' : 'pl-3'} ${rightIcon ? 'pr-9' : 'pr-3'} py-2 text-sm ${className}`}
          />
          {rightIcon && (
            <span className="absolute right-3 text-text-muted">{rightIcon}</span>
          )}
        </div>
        {error && <p className="text-xs text-status-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
