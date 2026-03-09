import React, { useState } from 'react'
import Modal from './modal'
import { Artist } from '@/models/artist'
import Input from './input'
import Btn from './btn'
import { createHiring } from '@/hooks/useHiring'
import { Hiring } from '@/models/hiring'

// Props for modal hiring component - selected artist and state setter
type Props = {
    artistSelected: Artist;
    setArtistSelected: (artist: Artist | null) => void;
}

// Two-step modal for hiring artists - confirms artist details then collects event information
export default function ModalHiring({ artistSelected, setArtistSelected }: Props) {
    // State managment for hiring form inputs
    const [contractValue, setContractValue] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [eventDate, setEventDate] = useState<string>('    ');
    const [eventAddress, setEventAddress] = useState<string>('');

    // CSS styles for step indicator dots - shows current step position
    const css = {
        selected: 'bg-[#53f189] rounded-full h-2.5 w-8',
        notSelected: 'bg-neutral-700 rounded-full h-2.5 w-2.5'
    }

    // Submits hiring data to API - creates contract and closes modal
    const submitHiring = async (e: React.FormEvent) => {
        e.preventDefault();

        const newHiringData: Omit<Hiring, 'id'> =
        {
            spotify_id: artistSelected.id,
            name: name,
            value: parseFloat(contractValue),
            event_date: eventDate,
            address: eventAddress
        };
        const res = await createHiring(newHiringData);
        if (res) setArtistSelected(null);
    }

    const [num, setNum] = useState<number>(0);
    return (
        <Modal>
            <div className='flex flex-col w-full h-full md:min-w-[420px] md:min-h-[400px]'>
                <div className='flex w-full justify-between mb-5 text-sm text-neutral-300'>
                    {num > 0 ? <button className='cursor-pointer' onClick={() => setNum(num - 1)} disabled={num == 0}>{"< Voltar"}</button> : <div></div>}
                    <button className='cursor-pointer' onClick={() => setArtistSelected(null)}>X</button>
                </div>

                {num == 0 && (
                    <div className='flex flex-col gap-2 items-start h-full'>
                        <div className='flex flex-col mb-4'>
                            <h1 className='text-3xl font-semibold'>Artista Selecionado</h1>
                            <h3 className='text-sm font-light text-neutral-400'>Confirme se esse e o artista que voce deseja contratar</h3>
                        </div>

                        <div className='text-neutral-400 gap-2 flex flex-col w-full'>
                            <label>Nome:</label>
                            <Input value={artistSelected.name} disabled />
                            <label>Popularidade:</label>
                            <Input value={artistSelected.popularity + "%"} disabled />
                            <label>Tipo:</label>
                            <Input value={artistSelected.type} disabled />
                            <label>Seguidores:</label>
                            <Input value={(artistSelected.followers.total).toLocaleString()} disabled />
                            <a href={artistSelected.external_urls.spotify} className='bg-[#171717] border border-neutral-700 p-3 rounded-xl text-neutral-200 hover:border-[#1ed760]/40 transition-colors' target="_blank">Ouvir no Spotify</a>
                        </div>

                        <Btn className='mt-5' onClick={() => setNum(1)}>
                            Avançar
                        </Btn>
                    </div>
                )}

                {num == 1 && (
                    <div className='flex flex-col gap-2 items-start h-full'>
                        <div className='flex flex-col mb-4'>
                            <h1 className='text-3xl font-semibold'>Contratação</h1>
                            <h3 className='text-sm font-light text-neutral-400'>Preencha os dados e contrate o artista.</h3>
                        </div>
                        <form className='flex flex-col gap-2 w-full' onSubmit={submitHiring}>
                            <label className='text-neutral-400'>Valor da Contratação (R$):</label>
                            <Input required type='number' placeholder='Valor em reais' value={contractValue} onChange={e => setContractValue(e.target.value)} />
                            <label className='text-neutral-400'>Nome do Show:</label>
                            <Input required type='text' placeholder='Seu nome' value={name} onChange={e => setName(e.target.value)} />
                            <label className='text-neutral-400'>Data do evento:</label>
                            <Input required type='date' placeholder='Data do evento' value={eventDate} onChange={e => setEventDate(e.target.value)} />
                            <label className='text-neutral-400'>Endereço:</label>
                            <Input required type='text' placeholder='Endereço do evento' value={eventAddress} onChange={e => setEventAddress(e.target.value)} />
                            <Btn className='mt-5 w-full' tip='submit'>Contratar</Btn>
                        </form>

                    </div>
                )}
                <div className='flex gap-2 w-full justify-center mt-4'>
                    <div className={num == 0 ? css.selected : css.notSelected}></div>
                    <div className={num == 1 ? css.selected : css.notSelected}></div>
                </div>
            </div>
        </Modal>
    )
}
