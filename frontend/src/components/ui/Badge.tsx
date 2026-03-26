import React from 'react'

interface BadgeProps {
  label: string
  color?: string
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ label, color = '#3b82f6', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  )
}
