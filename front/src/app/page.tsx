"use client"
import Btn from "@/components/btn";
import Input from "@/components/input";
import Image from "next/image";
import { useState } from "react";
import Loading from "@/components/loading";

import { login } from "@/hooks/useSpotify";

// Landing page - displays welcome message and login button for Spotify authentication
export default function Home(){
  // State for tracking login button loading state
  const [loading, setLoading] = useState(false);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="flex flex-col gap-8 p-6 md:p-10 w-full max-w-[680px] items-center justify-center bg-[#0f0f0f]/90 border border-neutral-800 rounded-3xl shadow-[0_24px_70px_rgb(0_0_0_/_0.5)] backdrop-blur-xl">
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          className="bg-[#171717] border border-neutral-700 p-5 rounded-2xl"
          width={100}
          height={100}
          priority
        />
        <div className="flex flex-col justify-center items-center gap-3">
          <span className="px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] bg-[#1ed760]/15 text-[#53f189] border border-[#1ed760]/30">Spotify Hub</span>
          <h1 className="text-4xl md:text-5xl font-black text-center leading-tight">Seja Bem-Vindo</h1>
          <h2 className="text-neutral-400 text-base md:text-lg font-medium text-center max-w-[44ch]">Conecte sua conta e descubra artistas para contratar com uma experiência simples e moderna.</h2>
        </div>
        <Btn onClick={() => login({ setLoading })} disabled={loading} className="w-full max-w-[360px]">
          {loading ?  <Loading className="!h-fit !w-fit !min-h-0"  type="simple"/> : "Login"}
        </Btn>
        <p className="text-xs md:text-sm font-light text-neutral-500 uppercase tracking-[0.14em]">Um oferecimento Kayky Zioti</p>
      </div>
    </main>
  );
}
