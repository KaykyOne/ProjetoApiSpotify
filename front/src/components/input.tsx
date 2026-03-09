import React from 'react'

// Props interface for reusable input component with extended HTML attributes
type InputProps = React.InputHTMLAttributes<HTMLInputElement> &{
  className?: string
}

// Custom input component with dark theme styling and green focus state
export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={`bg-[#141414]/90 px-4 py-3 w-full rounded-xl outline-none border border-[#2a2a2a] focus:border-[#1ed760] focus:ring-2 focus:ring-[#1ed760]/25 transition-all text-neutral-100 ${className}`}
      {...props}
    />
  )
}
