import React from 'react'
import { getInitials, generateColorFromString } from '@/utils/helpers'

interface AvatarProps {
  name: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  xs: 'w-5 h-5 text-xs',
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '' }) => {
  const bg = generateColorFromString(name)
  const initials = getInitials(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        title={name}
        className={`rounded-full object-cover flex-shrink-0 ${sizeClasses[size]} ${className}`}
      />
    )
  }

  return (
    <div
      title={name}
      className={`rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  )
}
