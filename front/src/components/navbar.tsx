import React from 'react'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import Link from 'next/link';

// Default CSS class for navigation links - applies hover effects and styling
const cssDefault = "flex gap-2 justify-center items-center flex-col w-full h-[92px] rounded-xl cursor-pointer transition-all duration-300 text-neutral-500 hover:text-white hover:bg-neutral-800/70 border border-transparent hover:border-neutral-700/80";

// Navigation bar component with links to dashboard, search, and hirings pages
export default function Navbar() {
    return (
        <div className='bg-[#0f0f0f]/95 border border-neutral-800 w-full md:w-[112px] flex md:flex-col md:absolute md:left-5 gap-3 justify-center items-center bottom-4 p-2 rounded-2xl shadow-[0_14px_40px_rgb(0_0_0_/_0.4)] md:h-[calc(100%-2rem)] md:justify-start md:py-4 md:top-4 backdrop-blur-xl'>
            <Link href='/dashboard' className={cssDefault}>
                <HomeRoundedIcon/>
                <span className="text-xs font-medium uppercase tracking-wide">home</span>
            </Link>
            <Link href='/search' className={cssDefault}>
                <SearchRoundedIcon/>
                <span className="text-xs font-medium uppercase tracking-wide">buscar</span>
            </Link>
            <Link href='/hirings' className={cssDefault}>
                <SummarizeRoundedIcon/>
                <span className="text-[11px] font-medium uppercase tracking-wide">contratos</span>
            </Link>
        </div>
    )
}
