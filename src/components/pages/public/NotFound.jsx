import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-transparent text-dark-teal dark:text-warm-white">
            <div className="text-center max-w-2xl mx-auto">
                {/* Main 404 number */}
                <div className="font-playfair text-7xl sm:text-8xl lg:text-9xl font-semibold text-old-gold leading-none mb-4">
                    404
                </div>

                {/* Heading */}
                <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                    Page not <span className="italic text-old-gold">found</span>
                </h1>

                {/* Description */}
                <p className="font-inter text-base sm:text-lg text-black/60 dark:text-white/60 max-w-lg mx-auto mt-4 leading-relaxed">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                {/* Buttons – rectangle, no border-radius */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <Link
                        to="/"
                        className="group relative px-8 py-3 bg-old-gold text-warm-white dark:text-dark-teal font-jost text-xs sm:text-sm tracking-[0.15em] uppercase font-medium overflow-hidden transition-all"
                    >
                        <span className="relative z-10">Go home</span>
                        <span className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    </Link>

                    <Link
                        to="/products"
                        className="group relative px-8 py-3 border border-old-gold/30 dark:border-old-gold/20 text-dark-teal dark:text-warm-white font-jost text-xs sm:text-sm tracking-[0.15em] uppercase font-medium overflow-hidden transition-all"
                    >
                        <span className="relative z-10">Browse products</span>
                        <span className="absolute inset-0 bg-old-gold/5 dark:bg-old-gold/8 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
                    </Link>
                </div>
            </div>
        </section>
    );
}