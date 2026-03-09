"use client"
import { Artist } from '@/models/artist';
import React, { useRef, useEffect } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Carousel component that displays artists with auto-scrolling funcionality
export default function Carrosel({ artists }: { artists?: Artist[] }) {

    const router = useRouter();

    if (!artists) return null;
    // Reference to carousel container for scroll manipulation
    const carouselRef = useRef<HTMLDivElement>(null);
    // Request animation frame ID for cleanup on unmount
    const rafId = useRef<number | null>(null);

    // Auto-scroll carousel continuously - uses requestAnimationFrame for smooth animation
    useEffect(() => {
        let lastTime = 0;

        const loop = (time: number) => {
            if (!carouselRef.current) return;

            if (time - lastTime > 16) {
                carouselRef.current.scrollBy({ left: 1 });
                lastTime = time;
            }
            if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth - carouselRef.current.clientWidth) {
                carouselRef.current.scrollLeft = 0;
            }
            rafId.current = requestAnimationFrame(loop);
        };

        rafId.current = requestAnimationFrame(loop);

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    // Renders individual carousel items with artist image and follower count - clickable to search
    const RenderItem = ({ artist }: { artist: Artist }) => {
        if (artist.images.length === 0) return null;
        return (
            // Carousel item - displays artist with hover scale effect and search redirect on click
            <div className='bg-[#111111] border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:scale-[1.01] rounded-2xl flex flex-col justify-center items-center p-4 cursor-pointer relative min-w-[320px] md:min-w-[420px] min-h-[260px] md:min-h-[300px] overflow-hidden' onClick={() => router.push(`./search?artist=${encodeURIComponent(artist.name)}`)}>
                <Image
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    className="rounded-2xl w-full h-full absolute object-cover"
                    width={1000}
                    height={1000}
                />
                <div className='absolute flex flex-col w-full h-full justify-end text-left items-start bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-2xl z-10 p-6'>
                    <h3 className="text-2xl font-bold leading-tight">{artist.name}</h3>
                    <h3 className="text-4xl md:text-5xl font-black mt-2">{(artist.followers.total).toLocaleString()}</h3>
                    <p className='text-neutral-300 text-sm uppercase tracking-[0.18em] mt-1'>seguidores</p>
                </div>
            </div>
        )
    }

    return (
        <div ref={carouselRef} id='carrosel' className='flex gap-4 overflow-x-auto w-full py-3'>
            {artists.map((artist) => (
                <div key={artist.id}>
                    <RenderItem artist={artist} />
                </div>
            ))}
        </div>
    )
}
