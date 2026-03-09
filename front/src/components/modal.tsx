import React from 'react'

// Generic modal component with overlay backdrop and blur efect
export default function Modal({children}: {children?: React.ReactNode}) {
  return (
    <div className='fixed w-screen h-screen bg-black/65 backdrop-blur-md z-[9999] top-0 left-0 flex justify-center items-center p-4'>
        <div className='bg-[#101010]/95 border border-neutral-800 p-6 rounded-3xl shadow-[0_20px_60px_rgb(0_0_0_/_0.55)] w-fit h-fit flex flex-col gap-4'>
            {children}
        </div>
    </div>
  )
}
