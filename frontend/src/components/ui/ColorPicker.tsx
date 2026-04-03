import React from 'react'
import { PRESET_COLORS } from '@/utils/constants'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-primary">Color</label>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
            style={{
              backgroundColor: color,
              borderColor: value === color ? '#ffffff' : 'transparent',
            }}
          />
        ))}
      </div>
    </div>
  )
}
