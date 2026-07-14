import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

import DSC09790 from '@/assets/models/DSC09790.webp';
import NicolHero from '@/assets/products/NicolHero.webp';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const pageRef = useRef(null);
    const heroImageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero entrance
            gsap.from('.about-eyebrow', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', delay: 0.2 });
            gsap.from('.about-headline', { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', delay: 0.3 });
            gsap.from('.about-hero-text', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.5 });
            gsap.from('.about-hero-img', { opacity: 0, x: 60, duration: 1.2, ease: 'power3.out', delay: 0.4 });

            gsap.to('.about-hero-img-inner', {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroImageRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Story section
            gsap.from('.story-quote', { opacity: 0, x: -40, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.story-quote', start: 'top 80%' } });
            gsap.from('.story-text', { opacity: 0, y: 40, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.story-text', start: 'top 80%' } });
            gsap.from('.story-highlight', { opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.story-highlight', start: 'top 85%' } });

            // Mission & Vision header
            gsap.from('.mv-header', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.mv-header', start: 'top 85%' } });

            const mvCards = document.querySelectorAll('.mv-card');
            gsap.set(mvCards, {
                y: 60,
                opacity: 0,
            });
            gsap.to(mvCards, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.mv-grid',
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                },
            });

            // Values header
            gsap.from('.values-header', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.values-header', start: 'top 85%' } });

            const cards = document.querySelectorAll('.value-card');
            gsap.set(cards, {
                y: 80,
                scale: 0.9,
                opacity: 0,
                rotationX: 10,
                transformOrigin: 'center bottom',
            });
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.values-grid',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play reverse play reverse',
                },
                defaults: { ease: 'back.out(1.5)' },
            });
            tl.to(cards, {
                y: 0,
                scale: 1,
                opacity: 1,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.2,
            });

            // CEO section
            gsap.from('.ceo-content', {
                opacity: 0,
                y: 40,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.ceo-section',
                    start: 'top 80%',
                },
            });

            // CTA
            gsap.from('.about-cta-eyebrow', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about-cta', start: 'top 85%' } });
            gsap.from('.about-cta-headline', { opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.about-cta', start: 'top 80%' } });
            gsap.from('.about-cta-text', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about-cta', start: 'top 75%' } });
            gsap.from('.about-cta-buttons', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.about-cta', start: 'top 70%' } });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    const values = [
        {
            title: 'Heritage',
            desc: 'Rooted in the rich botanical traditions of Southeast Asia and the refined craftsmanship of French perfumery, honoring the lands that inspire our creations.',
        },
        {
            title: 'Intention',
            desc: 'Every bottle is created with purpose—designed to evoke memory, emotion, and a sense of place, crafted to resonate with the soul.',
        },
        {
            title: 'Rarity',
            desc: 'Small-batch production ensures that each fragrance remains as unique as the individual who wears it, a limited expression of artistry.',
        },
    ];

    return (
        <div ref={pageRef} className="min-h-screen bg-transparent pt-20 sm:pt-24 md:pt-32 overflow-x-hidden">
            {/* ===== HERO ===== */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-32">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="flex items-center gap-4 mb-6 about-eyebrow">
                            <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                                <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                                <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                                    About Us
                                </span>
                            </div>
                        </div>

                        <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-dark-teal dark:text-warm-white leading-[0.95] mb-6 sm:mb-8 about-headline break-words">
                            Between Two <br />
                            <em className="italic text-old-gold">Shores</em>
                        </h1>

                        <p className="font-inter text-base sm:text-lg text-warm-gray dark:text-warm-white/70 leading-relaxed max-w-lg about-hero-text">
                            At <span className="text-dark-teal dark:text-warm-white font-medium">Wel Fragrance Collection</span>,
                            we believe that every fragrance tells a story—a story of passion, artistry, and
                            individuality. Inspired by nature's purest essences and the beauty of human emotion,
                            we create perfumes that go beyond scent, delivering timeless experiences that leave
                            lasting memories.
                        </p>
                    </div>

                    <div ref={heroImageRef} className="order-1 lg:order-2 relative about-hero-img">
                        <div className="relative aspect-[4/5] overflow-hidden bg-warm-white/30 dark:bg-charcoal/30 backdrop-blur-sm">
                            <div className="absolute inset-4 border border-old-gold/20 z-10 pointer-events-none" />
                            <div className="absolute top-4 left-4 w-8 h-8 sm:w-10 sm:h-10 border-t border-l border-old-gold/50 z-10" />
                            <div className="absolute bottom-4 right-4 w-8 h-8 sm:w-10 sm:h-10 border-b border-r border-old-gold/50 z-10" />

                            <img
                                src={NicolHero}
                                alt="Wel Fragrance Atelier"
                                className="about-hero-img-inner w-full h-full object-cover scale-110 max-w-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-warm-white/40 dark:from-dark-teal/40 via-transparent to-transparent opacity-40" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== OUR HISTORY ===== */}
            <section className="relative py-16 sm:py-24 lg:py-32 bg-warm-white/20 dark:bg-charcoal/20 backdrop-blur-sm border-y border-old-gold/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-20">
                        <div className="lg:col-span-5">
                            <div className="lg:sticky lg:top-32 story-quote">
                                <div className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white leading-tight italic break-words">
                                    "I wanted to discover a scent that would be known in every corner of the Philippines and Canada."
                                </div>
                                <div className="mt-6 sm:mt-8 flex items-center gap-4">
                                    <div className="h-px w-12 bg-old-gold/40" />
                                    <div>
                                        <p className="font-jost text-xs sm:text-sm tracking-[0.15em] text-dark-teal dark:text-warm-white uppercase">
                                            Joel Malabo
                                        </p>
                                        <p className="font-inter text-xs text-warm-gray dark:text-warm-white/70 mt-1">
                                            Founder &amp; CEO, Wel Fragrance Collection
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                            <p className="font-inter text-base sm:text-lg text-warm-gray dark:text-warm-white/70 leading-relaxed story-text break-words">
                                Our journey began with the vision of our CEO, <strong className="text-dark-teal dark:text-warm-white">Joel Malabo</strong>,
                                to create a fragrance brand that would be recognized throughout the Philippines
                                and Canada. Every bottle reflects his determination, dreams, and deep love for
                                his family. His passion continues to inspire our commitment to quality, creativity,
                                and excellence.
                            </p>

                            <p className="font-inter text-base sm:text-lg text-warm-gray dark:text-warm-white/70 leading-relaxed story-text break-words">
                                What started as a personal quest to capture the essence of home has evolved into
                                a house of perfumery that serves both nations, bridging cultures through the
                                universal language of scent. We work with master perfumers in Grasse and local
                                artisans in Southeast Asia to source rare botanicals—vetiver from Java, ylang‑ylang
                                from the Philippines, cedar from the Laurentians. Our atelier operates on a
                                small‑batch philosophy, producing no more than five hundred bottles of any given
                                fragrance.
                            </p>

                            <div className="relative p-6 sm:p-8 lg:p-10 border border-old-gold/10 bg-warm-white/30 dark:bg-dark-teal/30 backdrop-blur-sm story-highlight">
                                <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-old-gold/30" />
                                <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-old-gold/30" />
                                <p className="font-cormorant text-xl sm:text-2xl lg:text-3xl text-old-gold italic leading-snug break-words">
                                    "Each bottle reflects his determination, dreams, and the love for his family."
                                </p>
                            </div>

                            <p className="font-inter text-base sm:text-lg text-warm-gray dark:text-warm-white/70 leading-relaxed story-text break-words">
                                We believe in the power of scent to connect people, inspire creativity, and
                                promote well‑being. Through a commitment to sustainability, ethical sourcing,
                                artistry, and innovation, we create signature fragrances that resonate with the
                                soul.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== MISSION & VISION ===== */}
            <section className="relative py-16 sm:py-24 lg:py-32 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-20 mv-header">
                        <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
                            <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                                <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                                <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                                    Our Calling
                                </span>
                            </div>
                        </div>
                        <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white break-words">
                            Mission &amp; <span className="italic text-old-gold">Vision</span>
                        </h2>
                    </div>

                    <div className="mv-grid grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                        {/* Mission */}
                        <div className="mv-card relative p-6 sm:p-8 lg:p-10 border border-old-gold/10 hover:border-old-gold/30 transition-all duration-700 bg-warm-white/30 dark:bg-charcoal/30 backdrop-blur-sm h-full">
                            <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t border-l border-old-gold/20 group-hover:border-old-gold/50 transition-colors" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b border-r border-old-gold/20 group-hover:border-old-gold/50 transition-colors" />
                            <div className="flex items-center gap-3 mb-4">
                                <span className="font-playfair text-3xl sm:text-4xl text-old-gold/20">◆</span>
                                <h3 className="font-cormorant text-2xl sm:text-3xl text-dark-teal dark:text-warm-white">
                                    Mission
                                </h3>
                            </div>
                            <p className="font-inter text-sm sm:text-base text-warm-gray dark:text-warm-white/70 leading-relaxed break-words">
                                We are dedicated to crafting exceptional fragrances that evoke emotions, tell
                                meaningful stories, and enhance the beauty of everyday life. We believe in the
                                power of scent to connect people, inspire creativity, and promote well‑being.
                                Through a commitment to sustainability, ethical sourcing, artistry, and innovation,
                                we create signature fragrances that resonate with the soul. Our mission is to
                                elevate personal expression through fragrance, empowering everyone to discover
                                and embrace their unique identity through scent.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="mv-card relative p-6 sm:p-8 lg:p-10 border border-old-gold/10 hover:border-old-gold/30 transition-all duration-700 bg-warm-white/30 dark:bg-charcoal/30 backdrop-blur-sm h-full">
                            <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t border-l border-old-gold/20 group-hover:border-old-gold/50 transition-colors" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b border-r border-old-gold/20 group-hover:border-old-gold/50 transition-colors" />
                            <div className="flex items-center gap-3 mb-4">
                                <span className="font-playfair text-3xl sm:text-4xl text-old-gold/20">◇</span>
                                <h3 className="font-cormorant text-2xl sm:text-3xl text-dark-teal dark:text-warm-white">
                                    Vision
                                </h3>
                            </div>
                            <p className="font-inter text-sm sm:text-base text-warm-gray dark:text-warm-white/70 leading-relaxed break-words">
                                We envision a world where fragrance transcends mere scent and becomes a universal
                                language of connection, emotion, and self‑expression. Our aspiration is to be a
                                leading fragrance brand recognized for innovative creations, exceptional quality,
                                and a strong commitment to sustainability. We strive to inspire individuals to
                                celebrate their unique identities through the art of fragrance while fostering a
                                deeper appreciation for life's beauty and richness. Our goal is to make premium
                                fragrances accessible at an affordable price, ensuring that every scent tells a
                                story and every moment is enriched by the power of fragrance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== VALUES ===== */}
            <section className="relative py-16 sm:py-24 lg:py-32 bg-warm-white/20 dark:bg-charcoal/20 backdrop-blur-sm border-y border-old-gold/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-20 values-header">
                        <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
                            <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                                <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                                <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                                    Principles
                                </span>
                            </div>
                        </div>
                        <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white break-words">
                            Guided by <span className="italic text-old-gold">Purpose</span>
                        </h2>
                    </div>

                    <div className="values-grid grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                        {values.map((val, i) => (
                            <div
                                key={val.title}
                                className="value-card group relative p-6 sm:p-8 lg:p-10 border border-old-gold/10 hover:border-old-gold/30 transition-all duration-700 bg-warm-white/30 dark:bg-charcoal/30 backdrop-blur-sm h-full"
                            >
                                <div className="absolute top-0 left-0 w-8 h-8 sm:w-10 sm:h-10 border-t border-l border-old-gold/20 group-hover:border-old-gold/50 transition-colors" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 border-b border-r border-old-gold/20 group-hover:border-old-gold/50 transition-colors" />

                                <span className="font-playfair text-4xl sm:text-5xl text-old-gold/10 group-hover:text-old-gold/20 transition-colors">
                                    0{i + 1}
                                </span>
                                <h3 className="font-cormorant text-xl sm:text-2xl text-dark-teal dark:text-warm-white mt-3 sm:mt-4 mb-2 sm:mb-3 group-hover:text-old-gold transition-colors break-words">
                                    {val.title}
                                </h3>
                                <p className="font-inter text-warm-gray dark:text-warm-white/70 text-sm leading-relaxed break-words">
                                    {val.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CEO / FOUNDER ===== */}
            <section className="ceo-section relative py-16 sm:py-24 lg:py-32 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="ceo-content grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
                        <div className="order-2 lg:order-1 space-y-4 sm:space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                                    <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                                    <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                                        The Visionary
                                    </span>
                                </div>
                            </div>

                            <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white leading-tight break-words">
                                Joel <span className="italic text-old-gold">Malabo</span>
                            </h2>
                            <p className="font-jost text-xs sm:text-sm tracking-[0.15em] text-warm-gray dark:text-warm-white/70 uppercase">
                                Founder &amp; CEO, Wel Fragrance Collection
                            </p>

                            <div className="space-y-3 sm:space-y-4 text-warm-gray dark:text-warm-white/70 leading-relaxed">
                                <p className="font-inter text-sm sm:text-base break-words">
                                    Joel Malabo is a first‑generation Filipino‑Canadian entrepreneur whose journey
                                    from Manila to Montreal shaped his unique perspective on scent and memory. With a
                                    background in international business and a lifelong passion for the art of
                                    perfumery, he founded Wel to bridge the cultures that define him.
                                </p>
                                <p className="font-inter text-sm sm:text-base break-words">
                                    His vision is rooted in a simple yet profound belief: that fragrance has the
                                    power to evoke emotion, preserve memory, and connect us to the people and places
                                    we love. Every bottle in the Wel collection is a reflection of his determination,
                                    his dreams, and his deep love for his family.
                                </p>
                            </div>

                            <blockquote className="relative pl-4 sm:pl-6 border-l-2 border-old-gold/40 italic font-cormorant text-lg sm:text-xl text-old-gold break-words">
                                "Every scent tells a story—and every story deserves to be remembered."
                            </blockquote>
                        </div>

                        <div className="order-1 lg:order-2 relative">
                            <div className="relative aspect-[4/5] overflow-hidden bg-warm-white/30 dark:bg-charcoal/30 backdrop-blur-sm">
                                <div className="absolute inset-4 border border-old-gold/20 z-10 pointer-events-none" />
                                <div className="absolute top-4 left-4 w-8 h-8 sm:w-10 sm:h-10 border-t border-l border-old-gold/50 z-10" />
                                <div className="absolute bottom-4 right-4 w-8 h-8 sm:w-10 sm:h-10 border-b border-r border-old-gold/50 z-10" />
                                <img
                                    src={DSC09790}
                                    alt="Joel Malabo, Founder & CEO"
                                    className="w-full h-full object-cover max-w-full"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-warm-white/40 dark:from-dark-teal/40 via-transparent to-transparent opacity-40" />
                            </div>
                            <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 lg:-left-8 z-20 bg-warm-white/80 dark:bg-dark-teal/80 backdrop-blur-sm border border-old-gold/30 p-3 sm:p-4 max-w-[160px] sm:max-w-[200px]">
                                <p className="font-jost text-[10px] tracking-[0.2em] text-old-gold uppercase">
                                    From Manila to Montreal
                                </p>
                                <div className="mt-2 h-px w-full bg-gradient-to-r from-old-gold/50 to-transparent" />
                                <p className="font-inter text-[10px] sm:text-xs text-warm-gray dark:text-warm-white/70 mt-1 sm:mt-2 break-words">
                                    A journey of scent and soul.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA (INVITATION) ===== */}
            <section className="about-cta relative py-16 sm:py-24 lg:py-32 bg-warm-white/20 dark:bg-charcoal/20 backdrop-blur-sm border-y border-old-gold/10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6 about-cta-eyebrow">
                        <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                            <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                            <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                                The Invitation
                            </span>
                        </div>
                    </div>

                    <h2 className="about-cta-headline font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white leading-tight mb-4 sm:mb-8 break-words">
                        Because at Wel, <br />
                        <span className="italic text-old-gold">Every Scent is a Reflection of You</span>
                    </h2>

                    <p className="about-cta-text font-inter text-sm sm:text-base text-warm-gray dark:text-warm-white/70 leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-10 break-words">
                        Whether you are searching for your signature fragrance or a meaningful gift to celebrate
                        life's special moments, Wel Fragrance Collection invites you to explore a world of
                        captivating aromas designed to resonate with your spirit. Because at Wel Fragrance
                        Collection, every scent is a reflection of you.
                    </p>

                    <div className="about-cta-buttons flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        <Link
                            to="/products"
                            className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-old-gold text-warm-white dark:text-dark-teal font-jost text-xs sm:text-sm tracking-[0.15em] uppercase font-medium overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(199,159,72,0.3)]"
                        >
                            <span className="relative z-10">Explore Collection</span>
                            <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        </Link>

                        <Link
                            to="/contact"
                            className="group flex items-center gap-3 font-jost text-xs sm:text-sm tracking-[0.15em] text-dark-teal dark:text-warm-white uppercase hover:text-old-gold transition-colors"
                        >
                            <span>Get in Touch</span>
                            <svg
                                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}