import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { FaInstagram, FaEnvelope } from 'react-icons/fa';
import webLogo from '/webLogo.webp';
import webLogoText from '/webLogoText.webp';

const Footer = () => {
    const { theme } = useTheme();

    const links = [
        { label: 'About', to: '/about' },
        { label: 'Products', to: '/products' },
        { label: 'Catalogue', to: '/catalog' },
        { label: 'Contact', to: '/contact' },
    ];

    return (
        <footer className="border-t border-old-gold/10 bg-warm-white/30 dark:bg-charcoal/30 backdrop-blur-sm mt-12 sm:mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    {/* Brand – same sizes as navbar */}
                    <Link to="/" className="flex items-center group h-10">
                        <img src={webLogo} alt="Wel" className="h-full w-auto object-contain" />
                        <img
                            src={webLogoText}
                            alt="Wel Fragrance Collection"
                            className="h-[100%] w-auto object-contain brightness-0 dark:invert -ml-3 transition-opacity duration-300 group-hover:opacity-80"
                        />
                    </Link>

                    {/* Navigation */}
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        {links.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="font-jost text-[11px] tracking-[0.15em] text-warm-gray dark:text-warm-white/70 uppercase transition-all duration-300 hover:text-old-gold hover:scale-105"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Social & Email */}
                    <div className="flex items-center gap-5">
                        <a
                            href="https://instagram.com/Wel_FragranceCollection"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-warm-gray dark:text-warm-white/70 transition-all duration-300 hover:text-old-gold hover:scale-110"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="text-xl" />
                        </a>
                        <a
                            href="mailto:wel.fragrancecollection@gmail.com"
                            className="text-warm-gray dark:text-warm-white/70 transition-all duration-300 hover:text-old-gold hover:scale-110"
                            aria-label="Email"
                        >
                            <FaEnvelope className="text-xl" />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-6 pt-6 border-t border-old-gold/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] tracking-widest font-jost text-warm-gray/60 dark:text-warm-white/40">
                    <span>© {new Date().getFullYear()} Wel Fragrance Collection</span>
                    <span className="flex items-center gap-2">
                        <span className="hidden sm:inline">·</span>
                        <span>All rights reserved</span>
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;