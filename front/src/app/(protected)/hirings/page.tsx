"use client"
import React, { useEffect, useState } from 'react'
import { Hiring } from '@/models/hiring';
import { listHiring, deleteHiring } from '@/hooks/useHiring';
import { searchArtistById } from '@/hooks/useSpotify';
import Btn from '@/components/btn';
import Modal from '@/components/modal';
import Loading from '@/components/loading';
import { Artist } from '@/models/artist';
import { addDays, format } from 'date-fns';
import Input from '@/components/input';

type tipFunc = {
  tip: "see" | "cancel";
}

// Hirings page - displays list of all artist contracts and allows cancellation
export default function page() {
  // State managment for hirings data and modal confirmation
  const [hirings, setHirings] = useState<Hiring[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedHiring, setSelectedHiring] = useState<Hiring | null>(null);
  const [functionCalled, setFunctionCalled] = useState<tipFunc | null>(null);
  const [artistDetails, setArtistDetails] = useState<Artist | null>(null);

  // Fetches hirings list on component mount
  useEffect(() => {
    async function fetchHirings() {
      setLoading(true);
      try {
        const res: Hiring[] | null = await listHiring();
        if (res) {
          setHirings(res);
        }
      } catch (error) {
        console.error("Error fetching hirings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHirings();
  }, []);

  useEffect(() => {

    const fetchDetails = async () => {
      if (selectedHiring) {
        const artist = await searchArtistById(selectedHiring.spotify_id);
        if (artist) {
          setArtistDetails(artist);
        }
      }
    }

    if (selectedHiring !== null && functionCalled?.tip === "see") {
      fetchDetails();
    } else {
      setArtistDetails(null);
    }

  }, [selectedHiring]);

  // Renders hirings list with details - shows date, location, value, and cancel buton
  const RenderHirings = () => {
    return (
      loading ? (
        <Loading type='bone' number={3} />
      ) : (
        hirings.map((hiring) => {
          return (
            <div key={hiring.id} className='w-full bg-[#121212] p-6 rounded-2xl shadow-lg border border-neutral-800 hover:border-neutral-700 transition flex flex-col gap-4'>
              <div className='flex justify-between items-start gap-4'>
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold text-white mb-1'>{hiring.name}</h2>
                  <div className='flex items-center gap-2'>
                    <span className='inline-block w-2 h-2 rounded-full bg-[#1ed760]'></span>
                    <p className='text-xs text-[#53f189] font-medium uppercase tracking-wide'>Contratacao ativa</p>
                  </div>
                </div>
                <div className='bg-[#1ed760]/10 border border-[#1ed760]/35 px-4 py-2 rounded-xl'>
                  <p className='text-lg font-bold text-[#53f189]'>R$ {hiring.value}</p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-[#171717] rounded-xl p-3 border border-neutral-700/70'>
                  <p className='text-xs text-neutral-400 mb-1'>Data do Evento</p>
                  <p className='text-sm font-semibold text-neutral-200'>{format(addDays(new Date(hiring?.event_date!), 1), 'dd/MM/yyyy')}</p>
                </div>
                <div className='bg-[#171717] rounded-xl p-3 border border-neutral-700/70'>
                  <p className='text-xs text-neutral-400 mb-1'>Localizacao</p>
                  <p className='text-sm font-semibold text-neutral-200 truncate'>{hiring.address}</p>
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-3'>
                <Btn tip='cancel' onClick={() => { setSelectedHiring(hiring); setFunctionCalled({ tip: "cancel" }); }}>Cancelar Contratacao</Btn>
                <Btn tip='button1' onClick={() => { setSelectedHiring(hiring); setFunctionCalled({ tip: "see" }); }}>Visualizar Contratacao</Btn>
              </div>

            </div>
          )
        })
      )
    )
  }

  // Handles hiring deletion - removes contract from database
  const handleCancelHiring = async (hiringId: number) => {
    const res = await deleteHiring(hiringId);

    if (res) {
      setHirings(hirings.filter(e => e.id !== hiringId))
      setSelectedHiring(null);
    }
  }

  return (
    <div className='h-full w-full'>
      <div className='mb-8'>
        <p className='text-xs uppercase tracking-[0.2em] text-neutral-500 mb-1'>Contratacoes</p>
        <h1 className='text-4xl font-bold mb-2'>Minhas Contratações</h1>
        <p className='text-neutral-400'>Gerencie todos os seus eventos e contratos</p>
      </div>

      {hirings.length > 0 ? (
        <div>
          <div className='mb-4 flex items-center gap-2'>
            <span className='text-sm text-neutral-400'>Total de eventos:</span>
            <span className='bg-[#1ed760]/10 border border-[#1ed760]/35 text-[#53f189] px-3 py-1 rounded-full text-sm font-medium'>{hirings.length} contratacoes</span>
          </div>
          <div className='flex flex-col gap-4'>
            <RenderHirings />
          </div>
        </div>
      ) : (
        <div className='h-96 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-700 bg-[#0f0f0f]'>
          <p className='text-4xl'>🎭</p>
          <p className='text-neutral-400 text-lg'>Nenhuma contratação encontrada</p>
          <p className='text-neutral-500 text-sm'>Explore artistas e crie novos eventos</p>
        </div>
      )}

      {selectedHiring !== null && (
        <Modal>
          {functionCalled?.tip === "cancel" ? (
            <div className='flex flex-col gap-6'>
              <div>
                <h2 className='text-2xl font-bold mb-2'>Cancelar Contratação</h2>
                <p className='text-neutral-400'>Tem certeza que deseja cancelar esta contratação? Esta ação não pode ser desfeita.</p>
              </div>
              <div className='flex gap-4'>
                <Btn tip="submit" onClick={() => setSelectedHiring(null)}>Não</Btn>
                <Btn tip="cancel" onClick={() => handleCancelHiring(selectedHiring.id!)}>Sim</Btn>
              </div>
            </div>
          ) :
            (
              <div className='flex flex-col gap-6'>
                <div>
                  {loading || artistDetails === null ? (
                    <div className='min-w-[300px]'>
                      <Loading type='simple' />
                    </div> 
                  ) : (
                    <div className='flex flex-col gap-4 min-w-[320px] md:min-w-[400px] pb-5'>
                      <div>
                        <h2 className='text-2xl font-bold mb-1'>Detalhes da Contratação</h2>
                        <p className='text-neutral-400 text-sm'>Veja as informações completas sobre esta contratação.</p>
                      </div>
                      
                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400 text-sm'>Artista</label>
                        <Input value={artistDetails?.name} disabled />
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400 text-sm'>Popularidade</label>
                        <Input value={`${artistDetails?.popularity}%`} disabled />
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400 text-sm'>Data do Evento</label>
                        <Input value={format(addDays(new Date(selectedHiring?.event_date!), 1), 'dd/MM/yyyy')} disabled />
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400 text-sm'>Valor</label>
                        <Input value={(selectedHiring?.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} disabled />
                      </div>

                      <div className='flex flex-col gap-2'>
                        <label className='text-neutral-400 text-sm'>Local</label>
                        <Input value={selectedHiring?.address} disabled />
                      </div>
                    </div>
                  )}

                  <Btn tip="button1" onClick={() => setSelectedHiring(null)}>Fechar</Btn>
                </div>
              </div>
            )}
        </Modal>
      )}
    </div>
  )
}
