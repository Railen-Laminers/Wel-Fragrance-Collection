// src/components/ui/FlipGallery.jsx
import { useEffect, useRef, useState } from 'react';

const defaultImages = [
  { title: 'Joshua Hibbert', url: 'https://picsum.photos/id/870/600/1000' },
  { title: 'Joshua Earle', url: 'https://picsum.photos/id/883/600/1000' },
  { title: 'Antoine Beauvillain', url: 'https://picsum.photos/id/478/600/1000' },
  { title: 'Greg Rakozy', url: 'https://picsum.photos/id/903/600/1000' },
  { title: 'Ramiro Checchi', url: 'https://picsum.photos/id/503/600/1000' },
];

const FLIP_SPEED = 750;
const flipTiming = { duration: FLIP_SPEED, iterations: 1 };

const flipAnimationTop = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
];
const flipAnimationBottom = [
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(0)' },
];
const flipAnimationTopReverse = [
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(-90deg)' },
  { transform: 'rotateX(0)' },
];
const flipAnimationBottomReverse = [
  { transform: 'rotateX(0)' },
  { transform: 'rotateX(90deg)' },
  { transform: 'rotateX(90deg)' },
];

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 6 15 12 9 18" />
  </svg>
);

export default function FlipGallery({ images = defaultImages }) {
  const containerRef = useRef(null);
  const uniteRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.unite');
    uniteRef.current = Array.from(elements);
    defineFirstImg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const defineFirstImg = () => {
    uniteRef.current.forEach(setActiveImage);
    setImageTitle();
  };

  const setActiveImage = (el) => {
    el.style.backgroundImage = `url('${images[currentIndex].url}')`;
  };

  const setImageTitle = () => {
    const gallery = containerRef.current;
    if (!gallery) return;
    gallery.setAttribute('data-title', images[currentIndex].title);
    gallery.style.setProperty('--title-y', '0');
    gallery.style.setProperty('--title-opacity', '1');
  };

  const updateGallery = (nextIndex, isReverse = false) => {
    const gallery = containerRef.current;
    if (!gallery) return;

    const topAnim = isReverse ? flipAnimationTopReverse : flipAnimationTop;
    const bottomAnim = isReverse ? flipAnimationBottomReverse : flipAnimationBottom;

    gallery.querySelector('.overlay-top')?.animate(topAnim, flipTiming);
    gallery.querySelector('.overlay-bottom')?.animate(bottomAnim, flipTiming);

    gallery.style.setProperty('--title-y', '-1rem');
    gallery.style.setProperty('--title-opacity', '0');
    gallery.setAttribute('data-title', '');

    uniteRef.current.forEach((el, idx) => {
      const delay =
        (isReverse && (idx !== 1 && idx !== 2)) ||
        (!isReverse && (idx === 1 || idx === 2))
          ? FLIP_SPEED - 200
          : 0;
      setTimeout(() => {
        el.style.backgroundImage = `url('${images[nextIndex].url}')`;
      }, delay);
    });

    setTimeout(() => {
      const galleryNow = containerRef.current;
      if (!galleryNow) return;
      galleryNow.setAttribute('data-title', images[nextIndex].title);
      galleryNow.style.setProperty('--title-y', '0');
      galleryNow.style.setProperty('--title-opacity', '1');
    }, FLIP_SPEED * 0.5);
  };

  const updateIndex = (increment) => {
    const newIndex = (currentIndex + increment + images.length) % images.length;
    const isReverse = increment < 0;
    setCurrentIndex(newIndex);
    updateGallery(newIndex, isReverse);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent font-sans">
      <div
        className="relative border border-old-gold/30 bg-old-gold/5 p-2 backdrop-blur-sm"
        style={{ '--gallery-bg-color': 'rgba(199,159,72,0.075)' }}
      >
        {/* Camera‑cursor corners */}
        <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-old-gold/50 z-20" />
        <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-old-gold/50 z-20" />

        <div
          id="flip-gallery"
          ref={containerRef}
          className="relative w-[240px] h-[400px] md:w-[300px] md:h-[500px] text-center"
          style={{ perspective: '800px' }}
        >
          <div className="top unite"></div>
          <div className="bottom unite"></div>
          <div className="overlay-top unite"></div>
          <div className="overlay-bottom unite"></div>
        </div>

        <div className="absolute top-full right-0 mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => updateIndex(-1)}
            title="Previous"
            className="text-old-gold opacity-75 hover:opacity-100 hover:scale-125 transition"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => updateIndex(1)}
            title="Next"
            className="text-old-gold opacity-75 hover:opacity-100 hover:scale-125 transition"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      <style>{`
        #flip-gallery {
          --divider-color: white; /* light mode: white */
        }

        /* Dark mode override – .dark class on html or body */
        .dark #flip-gallery {
          --divider-color: black;
        }

        #flip-gallery::after {
          content: '';
          position: absolute;
          background-color: var(--divider-color, white);
          width: 100%;
          height: 4px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 10;
        }

        #flip-gallery::before {
          content: attr(data-title);
          color: #C79F48;
          font-size: 0.75rem;
          left: -0.5rem;
          position: absolute;
          top: calc(100% + 1rem);
          line-height: 2;
          opacity: var(--title-opacity, 0);
          transform: translateY(var(--title-y, 0));
          transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
          z-index: 10;
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        #flip-gallery > * {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          background-repeat: no-repeat;
          background-size: 240px 400px;
        }

        #flip-gallery > .top,
        #flip-gallery > .overlay-top {
          top: 0;
          transform-origin: bottom;
          background-position: top;
        }

        #flip-gallery > .bottom,
        #flip-gallery > .overlay-bottom {
          bottom: 0;
          transform-origin: top;
          background-position: bottom;
        }

        @media (min-width: 600px) {
          #flip-gallery > * {
            background-size: 300px 500px;
          }
        }
      `}</style>
    </div>
  );
}