// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getFeaturedProducts } from '../../../api/products';

// Local product images (adjust paths if needed)
import Paradoxie from '@/assets/products/Paradoxie.webp';
import MorningSwim from '@/assets/products/MorningSwim.webp';
import Litz2 from '@/assets/products/Litz2.webp';

gsap.registerPlugin(ScrollTrigger);

// ---------- Helper: classNames ----------
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ---------- Helper: Stars component for Testimonials ----------
function Stars({ count }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-3 h-3 text-old-gold" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ---------- HERO Section ----------
function Hero() {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const headlineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const ctaRef = useRef(null);

  // Mouse parallax
  useEffect(() => {
    const onMouseMove = (e) => {
      if (imageWrapperRef.current) {
        const x = ((e.clientX / window.innerWidth) - 0.5) * 10;
        const y = ((e.clientY / window.innerHeight) - 0.5) * 10;
        imageWrapperRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Entrance animations
  useEffect(() => {
    const animations = [];

    const eyebrow = eyebrowRef.current;
    if (eyebrow) {
      const anim = eyebrow.animate(
        [
          { opacity: 0, transform: 'translateY(4px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 1000,
          delay: 300,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        }
      );
      animations.push(anim);
    }

    const lines = headlineRef.current?.querySelectorAll('.headline-line') || [];
    const lineDelay = 800;
    lines.forEach((line, i) => {
      const anim = line.animate(
        [
          { opacity: 0, transform: 'translateY(100%)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 1200,
          delay: lineDelay + i * 150,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        }
      );
      animations.push(anim);
    });

    const cta = ctaRef.current;
    if (cta) {
      const anim = cta.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 800,
          delay: 1700,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        }
      );
      animations.push(anim);
    }

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
      const anim = heroImage.animate(
        [
          { transform: 'scale(1.1)' },
          { transform: 'scale(1)' },
        ],
        {
          duration: 1500,
          delay: 1100,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        }
      );
      animations.push(anim);
    }

    return () => {
      animations.forEach((anim) => anim.cancel());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center z-10 pt-20 pb-16 sm:pb-20 lg:py-24 overflow-hidden bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
          {/* Left content */}
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-old-gold/40 to-transparent hidden lg:block" />
            <div className="space-y-6 sm:space-y-8">
              <div
                ref={eyebrowRef}
                className="flex items-center gap-4 opacity-0 translate-y-4"
              >
                <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                  <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                  <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                    Philippines & Canada
                  </span>
                </div>
              </div>

              <h1
                ref={headlineRef}
                className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl leading-[1.1] text-dark-teal dark:text-warm-white"
              >
                <span className="block overflow-hidden">
                  <span className="headline-line block pb-2 sm:pb-4 opacity-0 translate-y-full">
                    Every
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="headline-line block pb-2 sm:pb-4 opacity-0 translate-y-full bg-gradient-to-r from-old-gold via-[#E8D5A3] to-old-gold bg-clip-text text-transparent italic">
                    Fragrance
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className="headline-line block pb-2 sm:pb-4 opacity-0 translate-y-full">
                    Tells a Story
                  </span>
                </span>
              </h1>

              <div
                ref={ctaRef}
                className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 sm:pt-4 opacity-0 translate-y-6"
              >
                <Link
                  to="/products"
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-old-gold text-warm-white dark:text-dark-teal font-jost text-xs sm:text-sm tracking-[0.15em] uppercase font-medium overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(199,159,72,0.3)]"
                >
                  <span className="relative z-10">Explore Collection</span>
                  <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </Link>
                <Link
                  to="/about"
                  className="group flex items-center gap-3 font-jost text-xs sm:text-sm tracking-[0.15em] text-dark-teal dark:text-warm-white uppercase hover:text-old-gold transition-colors"
                >
                  <span>Our Story</span>
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
          </div>

          {/* Right image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden">
              <div className="absolute inset-4 border border-old-gold/20 z-20 pointer-events-none" />
              <div className="absolute top-4 left-4 w-6 sm:w-8 h-6 sm:h-8 border-t border-l border-old-gold/60 z-20" />
              <div className="absolute bottom-4 right-4 w-6 sm:w-8 h-6 sm:h-8 border-b border-r border-old-gold/60 z-20" />
              <div
                ref={imageWrapperRef}
                className="absolute inset-0 transition-transform duration-300 ease-out"
              >
                <img
                  src={Paradoxie}
                  alt="Luxury Perfume Collection"
                  className="hero-image w-full h-full object-cover scale-110"
                  fetchpriority="high"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-white dark:from-dark-teal via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-30 bg-warm-white/80 dark:bg-dark-teal/80 backdrop-blur-sm border border-old-gold/30 p-3 sm:p-4 max-w-[180px] sm:max-w-[220px] hidden xs:block">
                <p className="font-cormorant text-old-gold text-base sm:text-lg italic leading-snug">
                  "Every scent is a reflection of you."
                </p>
                <div className="mt-2 h-px w-full bg-gradient-to-r from-old-gold/50 to-transparent" />
                <p className="font-jost text-[10px] sm:text-xs text-warm-gray dark:text-warm-white/70 mt-1 sm:mt-2 tracking-wider uppercase">
                  — Joel Malabo, CEO
                </p>
              </div>
            </div>
            <div className="absolute -right-24 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden xl:block">
              <span
                className="font-playfair text-[14rem] leading-none text-old-gold/[0.03]"
                style={{ writingMode: 'vertical-rl' }}
              >
                WEL
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- PHILOSOPHY Section ----------
function Philosophy() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll('.philosophy-card');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse',
        },
        defaults: { ease: 'power3.out' },
      });

      gsap.set(cards, {
        y: 80,
        scale: 0.9,
        opacity: 0,
        rotationX: 10,
        transformOrigin: 'center bottom',
      });

      tl.to(cards, {
        y: 0,
        scale: 1,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.5)',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pillars = [
    {
      number: '01',
      title: 'Passion',
      desc: 'Every fragrance is born from an unwavering dedication to the art of perfumery, capturing emotions in every drop.',
    },
    {
      number: '02',
      title: 'Artistry',
      desc: "We blend nature's purest essences with masterful craftsmanship, creating compositions that transcend ordinary scents.",
    },
    {
      number: '03',
      title: 'Individuality',
      desc: 'Your scent is your signature. We design fragrances that resonate with your unique spirit and story.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 z-10 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
              <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
              <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
              <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                The Philosophy
              </span>
            </div>
          </div>

          <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white leading-tight">
            Beyond Scent, <br />
            <span className="italic text-old-gold">Timeless Experiences</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="philosophy-card group relative p-6 sm:p-8 lg:p-10 border border-old-gold/30 hover:border-old-gold/50 transition-all duration-700 bg-warm-white dark:bg-charcoal backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 border-t border-l border-old-gold/20 group-hover:border-old-gold/50 transition-colors duration-500" />
              <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 border-b border-r border-old-gold/20 group-hover:border-old-gold/50 transition-colors duration-500" />

              <span className="font-playfair text-5xl sm:text-6xl text-old-gold/30 group-hover:text-old-gold/50 transition-colors duration-500">
                {pillar.number}
              </span>
              <h3 className="font-cormorant text-xl sm:text-2xl lg:text-3xl text-dark-teal dark:text-warm-white mt-4 mb-3 sm:mb-4 group-hover:text-old-gold transition-colors duration-500">
                {pillar.title}
              </h3>
              <p className="font-inter text-warm-gray dark:text-warm-white/70 text-sm leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- PRODUCTS Section ----------
function Products() {
  const sectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const animated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;

            const cards = section.querySelectorAll('.product-card');
            const staggerDelay = 150;

            cards.forEach((card, index) => {
              card.animate(
                [
                  { opacity: 0, transform: 'translateY(80px)' },
                  { opacity: 1, transform: 'translateY(0)' },
                ],
                {
                  duration: 1000,
                  delay: index * staggerDelay,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  fill: 'forwards',
                }
              );
            });

            observer.unobserve(section);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getFeaturedProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load featured products', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 z-10 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                  The Collection
                </span>
              </div>
            </div>

            <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white">
              Signature <span className="italic text-old-gold">Fragrances</span>
            </h2>
          </div>

          <Link
            to="/products"
            className="mt-6 md:mt-0 group flex items-center gap-3 font-jost text-xs sm:text-sm tracking-[0.15em] text-dark-teal dark:text-warm-white uppercase hover:text-old-gold transition-colors"
          >
            <span>View All</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">Loading featured fragrances…</div>
          ) : products.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">No featured fragrances available right now.</div>
          ) : products.map((product, index) => (
            <div
              key={product._id || product.name}
              className="product-card group relative opacity-0 translate-y-20"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 sm:mb-6 bg-warm-white/50 dark:bg-charcoal/50 backdrop-blur-sm">
                <div className="absolute inset-4 border border-old-gold/10 z-10 pointer-events-none group-hover:border-old-gold/30 transition-colors duration-500" />
                <img
                  src={product.image || Paradoxie}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warm-white/60 dark:from-dark-teal/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {product.tag && (
                  <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
                    <span className="font-jost text-[10px] tracking-[0.2em] uppercase bg-old-gold text-warm-white dark:text-dark-teal px-3 py-1">
                      {product.tag}
                    </span>
                  </div>
                )}

                <div
                  className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 transition-all duration-500 ${hoveredIndex === index
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                    }`}
                >
                  <Link
                    to="/products"
                    className="group/btn relative w-full py-3 overflow-hidden bg-warm-white/20 dark:bg-dark-teal/20 backdrop-blur-md border border-warm-white/30 dark:border-dark-teal/30 font-jost text-xs tracking-[0.2em] uppercase text-dark-teal dark:text-warm-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(199,159,72,0.3)] flex items-center justify-center"
                  >
                    <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-warm-white dark:group-hover/btn:text-dark-teal">
                      Discover
                    </span>
                    <div className="absolute inset-0 bg-old-gold transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
                  </Link>
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h3 className="font-cormorant text-lg sm:text-xl lg:text-2xl text-dark-teal dark:text-warm-white group-hover:text-old-gold transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="font-inter text-warm-gray dark:text-warm-white/70 text-xs tracking-wide">
                  {product.notes}
                </p>
                <p className="font-jost text-old-gold text-sm tracking-wider">
                  ₱{product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- LIFESTYLE Section ----------
function Lifestyle() {
  const sectionRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;

            const text = section.querySelector('.lifestyle-text');
            if (text) {
              text.animate(
                [
                  { opacity: 0, transform: 'translateX(60px)' },
                  { opacity: 1, transform: 'translateX(0)' },
                ],
                {
                  duration: 1200,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  fill: 'forwards',
                }
              );
            }

            const image = section.querySelector('.lifestyle-image');
            if (image) {
              image.animate(
                [
                  { opacity: 0, transform: 'translateX(-60px)' },
                  { opacity: 1, transform: 'translateX(0)' },
                ],
                {
                  duration: 1200,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  fill: 'forwards',
                }
              );
            }

            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 z-10 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          <div className="lifestyle-image relative opacity-0 -translate-x-16">
            <div className="relative aspect-[4/5] overflow-hidden bg-warm-white/50 dark:bg-charcoal/50 backdrop-blur-sm">
              <div className="absolute inset-4 border border-old-gold/20 z-10 pointer-events-none" />
              <div className="absolute top-4 left-4 w-10 h-10 sm:w-12 sm:h-12 border-t border-l border-old-gold/40 z-10" />
              <div className="absolute bottom-4 right-4 w-10 h-10 sm:w-12 sm:h-12 border-b border-r border-old-gold/40 z-10" />

              <img
                src={MorningSwim}
                alt="Luxury Lifestyle"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warm-white/60 dark:from-dark-teal/60 via-transparent to-transparent opacity-60" />
            </div>

            <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 lg:-left-12 z-20 bg-warm-white/80 dark:bg-dark-teal/80 backdrop-blur-sm border border-old-gold/30 p-4 sm:p-6 max-w-[200px] sm:max-w-[240px]">
              <p className="font-cormorant text-old-gold text-base sm:text-lg italic leading-snug">
                "Because every scent is a reflection of you."
              </p>
              <div className="mt-2 h-px w-full bg-gradient-to-r from-old-gold/50 to-transparent" />
              <p className="font-jost text-[10px] sm:text-xs text-warm-gray dark:text-warm-white/70 mt-1 sm:mt-2 tracking-wider uppercase">
                — Wel Philosophy
              </p>
            </div>
          </div>

          <div className="lifestyle-text space-y-6 sm:space-y-8 opacity-0 translate-x-16">
            <div className="flex items-center gap-4">
              <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                  The Lifestyle
                </span>
              </div>
            </div>

            <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white leading-tight">
              A Scent for <br />
              <span className="italic text-old-gold">Every Moment</span>
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <p className="font-inter text-warm-gray dark:text-warm-white/70 leading-relaxed text-sm sm:text-base">
                Whether you're seeking a signature fragrance or a gift to celebrate life's moments,
                Wel Fragrance Collection invites you to explore the world of evocative aromas
                designed to resonate with your spirit.
              </p>
              <p className="font-inter text-warm-gray dark:text-warm-white/70 leading-relaxed text-sm sm:text-base">
                From intimate evenings to grand celebrations, our curated scents accompany you
                through every chapter of your story — leaving an impression that lasts long after
                you've left the room.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-old-gold/10">
              <div>
                <span className="font-cormorant text-2xl sm:text-3xl lg:text-4xl text-old-gold">50+</span>
                <p className="font-jost text-[10px] tracking-[0.2em] text-warm-gray dark:text-warm-white/70 uppercase mt-1 sm:mt-2">
                  Unique Scents
                </p>
              </div>
              <div>
                <span className="font-cormorant text-2xl sm:text-3xl lg:text-4xl text-old-gold">2</span>
                <p className="font-jost text-[10px] tracking-[0.2em] text-warm-gray dark:text-warm-white/70 uppercase mt-1 sm:mt-2">
                  Countries
                </p>
              </div>
              <div>
                <span className="font-cormorant text-2xl sm:text-3xl lg:text-4xl text-old-gold">100%</span>
                <p className="font-jost text-[10px] tracking-[0.2em] text-warm-gray dark:text-warm-white/70 uppercase mt-1 sm:mt-2">
                  Handcrafted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- TESTIMONIALS Section ----------
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

function Testimonials() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const imageRefs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/testimonials/public`);
        const data = await response.json();
        setTestimonialsData(data);
      } catch (error) {
        console.error('Failed to load testimonials', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const testimonialsImages = [
    { imgSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300', alt: 'Professional Man' },
    { imgSrc: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300', alt: 'Smiling Man' },
    { imgSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300', alt: 'Professional Woman' },
    { imgSrc: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300', alt: 'Smiling Woman' },
    { imgSrc: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300', alt: 'Man in a suit' },
    { imgSrc: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300', alt: 'Bearded Man' },
    { imgSrc: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=300', alt: 'Man in a blue shirt' },
    { imgSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300', alt: 'Older Man' },
    { imgSrc: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=300', alt: 'Woman with curly hair' },
    { imgSrc: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300', alt: 'Woman in an office' },
    { imgSrc: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300', alt: 'Woman with glasses' },
    { imgSrc: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300', alt: 'Woman with a dog' },
  ];

  const imagePositions = [
    { top: '5%', left: '12%', className: 'hidden lg:block w-24 h-24' },
    { top: '12%', left: '32%', className: 'hidden md:block w-20 h-20' },
    { top: '4%', left: '55%', className: 'hidden md:block w-16 h-16' },
    { top: '8%', right: '12%', className: 'hidden lg:block w-28 h-28' },
    { top: '22%', right: '4%', className: 'hidden md:block w-20 h-20' },
    { top: '42%', right: '8%', className: 'hidden lg:block w-24 h-24' },
    { top: '48%', left: '4%', className: 'hidden md:block w-28 h-28' },
    { bottom: '5%', left: '18%', className: 'hidden lg:block w-20 h-20' },
    { bottom: '12%', left: '42%', className: 'hidden md:block w-16 h-16' },
    { bottom: '8%', right: '28%', className: 'hidden md:block w-24 h-24' },
    { bottom: '2%', right: '12%', className: 'hidden lg:block w-20 h-20' },
    { top: '8%', left: '12%', className: 'block md:hidden w-16 h-16' },
    { top: '6%', right: '12%', className: 'block md:hidden w-16 h-16' },
    { top: '28%', left: '16%', className: 'block md:hidden w-16 h-16' },
    { top: '26%', right: '16%', className: 'block md:hidden w-16 h-16' },
    { top: '48%', left: '10%', className: 'block md:hidden w-16 h-16' },
    { top: '46%', right: '10%', className: 'block md:hidden w-16 h-16' },
    { bottom: '14%', left: '14%', className: 'block md:hidden w-16 h-16' },
    { bottom: '12%', right: '14%', className: 'block md:hidden w-16 h-16' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      imageRefs.current.filter(Boolean).forEach((el, i) => {
        const delay = 0.1 + i * 0.08;
        gsap.from(el, {
          opacity: 0,
          scale: 0.5,
          duration: 0.9,
          delay: delay,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [testimonialsData.length, loading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleImageClick = (index) => {
    if (window.innerWidth < 1024) {
      setSelectedIndex(index);
      setIsModalOpen(true);
    }
  };

  const displayedTestimonials = testimonialsData.slice(0, imagePositions.length);
  const selectedTestimonial = selectedIndex !== null ? displayedTestimonials[selectedIndex] : null;
  const selectedImage = selectedIndex !== null ? testimonialsImages[selectedIndex % testimonialsImages.length] : null;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 z-10 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headingRef} className="text-center mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
            <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
              <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
              <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
              <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                Testimonials
              </span>
            </div>
          </div>
          <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white leading-tight">
            Voices of <span className="italic text-old-gold">Elegance</span>
          </h2>
        </div>

        <div className="relative w-full" style={{ minHeight: '650px' }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-warm-gray dark:text-warm-white/70">Loading testimonials…</div>
          ) : testimonialsData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-center text-sm text-warm-gray dark:text-warm-white/70 px-6">
              No approved testimonials yet. Be the first to share your story.
            </div>
          ) : (
            <>
              <div className="absolute inset-0">
                {displayedTestimonials.map((testimonial, index) => {
                  const pos = imagePositions[index];
                  const image = testimonialsImages[index % testimonialsImages.length];
                  const floatDuration = 4 + Math.random() * 5;
                  const floatDelay = Math.random() * 2;
                  const floatStyle = {
                    animation: `float ${floatDuration}s ease-in-out ${floatDelay}s infinite alternate`,
                    willChange: 'transform',
                  };

                  return (
                    <div
                      key={testimonial._id || `${testimonial.firstName}-${index}`}
                      ref={(el) => (imageRefs.current[index] = el)}
                      className={cn(
                        'absolute rounded-lg shadow-xl border-2 border-old-gold/10 hover:border-old-gold/30 transition-all duration-300 group cursor-pointer',
                        pos.className
                      )}
                      style={{
                        top: pos.top,
                        left: pos.left,
                        right: pos.right,
                        bottom: pos.bottom,
                        ...floatStyle,
                      }}
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={getImageUrl(testimonial.profilePicture) || image.imgSrc}
                        alt={testimonial.firstName || image.alt}
                        loading="lazy"
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                      />

                      <div
                        className={cn(
                          'hidden lg:block absolute z-30 w-56 p-3 rounded-lg bg-warm-white/95 dark:bg-charcoal/95 backdrop-blur-sm border border-old-gold/20 shadow-xl transition-all duration-300',
                          'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2',
                          'opacity-0 pointer-events-none',
                          'group-hover:opacity-100 group-hover:pointer-events-auto group-hover:-translate-y-1'
                        )}
                        style={{ transformOrigin: 'bottom center' }}
                      >
                        <Stars count={testimonial.rating} />
                        <blockquote className="mt-1.5 font-cormorant italic text-xs sm:text-sm text-dark-teal dark:text-warm-white leading-snug text-center">
                          "{testimonial.message}"
                        </blockquote>
                        <div className="mt-2 text-center">
                          <p className="font-jost text-[9px] sm:text-[10px] tracking-[0.15em] text-old-gold uppercase">
                            {testimonial.firstName} {testimonial.lastName}
                          </p>
                          <p className="font-inter text-warm-gray dark:text-warm-white/60 text-[9px] sm:text-[10px] mt-0.5">
                            {testimonial.email}
                          </p>
                        </div>
                        <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-warm-white/95 dark:bg-charcoal/95 border-r border-b border-old-gold/20" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <Link
                  to="/contact?form=testimonial"
                  className="pointer-events-auto group relative px-8 sm:px-12 py-4 sm:py-5 bg-old-gold text-warm-white dark:text-dark-teal font-jost text-sm sm:text-base tracking-[0.15em] uppercase font-medium overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(199,159,72,0.3)]"
                >
                  <span className="relative z-10">Share Your Story</span>
                  <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {isModalOpen && selectedTestimonial && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white dark:bg-charcoal rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-warm-gray/20 dark:hover:bg-warm-white/10 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 text-dark-teal dark:text-warm-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              <img
                src={getImageUrl(selectedTestimonial.profilePicture) || selectedImage.imgSrc}
                alt={selectedTestimonial.firstName || selectedImage.alt}
                loading="lazy"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-old-gold/20 shadow-lg mb-4"
              />
              <Stars count={selectedTestimonial.rating} />
              <blockquote className="mt-4 font-cormorant italic text-lg sm:text-xl text-dark-teal dark:text-warm-white leading-relaxed">
                "{selectedTestimonial.message}"
              </blockquote>
              <div className="mt-4">
                <p className="font-jost text-xs sm:text-sm tracking-[0.15em] text-old-gold uppercase">
                  {selectedTestimonial.firstName} {selectedTestimonial.lastName}
                </p>
                <p className="font-inter text-warm-gray dark:text-warm-white/60 text-xs sm:text-sm mt-0.5">
                  {selectedTestimonial.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}

// ---------- FAQ Section ----------
function FAQ() {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const faqs = [
    {
      question: 'What makes Wel fragrances unique?',
      answer:
        "Each Wel fragrance is handcrafted with nature's purest essences, inspired by the vision of our CEO Joel Malabo. We blend traditional perfumery techniques with modern innovation to create scents that are both timeless and deeply personal.",
    },
    {
      question: 'Do you ship to both the Philippines and Canada?',
      answer:
        'Yes, we proudly ship to all regions of the Philippines and across Canada. We offer express shipping options to ensure your fragrance arrives in perfect condition, no matter where you are.',
    },
    {
      question: 'How do I choose my signature scent?',
      answer:
        'We recommend exploring our fragrance families — Floral, Oriental, Woody, and Fresh. Each scent is designed to resonate with different personalities and moods. You can also visit our boutiques for a personalized consultation.',
    },
    {
      question: 'Are Wel fragrances suitable as gifts?',
      answer:
        'Absolutely. Every Wel fragrance comes in elegant, gift-ready packaging. We also offer complimentary gift wrapping and personalized message cards to make your gift truly special.',
    },
    {
      question: 'What is your return policy?',
      answer:
        "We stand behind the quality of our fragrances. If you're not completely satisfied, you may return unopened products within 14 days for a full refund. Opened products can be exchanged within 7 days.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 z-10 bg-transparent"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
            <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
              <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
              <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
              <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                Questions
              </span>
            </div>
          </div>

          <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl text-dark-teal dark:text-warm-white">
            Frequently <span className="italic text-old-gold">Asked</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item border border-old-gold/10 hover:border-old-gold/20 transition-colors duration-300 bg-warm-white/70 dark:bg-charcoal/70 backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-6 lg:p-8 text-left group"
              >
                <span className="font-cormorant text-base sm:text-lg lg:text-xl text-dark-teal dark:text-warm-white group-hover:text-old-gold transition-colors duration-300 pr-6 sm:pr-8">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 border border-old-gold/30 flex items-center justify-center transition-all duration-500 ${openIndex === index ? 'bg-old-gold border-old-gold rotate-45' : ''
                    }`}
                >
                  <svg
                    className={`w-3 h-3 transition-colors duration-300 ${openIndex === index
                      ? 'text-warm-white dark:text-dark-teal'
                      : 'text-old-gold'
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                  <div className="h-px w-full bg-old-gold/10 mb-4" />
                  <p className="font-inter text-warm-gray dark:text-warm-white/70 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- CTA Section ----------
function CTA() {
  const sectionRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;

            const content = section.querySelector('.cta-content');
            if (content) {
              content.animate(
                [
                  { opacity: 0, transform: 'scale(0.95)' },
                  { opacity: 1, transform: 'scale(1)' },
                ],
                {
                  duration: 1200,
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  fill: 'forwards',
                }
              );
            }

            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 z-10 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cta-content relative overflow-hidden opacity-0 scale-95">
          <div className="absolute inset-0">
            <img
              src={Litz2}
              alt="Fragrance Background"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-warm-white/60 dark:bg-dark-teal/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-warm-white/70 dark:from-dark-teal/70 via-warm-white/60 dark:via-dark-teal/60 to-transparent" />
          </div>

          <div className="relative z-10 py-16 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <div className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5">
                  <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-old-gold/60" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-old-gold/60" />
                  <span className="font-jost text-[10px] sm:text-xs tracking-[0.3em] text-old-gold uppercase whitespace-nowrap">
                    Begin Your Journey
                  </span>
                </div>
              </div>

              <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-dark-teal dark:text-warm-white leading-tight mb-4 sm:mb-6">
                Discover Your <br />
                <span className="italic text-old-gold">Signature Scent</span>
              </h2>

              <p className="font-inter text-warm-gray dark:text-warm-white/70 leading-relaxed text-sm sm:text-base mb-6 sm:mb-10 max-w-lg">
                Whether you're seeking a signature fragrance or a gift to celebrate life's
                moments, Wel Fragrance Collection invites you to explore the world of evocative
                aromas designed to resonate with your spirit.
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <Link
                  to="/products"
                  className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-old-gold text-warm-white dark:text-dark-teal font-jost text-xs sm:text-sm tracking-[0.15em] uppercase font-medium overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(199,159,72,0.3)]"
                >
                  <span className="relative z-10">Shop Now</span>
                  <div className="absolute inset-0 bg-dark-teal dark:bg-warm-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </Link>
                <Link
                  to="/contact"
                  className="group flex items-center gap-3 font-jost text-xs sm:text-sm tracking-[0.15em] text-dark-teal dark:text-warm-white uppercase hover:text-old-gold transition-colors"
                >
                  <span>Contact Us</span>
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
          </div>

          <div className="absolute top-8 right-8 w-16 h-16 sm:w-20 sm:h-20 border-t border-r border-old-gold/20 hidden lg:block" />
          <div className="absolute bottom-8 right-8 w-16 h-16 sm:w-20 sm:h-20 border-b border-r border-old-gold/20 hidden lg:block" />
        </div>
      </div>
    </section>
  );
}

// ---------- MAIN HOME COMPONENT ----------
export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-dark-teal dark:text-warm-white">
      <Hero />
      <Philosophy />
      <Products />
      <Lifestyle />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}