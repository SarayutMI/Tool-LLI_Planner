import React from 'react'

interface DatePickerProps {
  label?: string
  value?: string
  onChange: (value: string) => void
  error?: string
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, error }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-primary">{label}</label>}
      <input
        type="date"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-surface-secondary text-text-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-accent-blue transition-colors ${
          error ? 'border-status-danger' : 'border-border-primary'
        }`}
        style={{ colorScheme: 'dark' }}
      />
      {error && <p className="text-xs text-status-danger">{error}</p>}
    </div>
  )
}
