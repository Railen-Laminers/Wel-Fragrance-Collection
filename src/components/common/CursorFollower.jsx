import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CursorFollower() {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        setIsTouchDevice(touchDevice);

        if (touchDevice) {
            return;
        }

        const cursor = cursorRef.current;
        const dot = dotRef.current;
        if (!cursor || !dot) return;

        const onMouseMove = (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' });
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        };

        const onEnter = () => {
            gsap.to(cursor, { scale: 2.5, opacity: 0.15, duration: 0.3 });
            gsap.to(dot, { scale: 0, duration: 0.3 });
        };

        const onLeave = () => {
            gsap.to(cursor, { scale: 1, opacity: 0.5, duration: 0.3 });
            gsap.to(dot, { scale: 1, duration: 0.3 });
        };

        window.addEventListener('mousemove', onMouseMove);

        const addListeners = () => {
            const els = document.querySelectorAll('a, button, [data-cursor="pointer"]');
            els.forEach(el => {
                el.addEventListener('mouseenter', onEnter);
                el.addEventListener('mouseleave', onLeave);
            });
            return els;
        };

        let elements = addListeners();
        const observer = new MutationObserver(() => {
            elements.forEach(el => {
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
            });
            elements = addListeners();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            observer.disconnect();
            elements.forEach(el => {
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
            });
        };
    }, []);

    if (isTouchDevice) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-old-gold pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference opacity-50 hidden md:block"
            />
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-1 h-1 rounded-full bg-old-gold pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
            />
        </>
    );
}