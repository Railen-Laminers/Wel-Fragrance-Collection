import React, { useEffect, useRef } from 'react';

/**
 * ============================================================================
 *  GlobalParticles — "Gold Foil Lines" ambient background
 * ----------------------------------------------------------------------------
 *  A minimal, luxurious background for the Wel Fragrance Collection site:
 *  thin horizontal gold foil lines, staggered like the linework on an
 *  expensive invitation card, that slowly wave and catch a soft moving
 *  shimmer — like foil catching light as it tilts.
 *
 *    ──────────────
 *            ──────────────
 *    ──────────────
 *
 *  Drop-in replacement: same export name, same fixed full-viewport canvas,
 *  same non-interactive layering (pointer-events: none, z-index: 0).
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Tunable constants
// ---------------------------------------------------------------------------
const LINE_COUNT = 12;              // how many foil lines are on screen
const LINE_MIN_WIDTH_RATIO = 0.22;  // shortest line, as a fraction of viewport width
const LINE_MAX_WIDTH_RATIO = 0.5;   // longest line, as a fraction of viewport width
const WAVE_AMPLITUDE = 3.5;         // how far a line bows, in px — kept subtle
const WAVE_SPEED = 0.000025;        // how quickly the wave itself evolves — very slow
const DRIFT_SPEED = 0.00035;        // very slow horizontal drift of each line
const DRIFT_RANGE = 18;             // px range of that horizontal drift
const SHIMMER_SPEED = 0.00003;      // how fast the light-catch sweep travels — very slow
const SHIMMER_WIDTH = 0.22;         // width of the bright sweep, as a fraction of line length
const BASE_ALPHA = 0.22;            // resting opacity of the foil line
const SHIMMER_ALPHA = 0.85;         // peak opacity where the "light" catches the foil
const SEGMENTS = 16;                // curve resolution per line — enough for a smooth bow at this amplitude

// Warm gold foil palette
const GOLD_BASE = '199, 159, 72';       // muted gold, the line's resting color
const GOLD_HIGHLIGHT = '255, 236, 196'; // bright warm highlight for the shimmer sweep

// Pre-built color strings — computed once instead of on every frame/line,
// since only the shimmer's position changes frame to frame, not its color.
const COLOR_EDGE = `rgba(${GOLD_BASE}, ${BASE_ALPHA * 0.3})`;
const COLOR_MID = `rgba(${GOLD_BASE}, ${BASE_ALPHA})`;
const COLOR_HIGHLIGHT = `rgba(${GOLD_HIGHLIGHT}, ${SHIMMER_ALPHA})`;

const useGoldFoilLines = (canvasRef) => {
    useEffect(() => {
        let animationId;
        let cleanupFn;

        const init = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let lines = [];
        let width = 0;
        let height = 0;

        // -------------------------------------------------------------------
        // Build the set of foil lines. Each one gets its own vertical slot,
        // length, horizontal starting offset, and independent timing phases
        // so the whole layer never falls into a mechanical, synced rhythm —
        // it should feel like hand-set linework, not a grid.
        // -------------------------------------------------------------------
        const initLines = () => {
            lines = [];
            const marginY = height * 0.12;
            const usableHeight = height - marginY * 2;

            for (let i = 0; i < LINE_COUNT; i++) {
                const lengthRatio =
                    LINE_MIN_WIDTH_RATIO + Math.random() * (LINE_MAX_WIDTH_RATIO - LINE_MIN_WIDTH_RATIO);
                const lineWidth = width * lengthRatio;

                // Stagger each line's starting x so they fan left/right like the
                // reference invitation-card pattern rather than all left-aligning.
                const maxStartX = Math.max(0, width - lineWidth);
                const startX = Math.random() * maxStartX;

                // Per-segment values that never change frame to frame (progress
                // along the line, the angle base, and the edge taper) are computed
                // once here and reused every frame, instead of being recomputed
                // 16 times per line, 12 lines, 60 times a second.
                const segAngleBase = new Float32Array(SEGMENTS + 1);
                const segTaper = new Float32Array(SEGMENTS + 1);
                const segXOffset = new Float32Array(SEGMENTS + 1);
                for (let s = 0; s <= SEGMENTS; s++) {
                    const progress = s / SEGMENTS;
                    segAngleBase[s] = progress * Math.PI * 2;
                    segTaper[s] = Math.sin(progress * Math.PI); // fades the wave to 0 at both ends
                    segXOffset[s] = progress * lineWidth;
                }

                lines.push({
                    y: marginY + (usableHeight * (i + 0.5)) / LINE_COUNT,
                    baseX: startX,
                    lineWidth,
                    wavePhase: Math.random() * Math.PI * 2,
                    waveSpeedMul: 0.7 + Math.random() * 0.6,
                    driftPhase: Math.random() * Math.PI * 2,
                    shimmerPhase: Math.random(), // 0..1, own starting point along the sweep
                    shimmerSpeedMul: 0.6 + Math.random() * 0.8,
                    thickness: 0.8 + Math.random() * 0.6,
                    segAngleBase,
                    segTaper,
                    segXOffset,
                    // Reusable scratch buffers for this line's curve points — mutated
                    // in place every frame instead of allocating new objects/arrays.
                    pointsX: new Float32Array(SEGMENTS + 1),
                    pointsY: new Float32Array(SEGMENTS + 1),
                });
            }
        };

        // -------------------------------------------------------------------
        // Resize handling — keeps the canvas crisp and full-viewport.
        // -------------------------------------------------------------------
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initLines();
        };

        window.addEventListener('resize', resize);
        resize();

        // -------------------------------------------------------------------
        // Draw one foil line as a gently bowed curve (a very shallow wave,
        // not a straight rule) with a soft gradient that sweeps a brighter
        // highlight along its length, like light catching foil as it tilts.
        // -------------------------------------------------------------------
        const drawLine = (line, t) => {
            const x0 = line.baseX + Math.sin(t * DRIFT_SPEED + line.driftPhase) * DRIFT_RANGE;
            const { segAngleBase, segTaper, segXOffset, pointsX, pointsY } = line;
            const waveT = t * WAVE_SPEED * line.waveSpeedMul + line.wavePhase;

            // Mutate the preallocated buffers in place — no per-frame object or
            // array allocation, which keeps garbage collection pressure flat
            // regardless of how long the animation has been running.
            for (let s = 0; s <= SEGMENTS; s++) {
                pointsX[s] = x0 + segXOffset[s];
                pointsY[s] = line.y + Math.sin(segAngleBase[s] + waveT) * WAVE_AMPLITUDE * segTaper[s];
            }

            // Moving shimmer position along the line, looping smoothly from 0..1
            const shimmerPos = (t * SHIMMER_SPEED * line.shimmerSpeedMul + line.shimmerPhase) % 1;
            const sweepStart = Math.max(0, shimmerPos - SHIMMER_WIDTH / 2);
            const sweepEnd = Math.min(1, shimmerPos + SHIMMER_WIDTH / 2);

            const gradient = ctx.createLinearGradient(x0, line.y, x0 + line.lineWidth, line.y);
            gradient.addColorStop(0, COLOR_EDGE);
            if (sweepStart > 0) {
                gradient.addColorStop(sweepStart, COLOR_MID);
            }
            gradient.addColorStop(Math.min(1, Math.max(0, shimmerPos)), COLOR_HIGHLIGHT);
            if (sweepEnd < 1) {
                gradient.addColorStop(sweepEnd, COLOR_MID);
            }
            gradient.addColorStop(1, COLOR_EDGE);

            ctx.beginPath();
            ctx.moveTo(pointsX[0], pointsY[0]);
            for (let s = 1; s <= SEGMENTS; s++) {
                const midX = (pointsX[s - 1] + pointsX[s]) / 2;
                const midY = (pointsY[s - 1] + pointsY[s]) / 2;
                ctx.quadraticCurveTo(pointsX[s - 1], pointsY[s - 1], midX, midY);
            }
            ctx.strokeStyle = gradient;
            ctx.lineWidth = line.thickness;
            ctx.lineCap = 'round';
            ctx.stroke();
        };

        // -------------------------------------------------------------------
        // Main animation loop — a plain clear each frame keeps the thin foil
        // lines crisp; nothing here needs the soft trailing look of smoke.
        // Rendering pauses entirely while the tab isn't visible, since an
        // off-screen animation only burns battery and CPU for nothing.
        // -------------------------------------------------------------------
        const animate = (timestamp) => {
            if (!document.hidden) {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < lines.length; i++) {
                    drawLine(lines[i], timestamp);
                }
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        cleanupFn = () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
        };

        if ('requestIdleCallback' in window) {
            const idleId = requestIdleCallback(init, { timeout: 2000 });
            return () => {
                cancelIdleCallback(idleId);
                cleanupFn?.();
            };
        } else {
            const t = setTimeout(init, 300);
            return () => {
                clearTimeout(t);
                cleanupFn?.();
            };
        }
    }, [canvasRef]);
};

export default function GlobalParticles() {
    const canvasRef = useRef(null);
    useGoldFoilLines(canvasRef);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-60"
        />
    );
}