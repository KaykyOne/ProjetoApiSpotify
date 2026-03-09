import React from 'react'

// Define button style options - submit, cancel, or default button1 style
type tips = 'button1' | 'cancel' | 'submit' | undefined

// Props interface for customizable button component with optional styling tips
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode
  className?: string
  tip?: tips
}

// Reusable button component with diferent visual styles based on tip prop
export default function Btn({ children, className, tip, ...props }: BtnProps) {

  // CSS styles mappings for diferent button variants - applies Tailwind classes dynamicly
  const csss = {
    button1: 'bg-neutral-100 py-3.5 px-4 flex gap-3 justify-center items-center cursor-pointer transition-all duration-300 text-black hover:bg-white hover:shadow-[0_8px_30px_rgb(255_255_255_/_0.18)] w-full rounded-full font-semibold disabled:opacity-60 disabled:cursor-not-allowed',
    cancel: 'bg-[#2a1115] py-3.5 px-4 flex gap-3 justify-center items-center cursor-pointer transition-all duration-300 text-rose-200 border border-rose-900/70 hover:bg-[#3a171d] w-full rounded-full font-medium disabled:opacity-60 disabled:cursor-not-allowed',
    submit: 'bg-[#1ed760] py-3.5 px-4 flex justify-center items-center cursor-pointer transition-all duration-300 text-black hover:bg-[#25e068] hover:shadow-[0_8px_26px_rgb(30_215_96_/_0.32)] w-full rounded-full font-semibold disabled:opacity-60 disabled:cursor-not-allowed',
  }

  return (
    <button
      className={`${csss[tip || 'button1']} ${className}`}

      {...props}
    >
      {children}
    </button>
  )
}
