"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from "next/navigation";
import { searchArtist } from '@/hooks/useSpotify';
import { Artist } from '@/models/artist';
import Carrosel from '@/components/carrosel';
import Loading from '@/components/loading';
import { listHiring } from '@/hooks/useHiring';
import { Hiring } from '@/models/hiring';

// Dashboard page - displays welcome message, stats, and carousel of popular artists
export default function page() {

  const searchParams = useSearchParams();
  // State for storing artists and hirings data
  const [artists, setArtists] = useState<Artist[]>([]);
  const [hirings, setHirings] = useState<Hiring[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  // Extracts authentication token and user ID from URL parameters on mount
  useEffect(() => {
    const token = searchParams.get("token");
    const user_id = searchParams.get("user_id");

    if (token && user_id) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_id", user_id);
      setTimeout(() => {
        window.history.replaceState({}, document.title, "/dashboard");
      }, 0);
    }
  }, [searchParams]);

  // Fetches artists and hirings data from API on component mount
  useEffect(() => {
    const search = async () => {
      setLoading(true);
      try {
        // Searches for Lana Del Rey as default artist, shows top 10 results
        const res = await searchArtist("lana", 10, 0);
        const res2 = await listHiring();
        setArtists(res || []);
        setHirings(res2 || []);
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setLoading(false);
      }

    }

    search();
  }, []);



  return (
    <div className='w-full h-full flex flex-col gap-6 pt-2 pb-8'>
      <div className='flex flex-col gap-1'>
        <p className='text-xs uppercase tracking-[0.2em] text-neutral-500'>Dashboard</p>
        <h1 className='text-4xl md:text-5xl font-semibold leading-tight'>Bem-Vindo!</h1>
        <h4 className='text-neutral-400 font-light'>Seu hub de descoberta e contratacao de artistas.</h4>
      </div>

      {/* Stats Section - displays total artists and contracts count */}
      {loading ? <Loading type='bone' number={2} flex={true} /> : (
        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-[#121212] p-4 rounded-2xl border border-neutral-800'>
            <p className='text-neutral-400 text-sm uppercase tracking-wide'>Total de Artistas</p>
            <p className='text-3xl font-bold text-neutral-100 mt-1'>1.247</p>
          </div>
          <div className='bg-[#121212] p-4 rounded-2xl border border-[#1ed760]/35'>
            <p className='text-neutral-400 text-sm uppercase tracking-wide'>Contratos</p>
            <p className='text-3xl font-bold text-[#53f189] mt-1'>{hirings.length}</p>
          </div>
        </div>
      )}


      {/* Badges & Info - displays achievements and trending info */}
      {loading ? <Loading type='bone' number={3} flex={true} /> : (
        <div className='flex flex-wrap gap-3 items-center'>
          <div className='px-4 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition'>
            <p className='text-sm font-medium'>⭐ +99 artistas adicionados</p>
          </div>
          <div className='px-4 py-2 rounded-full border border-[#1ed760]/45 text-[#53f189] hover:bg-[#1ed760]/10 transition'>
            <p className='text-sm font-medium'>✓ Contratos diretos!</p>
          </div>
          <div className='px-4 py-2 rounded-full border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition'>
            <p className='text-sm font-medium'>🎵 Trending esta semana</p>
          </div>
        </div>
      )}

      {/* Carousel Section - displays featured artists in horizontal scrolling list */}
      <div>
        <h2 className='text-2xl font-semibold mb-2'>Top Semanal</h2>
        {loading ? <Loading type='bone' flex={true} number={4} /> : <Carrosel artists={artists} />}
      </div>

      {/* Recent Activity Section - shows latest hiring contracs */}
      <div className='mt-4'>
        <h2 className='text-2xl font-semibold mb-4'>Atividade Recente</h2>

        {loading ? <Loading type='bone' flex={false} number={3} /> : (
          <div className='space-y-3'>
            {hirings.map((hiring, index) => (
              index < 5 && (
                <div key={index} className='p-4 rounded-2xl border border-neutral-800 bg-[#111111] hover:border-neutral-700 transition'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='text-sm font-medium'>Novo contato: {hiring.name}</p>
                      <p className='text-xs text-neutral-400 mt-1'>{"R$" + hiring.value.toLocaleString()}</p>
                    </div>
                    <span className='text-xs bg-[#1ed760]/15 text-[#53f189] border border-[#1ed760]/30 px-3 py-1 rounded-full'>Vantajoso</span>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
