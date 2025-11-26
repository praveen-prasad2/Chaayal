'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const HERO_SLIDES = [
    {
        id: 1,
        image: '/saree/saree1.JPG',
        headline: 'Nalina Mozhi',
        subheading: 'The Language of Threads',
        description: 'Handwoven silks in poetic palettes, crafted for intimate celebrations.',
    },
    {
        id: 2,
        image: '/saree/saree2.JPG',
        headline: 'Saffron Courts',
        subheading: 'Heirloom Heaviness, Modern Silhouettes',
        description: 'A capsule of richly embellished couture that nods to royal ateliers.',
    },
    {
        id: 3,
        image: '/saree/saree3.JPG',
        headline: 'Ivory Raga',
        subheading: 'Stories Woven in Minimal Gold',
        description: 'Luxurious everyday ensembles inspired by Kerala’s coastal nostalgia.',
    },
];

export default function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);
    const totalSlides = HERO_SLIDES.length;

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }, [totalSlides]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const slide = useMemo(() => HERO_SLIDES[activeIndex], [activeIndex]);

    return (
        <section className="relative h-[75vh] md:h-[80vh] w-full overflow-hidden bg-black">
            {HERO_SLIDES.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        index === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <Image
                        src={item.image}
                        alt={item.headline}
                        fill
                        priority={index === activeIndex}
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/10 to-black/70" />
                </div>
            ))}

            <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
                <div className="text-white max-w-3xl space-y-4">
                    <p className="text-[13px] tracking-[0.5em] uppercase text-white/80">Chaayal Drop 25.25</p>
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">{slide.headline}</h1>
                    <h2 className="text-xl md:text-2xl text-white/80">{slide.subheading}</h2>
                    <p className="text-base md:text-lg text-white/70 max-w-2xl">{slide.description}</p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link
                            href="#products"
                            className="px-8 py-3 bg-white text-black text-sm uppercase tracking-[0.3em]"
                        >
                            Explore Drop
                        </Link>
                        <Link
                            href="#contact"
                            className="px-8 py-3 border border-white text-white text-sm uppercase tracking-[0.3em]"
                        >
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </div>

            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 sm:px-10">
                <button
                    aria-label="Previous slide"
                    onClick={prevSlide}
                    className="bg-white/60 hover:bg-white text-black p-3 transition"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    aria-label="Next slide"
                    onClick={nextSlide}
                    className="bg-white/60 hover:bg-white text-black p-3 transition"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                {HERO_SLIDES.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-[3px] w-16 transition ${
                            index === activeIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
