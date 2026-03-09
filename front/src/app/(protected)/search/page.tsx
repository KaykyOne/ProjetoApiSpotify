"use client"
import Input from '@/components/input'
import React, { useState, useEffect } from 'react'
import Loading from '@/components/loading';
import Image from 'next/image';
import { Artist } from "@/models/artist";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ModalHiring from '@/components/modalHiring';
import { useSearchParams } from 'next/navigation';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import { searchArtist } from "@/hooks/useSpotify";
// Timer varible for delayed search - prevents too many API calls
let timer: any = null;

export default function page() {

  const searchParams = useSearchParams();

  // State managment for artist search functionality
  const [artistName, setArtistName] = useState<string>('');
  const [artistSelected, setArtistSelected] = useState<Artist | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(5);
  const limit = 5; // Number of artists per page in the serch results

  // Triggers when artistName changes - resets search results and starts debounced timer
  useEffect(() => {
    if (!artistName) {
      setArtists([]);
      setLoading(false);
    } else {
      setLoading(true)
    }
    setPage(0);
    if (!timer) startTimer();
    else resetTimer();
  }, [artistName]);

  // Extracts artist name from URL params on component mount and cleans the URL history
  useEffect(() => {
    const name = searchParams.get("artist");
    if (name) {
      setArtistName(name);
    }
    setTimeout(() => {
      window.history.replaceState({}, document.title, "/search");
    }, 0);
  }, [])

  // Calls fetchData whenever page number changes - implements pagination
  useEffect(() => {
    fetchData();
  }, [page]);

  // Fetches artist data from Spotify API with pagination suport
  const fetchData = async () => {
    if (!artistName) return;
    const res = await searchArtist(artistName, limit, page * limit);
    if (res) {
      setArtists(res);
      setLoading(false);
    }
  }

  // Initializes a timer that delays the API call by 2 seconds
  const startTimer = () => {
    timer = setTimeout(async function () {
      console.log("Executou");
      await fetchData();
    }, 2000)
  }

  // Clears the old timer and creates a new one - used for debouncing the search
  function resetTimer() {
    clearTimeout(timer); // cancels the old timer
    startTimer();        // creates a new one
  }

  // Renders the list of artists with image and follower information
  function RenderElements() {
    return (
      <div className='flex flex-col gap-3 w-full'>
        {artists.map((artist) => {
          return (
            <div key={artist.id} className='flex items-center gap-4 w-full bg-[#121212] border border-neutral-800 rounded-2xl shadow hover:border-neutral-700 hover:bg-[#171717] transition-all duration-300 cursor-pointer p-4' onClick={() => setArtistSelected(artist)}>
              {artist.images[0] ? (
                <Image
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  className='rounded-xl object-cover'
                  width={80}
                  height={80}
                />
              ) : (
                <div className='w-[80px] h-[80px] rounded-xl bg-neutral-800 flex justify-center items-center'>
                  <AccountCircleIcon className='text-neutral-500' style={{ fontSize: 60 }} />
                </div>
              )}


              <div className='flex flex-col flex-1'>
                <h2 className='text-lg font-semibold'>{artist.name}</h2>
                <p className='text-sm text-neutral-400'>
                  {Number(artist.followers.total).toLocaleString()} seguidores
                </p>
              </div>
              <span className='text-xs uppercase tracking-[0.14em] text-[#53f189]'>Selecionar</span>
            </div>
          )
        })}
      </div>
    )
  }

  // Component displayed when no search has been performed yet
  function Sleep() {
    return (
      <div className='flex flex-col gap-2 w-full h-full justify-center items-center'>
        <Image alt='sheep' src={'/gifovelha.gif'} width={200} height={200} />
        <h1 className='text-neutral-300'>Digite algo para pesquisar.</h1>
      </div>
    )
  }

  return (
    <div className='flex flex-col w-full h-full justify-start items-center gap-4'>
      <div className='w-full'>
        <p className='text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1'>Busca</p>
        <h1 className='text-3xl font-bold capitalize'>Pesquise artistas</h1>
        <p className='text-neutral-400 text-sm'>Encontre informacoes sobre seus artistas favoritos.</p>
      </div>
      <div className='flex gap-2 w-full'>
        <Input
          placeholder='Digite o nome do artista...'
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
        />

        {artistName && (
          <button
            onClick={() => {setArtistName(''); setArtists([])}}
            className='bg-[#171717] border border-neutral-700 hover:border-neutral-500 transition p-3 rounded-xl flex justify-center items-center cursor-pointer'
          >
            <ClearAllIcon className='text-neutral-400' />
          </button>
        )}
      </div>
      <div className='flex-1 w-full max-h-[50vh] md:max-h-none md:h-full overflow-y-auto pr-1'>
        {loading ? <Loading type='bone' number={5} /> : (artists.length > 0 ? <RenderElements /> : <Sleep />)}
      </div>

      {artistName && artists.length > 0 && (
        <div className='flex gap-3 justify-center items-center'>
          <button
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            className='cursor-pointer px-4 py-2 rounded-full border border-neutral-700 hover:bg-neutral-800 disabled:opacity-45'
            disabled={page === 0 || loading}
          >{"<"}
          </button>
          <span className='text-xs text-neutral-500 uppercase tracking-[0.14em]'>pagina {page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            className='cursor-pointer px-4 py-2 rounded-full border border-neutral-700 hover:bg-neutral-800 disabled:opacity-45'
            disabled={loading}
          >{">"}
          </button>
        </div>
      )}
      {artistSelected && (
        <ModalHiring artistSelected={artistSelected} setArtistSelected={setArtistSelected} />
      )}
    </div>
  )
}
